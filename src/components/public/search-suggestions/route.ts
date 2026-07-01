import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type SuggestionType =
  | "product"
  | "category"
  | "brand"
  | "collection"
  | "tag"
  | "ageGroup";

type SuggestionItem = {
  id: string;
  type: SuggestionType;
  title: string;
  subtitle?: string;
  slug: string;
  href: string;
  image?: string | null;
  badge?: string;
};

function getLocalizedName(
  item: {
    nameEn: string;
    nameAr: string;
    nameDe: string;
  },
  locale: Locale,
) {
  if (locale === "ar") return item.nameAr || item.nameEn;
  if (locale === "de") return item.nameDe || item.nameEn;

  return item.nameEn;
}

function getProductSubtitle(
  product: {
    shortDescEn?: string | null;
    shortDescAr?: string | null;
    shortDescDe?: string | null;
  },
  locale: Locale,
) {
  if (locale === "ar") return product.shortDescAr || product.shortDescEn || "";
  if (locale === "de") return product.shortDescDe || product.shortDescEn || "";

  return product.shortDescEn || "";
}

function normalizeLocale(value: string | null): Locale {
  if (value === "ar" || value === "de" || value === "en") return value;

  return "en";
}

function normalizeLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 6;

  return Math.min(Math.max(parsed, 3), 12);
}

