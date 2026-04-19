import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ShopClient } from "../../shop/shop-client";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: { locale: Locale; slug: string };
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof category;
  const seoKey = `seoTitle${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof category;
  return {
    title: (category[seoKey] as string) || `${category[nameKey]} — Kidorly`,
  };
}

export default async function CategoryPage({ params: { locale, slug } }: Props) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });

  return (
    <ShopClient
      products={products}
      categories={categories}
      activeCategory={slug}
    />
  );
}
