import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { HomeClient } from "./home-client";
import type { Locale } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `Kidorly — ${t("title")}`,
    description: t("subtitle"),
    alternates: localizedAlternates(locale),
    openGraph: {
      title: `Kidorly — ${t("title")}`,
      description: t("subtitle"),
      url: new URL(`/${locale}`, baseUrl).toString(),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
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
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kidorly",
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com"}/${locale}`,
            logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com"}/images/logo.webp`,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Kidorly",
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com"}/${locale}`,
            inLanguage: locale,
          },
        ]}
      />
      <HomeClient
        categories={categories}
        featuredProducts={featuredProducts}
        brands={brands}
        collections={collections}
        ageGroups={ageGroups}
      />
    </>
  );
}
