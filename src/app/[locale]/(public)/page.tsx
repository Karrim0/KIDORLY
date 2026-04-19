import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { HomeClient } from "./home-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `Kidorly — ${t("title")}`,
    description: t("subtitle"),
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({
      where: { featured: true, availability: "AVAILABLE" },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <HomeClient categories={categories} featuredProducts={featuredProducts} />;
}
