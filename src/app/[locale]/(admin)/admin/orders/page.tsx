import prisma from "@/lib/prisma";
import { OrdersListClient } from "./orders-list-client";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; payment?: string; search?: string };
}) {
  const where: Record<string, unknown> = {};

  if (searchParams.payment === "PAID" || searchParams.payment === "UNPAID") {
    where.paymentStatus = searchParams.payment;
  }
  if (searchParams.status === "DELIVERED" || searchParams.status === "NOT_DELIVERED") {
    where.deliveryStatus = searchParams.status;
  }
  if (searchParams.search) {
    where.OR = [
      { orderNumber: { contains: searchParams.search, mode: "insensitive" } },
      { customerName: { contains: searchParams.search, mode: "insensitive" } },
      { whatsappNumber: { contains: searchParams.search } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return <OrdersListClient orders={orders} filters={searchParams} />;
}
