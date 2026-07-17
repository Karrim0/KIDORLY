"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function updateOrderPaymentStatus(orderId: string, status: "UNPAID" | "PAID") {
  await requireAdmin();
  return prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: status },
  });
}

export async function updateOrderDeliveryStatus(orderId: string, status: "NOT_DELIVERED" | "DELIVERED") {
  await requireAdmin();
  return prisma.order.update({
    where: { id: orderId },
    data: { deliveryStatus: status },
  });
}
