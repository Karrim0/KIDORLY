import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/orders (admin only)
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const payment = searchParams.get("payment");
  const delivery = searchParams.get("delivery");

  const where: Record<string, unknown> = {};
  if (payment === "PAID" || payment === "UNPAID") where.paymentStatus = payment;
  if (delivery === "DELIVERED" || delivery === "NOT_DELIVERED") where.deliveryStatus = delivery;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
