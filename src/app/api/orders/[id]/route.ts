import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: { id: string };
}

// GET /api/orders/[id] (admin only)
export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
    const data = await request.json();
    const allowedFields = ["paymentStatus", "deliveryStatus"];
    const updateData: Record<string, string> = {};

    for (const field of allowedFields) {
      if (data[field]) updateData[field] = data[field];
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
