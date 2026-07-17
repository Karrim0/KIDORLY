import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { HomeClient } from "./home-client";
import type { HomeSectionConfig, HomeSectionKey } from "./home-client";
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
  const [categories, featuredProducts, brands, collections, ageGroups, homepageSections] =
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
            include: {
              _count: {
                select: {
                  products: true,
                },
              },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { featured: "desc" }, { createdAt: "desc" }],
        take: 14,
      }),

      prisma.product.findMany({
        where: {
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
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),

      prisma.ageGroup.findMany({
        where: {
          visible: true,
          featured: true,
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
          products: {
            where: {
              product: {
                availability: "AVAILABLE",
              },
            },
            include: {
              product: {
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
              },
            },
            orderBy: {
              assignedAt: "desc",
            },
            take: 4,
          },
        },
        orderBy: [{ sortOrder: "asc" }, { minAgeMonths: "asc" }],
        take: 8,
      }),

      prisma.homepageSection.findMany({
        where: {
          sectionKey: {
            in: [
              "hero",
              "categories",
              "featured_products",
              "collections",
              "age_groups",
              "partners",
              "experience",
            ],
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
    ]);

  const heroSection = homepageSections.find((section) => section.sectionKey === "hero");
  let heroContent: Record<string, string> | undefined;
  if (heroSection?.visible) {
    try {
      heroContent = JSON.parse(heroSection.data) as Record<string, string>;
    } catch {
      heroContent = undefined;
    }
  }

  const configurableKeys = new Set<HomeSectionKey>([
    "categories",
    "featured_products",
    "collections",
    "age_groups",
    "partners",
    "experience",
  ]);
  const sectionConfig = homepageSections
    .filter((section) => configurableKeys.has(section.sectionKey as HomeSectionKey))
    .map(
      (section): HomeSectionConfig => ({
        sectionKey: section.sectionKey as HomeSectionKey,
        sortOrder: section.sortOrder,
        visible: section.visible,
      }),
    );

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
        heroContent={heroContent}
        sectionConfig={sectionConfig}
      />
    </>
  );
}
