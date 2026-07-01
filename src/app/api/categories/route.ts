import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

// GET /api/categories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const publicOnly = searchParams.get("public") === "true";
  const featuredOnly = searchParams.get("featured") === "true";
  const rootOnly = searchParams.get("root") === "true";
  const q = searchParams.get("q")?.trim();

  try {
    const categories = await prisma.category.findMany({
      where: {
        ...(publicOnly ? { visible: true } : {}),
        ...(featuredOnly ? { featured: true } : {}),
        ...(rootOnly ? { parentId: null } : {}),
        ...(q
          ? {
              OR: [
                { nameEn: { contains: q, mode: "insensitive" } },
                { nameAr: { contains: q, mode: "insensitive" } },
                { nameDe: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        parent: {
          select: {
            id: true,
            slug: true,
            nameAr: true,
            nameEn: true,
            nameDe: true,
          },
        },
        children: {
          where: publicOnly ? { visible: true } : undefined,
          select: {
            id: true,
            slug: true,
            nameAr: true,
            nameEn: true,
            nameDe: true,
            image: true,
            icon: true,
            visible: true,
            featured: true,
            sortOrder: true,
          },
          orderBy: [
            { sortOrder: "asc" },
            { createdAt: "desc" },
          ],
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({
      data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}