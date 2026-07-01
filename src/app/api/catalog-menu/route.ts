import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, collections, ageGroups, brands] = await Promise.all([
      prisma.category.findMany({
        where: {
          visible: true,
          parentId: null,
        },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          nameDe: true,
          image: true,
          icon: true,
          featured: true,
          sortOrder: true,
          children: {
            where: {
              visible: true,
            },
            select: {
              id: true,
              slug: true,
              nameEn: true,
              nameAr: true,
              nameDe: true,
              image: true,
              icon: true,
              featured: true,
              sortOrder: true,
              _count: {
                select: {
                  products: true,
                },
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            take: 8,
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [
          { featured: "desc" },
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
        take: 10,
      }),

      prisma.collection.findMany({
        where: {
          visible: true,
        },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          nameDe: true,
          featured: true,
          sortOrder: true,
        },
        orderBy: [
          { featured: "desc" },
          { sortOrder: "asc" },
          { createdAt: "desc" },
        ],
        take: 8,
      }),

      prisma.ageGroup.findMany({
        where: {
          visible: true,
        },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          nameDe: true,
          minAgeMonths: true,
          maxAgeMonths: true,
          featured: true,
          sortOrder: true,
        },
        orderBy: [
          { featured: "desc" },
          { sortOrder: "asc" },
          { minAgeMonths: "asc" },
        ],
        take: 8,
      }),

      prisma.brand.findMany({
        where: {
          products: {
            some: {
              availability: "AVAILABLE",
            },
          },
        },
        select: {
          id: true,
          slug: true,
          nameEn: true,
          nameAr: true,
          nameDe: true,
          featured: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
    ]);

    return NextResponse.json({
      categories,
      collections,
      ageGroups,
      brands,
    });
  } catch (error) {
    console.error("Catalog menu API error:", error);

    return NextResponse.json(
      {
        categories: [],
        collections: [],
        ageGroups: [],
        brands: [],
      },
      { status: 500 },
    );
  }
}