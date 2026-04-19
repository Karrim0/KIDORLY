import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductDetailClient } from "./product-detail-client";
import type { Locale } from "@/lib/i18n";

interface Props { params: { locale: Locale; slug: string } }

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  const titleKey = `seoTitle${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  const descKey = `seoDesc${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  return {
    title: (product[titleKey] as string) || `${product[nameKey]} — Kidorly`,
    description: (product[descKey] as string) || "",
  };
}

export default async function ProductPage({ params: { locale, slug } }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      availability: "AVAILABLE",
    },
    include: { category: true },
    take: 4,
  });

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
