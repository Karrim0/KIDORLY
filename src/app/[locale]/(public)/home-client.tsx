"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Baby,
  ChevronLeft,
  ChevronRight,
  Layers3,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { HeroSection } from "@/components/public/hero-section";
import {
  WhyChooseUs,
  CityHighlight,
  PaymentMethodsSection,
} from "@/components/public/home-sections";
import { Reveal } from "@/components/shared/reveal";
import { getTranslated, cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type {
  AgeGroupBasic,
  BrandFull,
  CategoryFull,
  CollectionBasic,
  ProductWithCategory,
} from "@/types";

type PartnerBrand = Pick<
  BrandFull,
  "id" | "slug" | "nameAr" | "nameEn" | "nameDe" | "logo"
>;

type HomeCategory = CategoryFull & {
  children?: CategoryFull[];
};

interface HomeClientProps {
  categories: HomeCategory[];
  featuredProducts: ProductWithCategory[];
  brands?: PartnerBrand[];
  collections?: CollectionBasic[];
  ageGroups?: AgeGroupBasic[];
}

function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <Reveal>
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {href && actionLabel && (
          <Button
            variant="ghost"
            className="press-effect w-fit rounded-full px-4"
            asChild
          >
            <Link href={href}>
              {actionLabel}
              <ArrowRight className="ms-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </Reveal>
  );
}

function CategoryCarouselSection({
  categories,
}: {
  categories: HomeCategory[];
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (!categories.length) return null;

  function scroll(direction: "next" | "prev") {
    const element = scrollerRef.current;
    if (!element) return;

    const isRtl = locale === "ar";
    const amount = direction === "next" ? 320 : -320;

    element.scrollBy({
      left: isRtl ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative">
        <SectionHeader
          title={t("sections.featuredCategories")}
          subtitle={
            locale === "ar"
              ? "اختار الفئة المناسبة بسرعة وشوف المنتجات المتاحة لكل نوع."
              : locale === "de"
                ? "Wähle schnell die passende Kategorie und entdecke passende Produkte."
                : "Pick a category quickly and explore matching kids products."
          }
          href={`/${locale}/shop`}
          actionLabel={t("common.viewAll")}
        />

        <div className="mb-4 hidden justify-end gap-2 md:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("prev")}
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("next")}
            aria-label="Next categories"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollerRef}
          className="category-scroll-snap scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 sm:gap-5 md:-mx-2 md:px-2"
        >
          {categories.map((cat, index) => {
            const categoryName = getTranslated(cat, "name", locale);
            const image = cat.banner || cat.image || cat.icon;
            const productCount = cat._count?.products ?? 0;
            const childCount = cat.children?.length ?? 0;

            return (
              <Reveal key={cat.id} delay={index * 60}>
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className={cn(
                    "group relative block h-full w-[74vw] max-w-[280px] shrink-0 overflow-hidden rounded-[2rem]",
                    "border border-gray-100 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.10)]",
                    "transition-all duration-300 md:w-[250px] md:hover:-translate-y-1 md:hover:shadow-[0_18px_48px_rgba(15,23,42,0.14)]"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-coral/15 via-brand-sky/10 to-brand-sun/20">
                    {image ? (
                      <Image
                        src={image}
                        alt={categoryName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 74vw, 250px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Layers3 className="h-12 w-12 text-brand-coral/70" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                    {cat.discountPercentage ? (
                      <span className="absolute start-4 top-4 rounded-full bg-brand-coral px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                        -{cat.discountPercentage}%
                      </span>
                    ) : null}

                    {cat.featured && (
                      <span className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-coral shadow-lg backdrop-blur">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    )}

                    <div className="absolute bottom-4 start-4 end-4">
                      <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-white drop-shadow md:text-xl">
                        {categoryName}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-brand-sky/10 px-3 py-1 text-xs font-bold text-brand-ocean">
                        {productCount}{" "}
                        {locale === "ar"
                          ? "منتج"
                          : locale === "de"
                            ? "Produkte"
                            : "products"}
                      </span>

                      {childCount > 0 && (
                        <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-xs font-bold text-brand-coral">
                          {childCount}{" "}
                          {locale === "ar"
                            ? "فئات فرعية"
                            : locale === "de"
                              ? "Unterkategorien"
                              : "subcategories"}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 flex items-center text-sm font-bold text-gray-950 transition-colors group-hover:text-primary">
                      {locale === "ar"
                        ? "تصفح المنتجات"
                        : locale === "de"
                          ? "Produkte ansehen"
                          : "Explore products"}
                      <ArrowRight className="ms-1 h-4 w-4" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CollectionsSection({
  collections,
  ageGroups,
}: {
  collections: CollectionBasic[];
  ageGroups: AgeGroupBasic[];
}) {
  const locale = useLocale() as Locale;

  if (!collections.length && !ageGroups.length) return null;

  const title =
    locale === "ar"
      ? "اختيارات أسهل حسب المناسبة والعمر"
      : locale === "de"
        ? "Einfacher einkaufen nach Anlass und Alter"
        : "Shop smarter by occasion and age";

  const subtitle =
    locale === "ar"
      ? "استخدم الكولكشنز والأعمار للوصول للمنتج المناسب أسرع."
      : locale === "de"
        ? "Nutze Kollektionen und Altersgruppen, um schneller das passende Produkt zu finden."
        : "Use collections and age groups to reach the right product faster.";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/90 to-white py-12 sm:py-16 md:py-24">
      <div className="container relative">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {collections.length > 0 && (
            <Reveal>
              <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral">
                    <Sparkles className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="font-extrabold text-gray-950">
                      {locale === "ar"
                        ? "الكولكشنز"
                        : locale === "de"
                          ? "Kollektionen"
                          : "Collections"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Best Sellers, New Arrivals, Ramadan...
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/${locale}/shop?collection=${collection.slug}`}
                      className="rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:border-brand-coral/40 hover:bg-brand-coral/10 hover:text-brand-coral"
                    >
                      {getTranslated(collection, "name", locale)}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {ageGroups.length > 0 && (
            <Reveal delay={100}>
              <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sky/10 text-brand-ocean">
                    <Baby className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="font-extrabold text-gray-950">
                      {locale === "ar"
                        ? "الأعمار"
                        : locale === "de"
                          ? "Altersgruppen"
                          : "Age groups"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      0-2, 3-5, 6-9...
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ageGroups.map((ageGroup) => (
                    <Link
                      key={ageGroup.id}
                      href={`/${locale}/shop?ageGroup=${ageGroup.slug}`}
                      className="rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:border-brand-sky/40 hover:bg-brand-sky/10 hover:text-brand-ocean"
                    >
                      {getTranslated(ageGroup, "name", locale)}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function PartnersSection({ brands }: { brands: PartnerBrand[] }) {
  const locale = useLocale() as Locale;

  if (!brands || brands.length === 0) return null;

  const sectionTitle =
    locale === "ar"
      ? "شركاؤنا"
      : locale === "de"
        ? "Unsere Partner"
        : "Our Partners";

  const sectionSubtitle =
    locale === "ar"
      ? "مجموعة من أفضل البراندات الموثوقة لمنتجات الأطفال"
      : locale === "de"
        ? "Ausgewählte Marken für hochwertige Kinderprodukte"
        : "Trusted brands for premium kids products";

  const minItems = 10;
  const repeatedBase = Array.from({
    length: Math.max(1, Math.ceil(minItems / brands.length)),
  }).flatMap(() => brands);

  const marqueeBrands = [...repeatedBase, ...repeatedBase];

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative">
        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-brand-ocean md:text-3xl lg:text-4xl">
              {sectionTitle}
            </h2>

            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-sky" />

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {sectionSubtitle}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-36" />

        <div
          className={cn(
            "partners-marquee flex w-max items-center gap-4 px-5 sm:gap-5 md:gap-7",
            locale === "ar" && "partners-marquee-rtl"
          )}
        >
          {marqueeBrands.map((brand, index) => {
            const brandName = getTranslated(brand, "name", locale);

            return (
              <Link
                key={`${brand.id}-${index}`}
                href={`/${locale}/brand/${brand.slug}`}
                aria-label={brandName}
                className={cn(
                  "group flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full",
                  "border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-brand-sky/60 hover:shadow-[0_16px_38px_rgba(15,23,42,0.12)]",
                  "sm:h-28 sm:w-28 md:h-36 md:w-36"
                )}
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brandName}
                    width={140}
                    height={80}
                    className="max-h-14 w-[78%] object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16 md:max-h-20"
                  />
                ) : (
                  <span className="px-4 text-center text-xs font-bold text-brand-ocean sm:text-sm">
                    {brandName}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeClient({
  categories,
  featuredProducts,
  brands = [],
  collections = [],
  ageGroups = [],
}: HomeClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <>
      <HeroSection />

      <CategoryCarouselSection categories={categories} />

      {featuredProducts.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50/80 to-white py-12 sm:py-16 md:py-24">
          <div className="container">
            <SectionHeader
              title={t("sections.featuredProducts")}
              href={`/${locale}/shop`}
              actionLabel={t("common.viewAll")}
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="press-effect"
                asChild
              >
                <Link href={`/${locale}/shop`}>
                  {t("common.viewAll")}
                  <ArrowRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <CollectionsSection collections={collections} ageGroups={ageGroups} />

      <PartnersSection brands={brands} />

      <WhyChooseUs />
      <CityHighlight />
      <PaymentMethodsSection />
    </>
  );
}