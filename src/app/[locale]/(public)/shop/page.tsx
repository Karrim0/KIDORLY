import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ShopClient } from "./shop-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: "shop" });
  return { title: `${t("title")} — Kidorly` };
}

export default async function ShopPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { category?: string; sort?: string; q?: string };
}) {
  const where: Record<string, unknown> = {};
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  // Search by name across all languages
  if (searchParams.q) {
    where.OR = [
      { nameEn: { contains: searchParams.q, mode: "insensitive" } },
      { nameAr: { contains: searchParams.q, mode: "insensitive" } },
      { nameDe: { contains: searchParams.q, mode: "insensitive" } },
      { shortDescEn: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> = {};
  switch (searchParams.sort) {
    case "price_asc": orderBy.price = "asc"; break;
    case "price_desc": orderBy.price = "desc"; break;
    case "name": orderBy.nameEn = "asc"; break;
    default: orderBy.createdAt = "desc";
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      activeCategory={searchParams.category}
      activeSort={searchParams.sort}
      searchQuery={searchParams.q}
    />
  );
}
