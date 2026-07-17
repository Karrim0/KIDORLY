import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { getEffectiveDiscount, getDiscountedPrice } from "@/lib/utils";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";

function parseMoney(value: string | null, fallback: number) {
  const parsed = Number.parseFloat(value || "");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getProductName(
  product: { nameAr: string; nameEn: string; nameDe: string },
  locale: "ar" | "en" | "de",
) {
  if (locale === "ar") return product.nameAr || product.nameEn;
  if (locale === "de") return product.nameDe || product.nameEn;
  return product.nameEn;
}

// POST /api/orders/checkout — public endpoint for placing orders
export async function POST(request: Request) {
  let recoveryKey: string | null = null;

  try {
    const rateLimit = consumeRateLimit(`checkout:${getClientIp(request)}`, {
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many checkout attempts. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }

    const body = await request.json();

    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Checkout validation error:", parsed.error.flatten());

      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkout data",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const idempotencyKey = request.headers.get("idempotency-key")?.trim();

    if (!idempotencyKey || !/^[a-zA-Z0-9_-]{16,128}$/.test(idempotencyKey)) {
      return NextResponse.json(
        { success: false, error: "A valid idempotency key is required" },
        { status: 400 },
      );
    }

    recoveryKey = idempotencyKey;

    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
      select: { id: true, orderNumber: true, accessToken: true },
    });

    if (existingOrder) {
      return NextResponse.json({ success: true, order: existingOrder });
    }

    const productIds = Array.from(new Set(data.items.map((item) => item.productId)));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: { select: { discountPercentage: true } } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more products are no longer available" },
        { status: 409 },
      );
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
    const globalDiscount = parseMoney(
      await getSetting(SETTING_KEYS.GLOBAL_DISCOUNT),
      0,
    );

    const verifiedItems = data.items.map((item) => {
      const product = productsById.get(item.productId)!;

      if (product.availability !== "AVAILABLE") {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      if (item.color && product.colors.length > 0 && !product.colors.includes(item.color)) {
        throw new Error("INVALID_VARIANT");
      }

      if (item.size && product.sizes.length > 0 && !product.sizes.includes(item.size)) {
        throw new Error("INVALID_VARIANT");
      }

      const discount = getEffectiveDiscount(
        product.discountPercentage,
        product.category?.discountPercentage,
        globalDiscount,
      );

      return {
        productId: product.id,
        productName: getProductName(product, data.locale),
        price: getDiscountedPrice(product.price, discount),
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        image: product.images[0] || null,
      };
    });

    /*
      الشحن:
      - الأول نجرب shipping حسب المدينة
      - بعدين حسب المحافظة
      - بعدين ALL_EGYPT
      - بعدين DEFAULT
      - لو مفيش أي إعدادات يبقى 0
    */
    const locationKey = data.governorateKey?.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const locationShipping = locationKey
      ? await getSetting(`shipping_${locationKey}`)
      : null;
    const shippingStr =
      locationShipping ||
      (await getSetting(SETTING_KEYS.SHIPPING_ALL_EGYPT)) ||
      (await getSetting(SETTING_KEYS.SHIPPING_DEFAULT));

    const shippingCost = parseMoney(shippingStr, 200);

    const subtotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const total = subtotal + shippingCost;

    const accessToken = randomBytes(32).toString("hex");
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        idempotencyKey,
        accessToken,

        customerName: data.customerName,
        whatsappNumber: data.whatsappNumber,

        governorate: data.governorate || null,
        city: data.city,

        deliveryType: data.deliveryType,
        address: data.address || null,
        hotelName: data.hotelName || null,
        guestName: data.guestName || null,
        roomNumber: data.roomNumber || null,
        notes: data.notes || null,

        paymentMethod: data.paymentMethod,

        subtotal,
        shippingCost,
        total,

        locale: data.locale,

        items: {
          create: verifiedItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
            image: item.image || null,
          })),
        },
      },
      select: { id: true, orderNumber: true, accessToken: true },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);

    if (
      recoveryKey &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey: recoveryKey },
        select: { id: true, orderNumber: true, accessToken: true },
      });

      if (existingOrder) {
        return NextResponse.json({ success: true, order: existingOrder });
      }
    }

    if (error instanceof Error && error.message === "PRODUCT_UNAVAILABLE") {
      return NextResponse.json(
        { success: false, error: "A product in your cart is unavailable" },
        { status: 409 },
      );
    }

    if (error instanceof Error && error.message === "INVALID_VARIANT") {
      return NextResponse.json(
        { success: false, error: "A selected product option is invalid" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 },
    );
  }
}
