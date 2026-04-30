import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/brands — public list
export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(brands);
}

// POST /api/brands — admin create
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const brand = await prisma.brand.create({
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