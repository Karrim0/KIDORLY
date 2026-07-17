import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

function parseSaleDate(value: unknown) {
  if (!value) return null;
  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function cleanIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function prepareProductPayload(data: Record<string, unknown>) {
  const {
    collectionIds,
    tagIds,
    ageGroupIds,
    saleEndsAt,
    ...rest
  } = data;

  return {
    productData: {
      ...(rest as any),
      saleEndsAt: parseSaleDate(saleEndsAt),
    },
    collectionIds: cleanIdArray(collectionIds),
    tagIds: cleanIdArray(tagIds),
    ageGroupIds: cleanIdArray(ageGroupIds),
  };
}

// GET /api/products/[id]
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      collections: {
        include: {
          collection: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      ageGroups: {
        include: {
          ageGroup: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT /api/products/[id]
export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { productData, collectionIds, tagIds, ageGroupIds } =
      prepareProductPayload(body);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,

        collections: {
          deleteMany: {},
          create: collectionIds.map((collectionId) => ({
            collection: {
              connect: { id: collectionId },
            },
          })),
        },

        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },

        ageGroups: {
          deleteMany: {},
          create: ageGroupIds.map((ageGroupId) => ({
            ageGroup: {
              connect: { id: ageGroupId },
            },
          })),
        },
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}
