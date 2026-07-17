import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] (admin only)
export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

// PATCH /api/orders/[id] — update payment/delivery status (admin only)
export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const updateData: Record<string, string> = {};

    if (data.paymentStatus === "PAID" || data.paymentStatus === "UNPAID") {
      updateData.paymentStatus = data.paymentStatus;
    }

    if (data.deliveryStatus === "DELIVERED" || data.deliveryStatus === "NOT_DELIVERED") {
      updateData.deliveryStatus = data.deliveryStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid status supplied" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
