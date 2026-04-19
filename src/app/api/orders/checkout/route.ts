import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { getSetting, SETTING_KEYS } from "@/lib/settings";

// POST /api/orders/checkout — public endpoint for placing orders
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get shipping cost for the selected city
    const shippingKey =
      data.city === "HURGHADA"
        ? SETTING_KEYS.SHIPPING_HURGHADA
        : data.city === "CAIRO"
        ? SETTING_KEYS.SHIPPING_CAIRO
        : SETTING_KEYS.SHIPPING_ALEXANDRIA;

    const shippingStr = await getSetting(shippingKey);
    const shippingCost = shippingStr ? parseFloat(shippingStr) : 0;

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        whatsappNumber: data.whatsappNumber,
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
      include: { items: true },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