function createSearchWhere(query: string) {
  return {
    OR: [
      { nameEn: { contains: query, mode: "insensitive" as const } },
      { nameAr: { contains: query, mode: "insensitive" as const } },
      { nameDe: { contains: query, mode: "insensitive" as const } },
      { slug: { contains: query, mode: "insensitive" as const } },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query = (searchParams.get("q") || "").trim();
    const locale = normalizeLocale(searchParams.get("locale"));
    const limit = normalizeLimit(searchParams.get("limit"));

    if (!query) {
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
          take: limit,
        }),

        prisma.collection.findMany({
          where: {
            visible: true,
            featured: true,
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
            image: true,
            banner: true,
            featured: true,
          },
          orderBy: [
            { sortOrder: "asc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),

        prisma.ageGroup.findMany({
          where: {
            visible: true,
            featured: true,
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
          },
          orderBy: [
            { sortOrder: "asc" },
            { minAgeMonths: "asc" },
          ],
          take: limit,
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
            logo: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: [
            { featured: "desc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),
      ]);

      const suggestions: SuggestionItem[] = [
        ...categories.map((category) => ({
          id: category.id,
          type: "category" as const,
          title: getLocalizedName(category, locale),
          subtitle:
            locale === "ar"
              ? `${category._count.products} منتج`
              : locale === "de"
                ? `${category._count.products} Produkte`
                : `${category._count.products} products`,
          slug: category.slug,
          href: `/${locale}/category/${category.slug}`,
          image: category.image || category.icon,
          badge:
            locale === "ar"
              ? "فئة"
              : locale === "de"
                ? "Kategorie"
                : "Category",
        })),

        ...collections.map((collection) => ({
          id: collection.id,
          type: "collection" as const,
          title: getLocalizedName(collection, locale),
          slug: collection.slug,
          href: `/${locale}/shop?collection=${collection.slug}`,
          image: collection.image || collection.banner,
          badge:
            locale === "ar"
              ? "كولكشن"
              : locale === "de"
                ? "Kollektion"
                : "Collection",
        })),

        ...ageGroups.map((ageGroup) => ({
          id: ageGroup.id,
          type: "ageGroup" as const,
          title: getLocalizedName(ageGroup, locale),
          slug: ageGroup.slug,
          href: `/${locale}/shop?ageGroup=${ageGroup.slug}`,
          image: null,
          badge:
            locale === "ar"
              ? "عمر"
              : locale === "de"
                ? "Alter"
                : "Age",
        })),

        ...brands.map((brand) => ({
          id: brand.id,
          type: "brand" as const,
          title: getLocalizedName(brand, locale),
          subtitle:
            locale === "ar"
              ? `${brand._count.products} منتج`
              : locale === "de"
                ? `${brand._count.products} Produkte`
                : `${brand._count.products} products`,
          slug: brand.slug,
          href: `/${locale}/shop?brand=${brand.slug}`,
          image: brand.logo,
          badge:
            locale === "ar" ? "براند" : locale === "de" ? "Marke" : "Brand",
        })),
      ];

      return NextResponse.json({
        query,
        suggestions: suggestions.slice(0, limit),
      });
    }

    const [products, categories, brands, collections, tags, ageGroups] =
      await Promise.all([
        prisma.product.findMany({
          where: {
            availability: "AVAILABLE",
            OR: [
              { nameEn: { contains: query, mode: "insensitive" } },
              { nameAr: { contains: query, mode: "insensitive" } },
              { nameDe: { contains: query, mode: "insensitive" } },
              { shortDescEn: { contains: query, mode: "insensitive" } },
              { shortDescAr: { contains: query, mode: "insensitive" } },
              { shortDescDe: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
            shortDescEn: true,
            shortDescAr: true,
            shortDescDe: true,
            images: true,
            price: true,
            discountPercentage: true,
          },
          orderBy: [
            { featured: "desc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),

        prisma.category.findMany({
          where: {
            visible: true,
            ...createSearchWhere(query),
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
            image: true,
            icon: true,
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
          take: limit,
        }),

        prisma.brand.findMany({
          where: {
            ...createSearchWhere(query),
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
            logo: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
          orderBy: [
            { featured: "desc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),

        prisma.collection.findMany({
          where: {
            visible: true,
            ...createSearchWhere(query),
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
            image: true,
            banner: true,
          },
          orderBy: [
            { featured: "desc" },
            { sortOrder: "asc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),

        prisma.tag.findMany({
          where: {
            visible: true,
            ...createSearchWhere(query),
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
          },
          orderBy: [
            { featured: "desc" },
            { sortOrder: "asc" },
            { createdAt: "desc" },
          ],
          take: limit,
        }),

        prisma.ageGroup.findMany({
          where: {
            visible: true,
            ...createSearchWhere(query),
          },
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameAr: true,
            nameDe: true,
          },
          orderBy: [
            { featured: "desc" },
            { sortOrder: "asc" },
            { minAgeMonths: "asc" },
          ],
          take: limit,
        }),
      ]);

    const suggestions: SuggestionItem[] = [
      ...products.map((product) => ({
        id: product.id,
        type: "product" as const,
        title: getLocalizedName(product, locale),
        subtitle: getProductSubtitle(product, locale),
        slug: product.slug,
        href: `/${locale}/product/${product.slug}`,
        image: product.images?.[0] || null,
        badge:
          locale === "ar" ? "منتج" : locale === "de" ? "Produkt" : "Product",
      })),

      ...categories.map((category) => ({
        id: category.id,
        type: "category" as const,
        title: getLocalizedName(category, locale),
        subtitle:
          locale === "ar"
            ? `${category._count.products} منتج`
            : locale === "de"
              ? `${category._count.products} Produkte`
              : `${category._count.products} products`,
        slug: category.slug,
        href: `/${locale}/category/${category.slug}`,
        image: category.image || category.icon,
        badge:
          locale === "ar" ? "فئة" : locale === "de" ? "Kategorie" : "Category",
      })),

      ...brands.map((brand) => ({
        id: brand.id,
        type: "brand" as const,
        title: getLocalizedName(brand, locale),
        subtitle:
          locale === "ar"
            ? `${brand._count.products} منتج`
            : locale === "de"
              ? `${brand._count.products} Produkte`
              : `${brand._count.products} products`,
        slug: brand.slug,
        href: `/${locale}/shop?brand=${brand.slug}`,
        image: brand.logo,
        badge: locale === "ar" ? "براند" : locale === "de" ? "Marke" : "Brand",
      })),

      ...collections.map((collection) => ({
        id: collection.id,
        type: "collection" as const,
        title: getLocalizedName(collection, locale),
        slug: collection.slug,
        href: `/${locale}/shop?collection=${collection.slug}`,
        image: collection.image || collection.banner,
        badge:
          locale === "ar"
            ? "كولكشن"
            : locale === "de"
              ? "Kollektion"
              : "Collection",
      })),

      ...tags.map((tag) => ({
        id: tag.id,
        type: "tag" as const,
        title: getLocalizedName(tag, locale),
        slug: tag.slug,
        href: `/${locale}/shop?tag=${tag.slug}`,
        image: null,
        badge: locale === "ar" ? "خاصية" : locale === "de" ? "Tag" : "Tag",
      })),

      ...ageGroups.map((ageGroup) => ({
        id: ageGroup.id,
        type: "ageGroup" as const,
        title: getLocalizedName(ageGroup, locale),
        slug: ageGroup.slug,
        href: `/${locale}/shop?ageGroup=${ageGroup.slug}`,
        image: null,
        badge:
          locale === "ar" ? "عمر" : locale === "de" ? "Alter" : "Age",
      })),
    ];

    return NextResponse.json({
      query,
      suggestions: suggestions.slice(0, limit),
    });
  } catch (error) {
    console.error("Search suggestions API error:", error);

    return NextResponse.json(
      {
        query: "",
        suggestions: [],
      },
      { status: 500 },
    );
  }
}