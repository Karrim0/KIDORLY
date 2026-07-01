import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { HomeClient } from "./home-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: `Kidorly — ${t("title")}`,
    description: t("subtitle"),
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const [categories, featuredProducts, brands, collections, ageGroups] =
    await Promise.all([
      prisma.category.findMany({
        where: {
          visible: true,
          parentId: null,
        },
        include: {
          children: {
            where: {
              visible: true,
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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
        take: 14,
      }),

      prisma.product.findMany({
        where: {
          featured: true,
          availability: "AVAILABLE",
        },
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
        take: 8,
        orderBy: { createdAt: "desc" },
      }),

      prisma.brand.findMany({
        where: {
          products: {
            some: {
              availability: "AVAILABLE",
            },
          },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 16,
      }),

      prisma.collection.findMany({
        where: {
          visible: true,
          featured: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),

      prisma.ageGroup.findMany({
        where: {
          visible: true,
          featured: true,
        },
        orderBy: [{ sortOrder: "asc" }, { minAgeMonths: "asc" }],
        take: 8,
      }),
    ]);

  return (
    <HomeClient
      categories={categories}
      featuredProducts={featuredProducts}
      brands={brands}
      collections={collections}
      ageGroups={ageGroups}
    />
  );
}