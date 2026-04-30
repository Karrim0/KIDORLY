import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });
  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        nameDe: data.nameDe,
        descriptionEn: data.descriptionEn || null,
        descriptionAr: data.descriptionAr || null,
        descriptionDe: data.descriptionDe || null,
        logo: data.logo || null,
        banner: data.banner || null,
        featured: data.featured || false,
      },
    });
    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Products will have brandId set to null automatically (onDelete: SetNull)
    await prisma.brand.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}