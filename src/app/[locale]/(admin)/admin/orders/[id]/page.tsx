import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderDetailClient } from "./order-detail-client";

export default async function AdminOrderDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();
  return <OrderDetailClient order={order} />;
}
