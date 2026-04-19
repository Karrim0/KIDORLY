"use server";

import prisma from "@/lib/prisma";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { getSetting, SETTING_KEYS } from "@/lib/settings";

export async function createOrder(input: CheckoutInput) {
  // Validate
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Get shipping cost for the selected city
  const shippingKey =
    data.city === "HURGHADA" ? SETTING_KEYS.SHIPPING_HURGHADA :
    data.city === "CAIRO" ? SETTING_KEYS.SHIPPING_CAIRO :
    SETTING_KEYS.SHIPPING_ALEXANDRIA;

  const shippingStr = await getSetting(shippingKey);
  const shippingCost = shippingStr ? parseFloat(shippingStr) : 0;

  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  return { success: true, order };
}

export async function updateOrderPaymentStatus(orderId: string, status: "UNPAID" | "PAID") {
  return prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: status },
  });
}

export async function updateOrderDeliveryStatus(orderId: string, status: "NOT_DELIVERED" | "DELIVERED") {
  return prisma.order.update({
    where: { id: orderId },
    data: { deliveryStatus: status },
  });
}
