import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { getSetting } from "@/lib/settings";

// POST /api/orders/checkout — public endpoint for placing orders
export async function POST(request: Request) {
  try {
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

    /*
      الشحن:
      - الأول نجرب shipping حسب المدينة
      - بعدين حسب المحافظة
      - بعدين ALL_EGYPT
      - بعدين DEFAULT
      - لو مفيش أي إعدادات يبقى 0
    */
    const shippingStr =
  (await getSetting("shipping_ALL_EGYPT")) ||
  (await getSetting("shipping_DEFAULT"));

const shippingCost = shippingStr ? Number.parseFloat(shippingStr) : 200;

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),

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
          create: data.items.map((item) => ({
            productId: item.productId || null,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create order",
      },
      { status: 500 },
    );
  }
}