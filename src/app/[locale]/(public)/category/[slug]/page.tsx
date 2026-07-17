import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/lib/prisma";
import { ShopClient } from "../../shop/shop-client";
import type { Locale } from "@/lib/i18n";
import { parseOptionalPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{
    brand?: string;
    collection?: string;
    tag?: string;
    ageGroup?: string;
    sort?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

type RelatedCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameDe: string;
  image: string | null;
  icon: string | null;
  banner: string | null;
  _count?: {
    products: number;
  };
};

function localizedField(locale: Locale, field: "name" | "seoTitle" | "seoDesc") {
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  return `${field}${suffix}`;
}

function getCategoryName(
  category: {
    nameEn: string;
    nameAr: string;
    nameDe: string;
  },
  locale: Locale,
) {
  if (locale === "ar") return category.nameAr || category.nameEn;
  if (locale === "de") return category.nameDe || category.nameEn;

  return category.nameEn || category.nameAr;
}

function getUiText(locale: Locale) {
  if (locale === "ar") {
    return {
      relatedTitle: "فئات مرتبطة",
      relatedSubtitle: "اكتشف فئات قريبة قد تناسب نفس الاهتمام.",
      products: "منتج",
    };
  }

  if (locale === "de") {
    return {
      relatedTitle: "Ähnliche Kategorien",
      relatedSubtitle:
        "Entdecke weitere Kategorien, die zu diesem Bereich passen.",
      products: "Produkte",
    };
  }

  return {
    relatedTitle: "Related Categories",
    relatedSubtitle: "Explore nearby categories that match the same interest.",
    products: "products",
  };
}

function mergeRelatedCategories(
  relatedTo: RelatedCategory[],
  relatedFrom: RelatedCategory[],
) {
  const map = new Map<string, RelatedCategory>();

  [...relatedTo, ...relatedFrom].forEach((category) => {
    map.set(category.id, category);
  });

  return Array.from(map.values());
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return {};

  const nameKey = localizedField(locale, "name") as keyof typeof category;
  const seoTitleKey = localizedField(
    locale,
    "seoTitle",
  ) as keyof typeof category;
  const seoDescKey = localizedField(locale, "seoDesc") as keyof typeof category;

  return {
    title: (category[seoTitleKey] as string) || `${category[nameKey]} — Kidorly`,
    description: (category[seoDescKey] as string) || undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams: searchParamsPromise,
}: Props) {
  const [{ locale, slug }, searchParams] = await Promise.all([
    params,
    searchParamsPromise,
  ]);
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      relatedTo: {
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
          banner: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      },

      relatedFrom: {
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
          banner: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!category || category.visible === false) notFound();

  const minPrice = parseOptionalPrice(searchParams.minPrice);
  const maxPrice = parseOptionalPrice(searchParams.maxPrice);

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

    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
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

  const relatedCategories = mergeRelatedCategories(
    category.relatedTo,
    category.relatedFrom,
  );

  const uiText = getUiText(locale);

  return (
    <>
      {relatedCategories.length > 0 && (
        <section
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="container mt-8 px-4 md:px-6"
        >
          <div className="rounded-[2rem] border border-border/60 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex flex-col gap-1">
              <h2 className="text-xl font-extrabold tracking-tight text-gray-950 md:text-2xl">
                {uiText.relatedTitle}
              </h2>

              <p className="text-sm text-muted-foreground">
                {uiText.relatedSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {relatedCategories.slice(0, 8).map((relatedCategory) => {
                const image =
                  relatedCategory.banner ||
                  relatedCategory.image ||
                  relatedCategory.icon;

                return (
                  <Link
                    key={relatedCategory.id}
                    href={`/${locale}/category/${relatedCategory.slug}`}
                    className="group overflow-hidden rounded-2xl border bg-gray-50 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">
                      {image ? (
                        <Image
                          src={image}
                          alt={getCategoryName(relatedCategory, locale)}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-primary">
                          {getCategoryName(relatedCategory, locale)}
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-extrabold text-gray-950 group-hover:text-primary">
                        {getCategoryName(relatedCategory, locale)}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {relatedCategory._count?.products || 0}{" "}
                        {uiText.products}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
    </>
  );
}
