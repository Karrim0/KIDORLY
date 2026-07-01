import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

// GET /api/products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const collection = searchParams.get("collection");
  const tag = searchParams.get("tag");
  const ageGroup = searchParams.get("ageGroup");
  const featured = searchParams.get("featured");
  const availableOnly = searchParams.get("available") === "true";
  const q = searchParams.get("q")?.trim();

  const minPrice = Number(searchParams.get("minPrice") || "");
  const maxPrice = Number(searchParams.get("maxPrice") || "");

  const sort = searchParams.get("sort") || "newest";

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "discount"
          ? { discountPercentage: "desc" as const }
          : { createdAt: "desc" as const };

  const where: any = {
    ...(availableOnly ? { availability: "AVAILABLE" } : {}),
    ...(featured === "true" ? { featured: true } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand: { slug: brand } } : {}),
    ...(collection
      ? {
          collections: {
            some: {
              collection: {
                slug: collection,
              },
            },
          },
        }
      : {}),
    ...(tag
      ? {
          tags: {
            some: {
              tag: {
                slug: tag,
              },
            },
          },
        }
      : {}),
    ...(ageGroup
      ? {
          ageGroups: {
            some: {
              ageGroup: {
                slug: ageGroup,
              },
            },
          },
        }
      : {}),
    ...(!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)
      ? {
          price: {
            ...(!Number.isNaN(minPrice) ? { gte: minPrice } : {}),
            ...(!Number.isNaN(maxPrice) ? { lte: maxPrice } : {}),
          },
        }
      : {}),
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
  };

  const products = await prisma.product.findMany({
    where,
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
    orderBy,
  });

  return NextResponse.json(products);
}

// POST /api/products
export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productData, collectionIds, tagIds, ageGroupIds } =
      prepareProductPayload(body);

    const product = await prisma.product.create({
      data: {
        ...productData,

        collections: {
          create: collectionIds.map((collectionId) => ({
            collection: {
              connect: { id: collectionId },
            },
          })),
        },

        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },

        ageGroups: {
          create: ageGroupIds.map((ageGroupId) => ({
            ageGroup: {
              connect: { id: ageGroupId },
            },
          })),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}