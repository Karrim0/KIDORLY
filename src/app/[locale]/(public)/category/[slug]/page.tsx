import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ShopClient } from "../../shop/shop-client";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: { locale: Locale; slug: string };
  searchParams: {
    brand?: string;
    collection?: string;
    tag?: string;
    ageGroup?: string;
    sort?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

function localizedField(locale: Locale, field: "name" | "seoTitle" | "seoDesc") {
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  return `${field}${suffix}`;
}

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return {};

  const nameKey = localizedField(locale, "name") as keyof typeof category;
  const seoTitleKey = localizedField(locale, "seoTitle") as keyof typeof category;
  const seoDescKey = localizedField(locale, "seoDesc") as keyof typeof category;

  return {
    title: (category[seoTitleKey] as string) || `${category[nameKey]} — Kidorly`,
    description: (category[seoDescKey] as string) || undefined,
  };
}

export default async function CategoryPage({
  params: { slug },
  searchParams,
}: Props) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || category.visible === false) notFound();

  const minPrice = Number(searchParams.minPrice || "");
  const maxPrice = Number(searchParams.maxPrice || "");

  const where: any = {
    availability: "AVAILABLE",
    categoryId: category.id,

    ...(searchParams.brand
      ? {
          brand: {
            slug: searchParams.brand,
          },
        }
      : {}),

    ...(searchParams.collection
      ? {
          collections: {
            some: {
              collection: {
                slug: searchParams.collection,
                visible: true,
              },
            },
          },
        }
      : {}),

    ...(searchParams.tag
      ? {
          tags: {
            some: {
              tag: {
                slug: searchParams.tag,
                visible: true,
              },
            },
          },
        }
      : {}),

    ...(searchParams.ageGroup
      ? {
          ageGroups: {
            some: {
              ageGroup: {
                slug: searchParams.ageGroup,
                visible: true,
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

    ...(searchParams.q
      ? {
          OR: [
            { nameEn: { contains: searchParams.q, mode: "insensitive" } },
            { nameAr: { contains: searchParams.q, mode: "insensitive" } },
            { nameDe: { contains: searchParams.q, mode: "insensitive" } },
            { shortDescEn: { contains: searchParams.q, mode: "insensitive" } },
            { shortDescAr: { contains: searchParams.q, mode: "insensitive" } },
            { shortDescDe: { contains: searchParams.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy =
    searchParams.sort === "price_asc"
      ? { price: "asc" as const }
      : searchParams.sort === "price_desc"
        ? { price: "desc" as const }
        : searchParams.sort === "name"
          ? { nameEn: "asc" as const }
          : searchParams.sort === "discount"
            ? { discountPercentage: "desc" as const }
            : { createdAt: "desc" as const };

  const [products, categories, brands, collections, tags, ageGroups] =
    await Promise.all([
      prisma.product.findMany({
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
      }),

      prisma.category.findMany({
        where: {
          visible: true,
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.brand.findMany({
        where: {
          products: {
            some: {
              availability: "AVAILABLE",
            },
          },
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { nameEn: "asc" }],
      }),

      prisma.collection.findMany({
        where: {
          visible: true,
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.tag.findMany({
        where: {
          visible: true,
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.ageGroup.findMany({
        where: {
          visible: true,
        },
        orderBy: [{ sortOrder: "asc" }, { minAgeMonths: "asc" }],
      }),
    ]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      brands={brands}
      collections={collections}
      tags={tags}
      ageGroups={ageGroups}
      activeCategory={slug}
      activeBrand={searchParams.brand}
      activeCollection={searchParams.collection}
      activeTag={searchParams.tag}
      activeAgeGroup={searchParams.ageGroup}
      activeSort={searchParams.sort}
      searchQuery={searchParams.q}
      minPrice={searchParams.minPrice}
      maxPrice={searchParams.maxPrice}
      categoryPageMode
    />
  );
}