import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categoryUpdateSchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

async function assertValidCategoryParent(categoryId: string, parentId?: string | null) {
  if (!parentId) return;

  if (categoryId === parentId) {
    throw new Error("Category cannot be its own parent.");
  }

  let currentParentId: string | null = parentId;

  for (let depth = 0; depth < 30; depth += 1) {
    if (!currentParentId) return;

    if (currentParentId === categoryId) {
      throw new Error("Invalid parent category. This would create a category loop.");
    }

    const parent = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    currentParentId = parent?.parentId ?? null;
  }

  throw new Error("Category tree is too deep.");
}

// GET /api/categories/[id]
export async function GET(_request: Request, { params }: Params) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: {
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          nameDe: true,
          image: true,
          icon: true,
          banner: true,
          discountPercentage: true,
          visible: true,
          featured: true,
          sortOrder: true,
          parentId: true,
        },
      },
      children: {
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          nameDe: true,
          image: true,
          icon: true,
          banner: true,
          discountPercentage: true,
          visible: true,
          featured: true,
          sortOrder: true,
          parentId: true,
        },
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
      },
      relatedTo: {
        select: {
          id: true,
          slug: true,
          nameAr: true,
          nameEn: true,
          nameDe: true,
          image: true,
          icon: true,
          banner: true,
          discountPercentage: true,
          visible: true,
          featured: true,
          sortOrder: true,
          parentId: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

// PUT /api/categories/[id]
export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = categoryUpdateSchema.parse(body);

    await assertValidCategoryParent(params.id, data.parentId);

    const category = await prisma.category.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 400 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 400 }
    );
  }
}