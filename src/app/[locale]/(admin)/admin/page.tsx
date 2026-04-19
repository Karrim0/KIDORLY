export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    unpaidOrders,
    paidOrders,
    deliveredOrders,
    notDeliveredOrders,
    totalProducts,
    totalCategories,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { deliveryStatus: "DELIVERED" } }),
    prisma.order.count({ where: { deliveryStatus: "NOT_DELIVERED" } }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return (
    <DashboardClient
      stats={{
        totalOrders,
        unpaidOrders,
        paidOrders,
        deliveredOrders,
        notDeliveredOrders,
        totalProducts,
        totalCategories,
      }}
      recentOrders={recentOrders}
    />
  );
}
