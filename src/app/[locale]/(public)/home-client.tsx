"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Baby,
  CalendarHeart,
  Layers3,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import {
  HeroSection,
  type HeroContent,
} from "@/components/public/hero-section";
import { ExperienceSection } from "@/components/public/home-sections";
import { Reveal } from "@/components/shared/reveal";
import { cn, getTranslated } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type {
  AgeGroupBasic,
  BrandFull,
  CategoryFull,
  CollectionFull,
  ProductWithCategory,
} from "@/types";

type PartnerBrand = Pick<
  BrandFull,
  "id" | "slug" | "nameAr" | "nameEn" | "nameDe" | "logo"
>;

type HomeCategory = CategoryFull & { children?: CategoryFull[] };

interface HomeClientProps {
  categories: HomeCategory[];
  featuredProducts: ProductWithCategory[];
  brands?: PartnerBrand[];
  collections?: CollectionFull[];
  ageGroups?: AgeGroupBasic[];
  heroContent?: HeroContent;
}

function homeCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      categoriesEyebrow: "ابدأ من هنا",
      categoriesTitle: "كل اللي صغيرك بيحبه في مكان واحد",
      categoriesSubtitle: "اختار القسم المناسب وابدأ تجربة تسوق سريعة وواضحة.",
      productsEyebrow: "مختارات كيدورلي",
      productsSubtitle: "منتجات مميزة اختارناها عشان تسهّل عليك القرار.",
      discoveryEyebrow: "اختيار أذكى",
      discoveryTitle: "تسوّق حسب الكولكشن أو العمر",
      discoverySubtitle: "الأدمن بيحدد اللي يظهر هنا وترتيبه عشان توصّل للمنتج الصح أسرع.",
      collections: "الكولكشنز المميزة",
      ages: "اختار حسب العمر",
      explore: "اكتشف الآن",
      partners: "شركاؤنا",
      partnersSubtitle: "براندات موثوقة بتكمل تجربة كيدورلي.",
      products: "منتجات",
    };
  }

  if (locale === "de") {
    return {
      categoriesEyebrow: "Hier starten",
      categoriesTitle: "Alles, was Kinder lieben, an einem Ort",
      categoriesSubtitle: "Wähle eine Kategorie und starte ein schnelles, klares Einkaufserlebnis.",
      productsEyebrow: "Kidorly Auswahl",
      productsSubtitle: "Besondere Produkte, die deine Entscheidung leichter machen.",
      discoveryEyebrow: "Clever auswählen",
      discoveryTitle: "Nach Kollektion oder Alter einkaufen",
      discoverySubtitle: "Der Admin bestimmt Inhalt und Reihenfolge, damit du schneller das Richtige findest.",
      collections: "Ausgewählte Kollektionen",
      ages: "Nach Alter wählen",
      explore: "Jetzt entdecken",
      partners: "Unsere Partner",
      partnersSubtitle: "Vertrauenswürdige Marken für ein rundes Kidorly Erlebnis.",
      products: "Produkte",
    };
  }

  return {
    categoriesEyebrow: "Start here",
    categoriesTitle: "Everything kids love, in one place",
    categoriesSubtitle: "Pick a category and start a fast, clear shopping experience.",
    productsEyebrow: "Kidorly picks",
    productsSubtitle: "Standout products selected to make your choice easier.",
    discoveryEyebrow: "Shop smarter",
    discoveryTitle: "Browse by collection or age",
    discoverySubtitle: "The admin controls what appears and its order, helping you find the right product faster.",
    collections: "Featured collections",
    ages: "Choose by age",
    explore: "Explore now",
    partners: "Our partners",
    partnersSubtitle: "Trusted brands that complete the Kidorly experience.",
    products: "products",
  };
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  action,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  action?: string;
  centered?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "mb-7 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between",
          centered && "items-center text-center md:flex-col md:items-center",
        )}
      >
        <div className="max-w-2xl">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-brand-coral sm:text-xs">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-black leading-tight tracking-[-.035em] text-slate-950 sm:text-3xl lg:text-[2.65rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm font-medium leading-6 text-slate-500 sm:text-base sm:leading-7">
              {subtitle}
            </p>
          )}
        </div>

        {href && action && (
          <Button variant="outline" className="h-11 w-fit rounded-full border-slate-200 bg-white px-5 font-extrabold shadow-sm" asChild>
            <Link href={href}>
              {action}
              <ArrowRight className="ms-1 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        )}
      </div>
    </Reveal>
  );
}

function CategoriesSection({ categories }: { categories: HomeCategory[] }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);

  if (!categories.length) return null;

  return (
    <section id="discover" className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="home-blob home-blob-coral -start-24 top-10" />
      <div className="home-blob home-blob-sky -end-28 bottom-0" />

      <div className="container relative">
        <SectionHeading
          eyebrow={copy.categoriesEyebrow}
          title={copy.categoriesTitle}
          subtitle={copy.categoriesSubtitle}
          href={`/${locale}/shop`}
          action={t("common.viewAll")}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {categories.slice(0, 12).map((category, index) => {
            const name = getTranslated(category, "name", locale);
            const image = category.image || category.banner || category.icon;
            const count = category._count?.products || 0;

            return (
              <Reveal key={category.id} delay={(index % 6) * 55} className="h-full">
                <Link
                  href={`/${locale}/category/${category.slug}`}
                  className="category-tile group relative flex min-h-[185px] h-full overflow-hidden rounded-[1.6rem] border border-slate-100 bg-slate-100 shadow-[0_12px_36px_rgba(15,23,42,.08)] sm:min-h-[220px]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-coral/15 via-white to-brand-sky/20">
                      <Layers3 className="h-12 w-12 text-brand-coral/70" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                  {category.featured && (
                    <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-brand-coral shadow-lg backdrop-blur">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  )}

                  <div className="relative mt-auto w-full p-4 text-white">
                    <span className="mb-2 inline-flex rounded-full border border-white/15 bg-white/12 px-2.5 py-1 text-[9px] font-black backdrop-blur-md sm:text-[10px]">
                      {count} {copy.products}
                    </span>
                    <h3 className="line-clamp-2 text-base font-black leading-tight sm:text-lg">
                      {name}
                    </h3>
                    <span className="mt-2 inline-flex items-center text-[10px] font-extrabold text-white/75 transition group-hover:text-brand-sun sm:text-xs">
                      {copy.explore}
                      <ArrowRight className="ms-1 h-3.5 w-3.5 rtl:rotate-180" />
                    </span>
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

function FeaturedProductsSection({ products }: { products: ProductWithCategory[] }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);

  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-12 sm:py-16 lg:py-24">
      <div className="container relative">
        <SectionHeading
          eyebrow={copy.productsEyebrow}
          title={t("sections.featuredProducts")}
          subtitle={copy.productsSubtitle}
          href={`/${locale}/shop`}
          action={t("common.viewAll")}
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatAgeRange(group: AgeGroupBasic, locale: Locale) {
  const { minAgeMonths, maxAgeMonths } = group;
  if (minAgeMonths == null && maxAgeMonths == null) return null;
  const unit = locale === "ar" ? "شهر" : locale === "de" ? "Monate" : "months";
  if (minAgeMonths == null) return `${locale === "ar" ? "حتى" : "Up to"} ${maxAgeMonths} ${unit}`;
  if (maxAgeMonths == null) return `${minAgeMonths}+ ${unit}`;
  return `${minAgeMonths}–${maxAgeMonths} ${unit}`;
}

function DiscoverySection({
  collections,
  ageGroups,
}: {
  collections: CollectionFull[];
  ageGroups: AgeGroupBasic[];
}) {
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);

  if (!collections.length && !ageGroups.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="home-blob home-blob-sun start-1/3 top-0" />
      <div className="container relative">
        <SectionHeading
          eyebrow={copy.discoveryEyebrow}
          title={copy.discoveryTitle}
          subtitle={copy.discoverySubtitle}
        />

        {collections.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950 sm:text-lg">
              <CalendarHeart className="h-5 w-5 text-brand-coral" />
              {copy.collections}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 6).map((collection, index) => {
                const name = getTranslated(collection, "name", locale);
                const description = getTranslated(collection, "description", locale);
                const image = collection.banner || collection.image;

                return (
                  <Reveal key={collection.id} delay={(index % 3) * 80}>
                    <Link
                      href={`/${locale}/shop?collection=${collection.slug}`}
                      className="collection-card group relative flex min-h-[220px] overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_16px_44px_rgba(15,23,42,.14)] sm:min-h-[270px]"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(78,205,196,.6),transparent_34%),linear-gradient(135deg,#ff6b6b,#2c6fbb)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/36 to-transparent" />
                      <div className="relative mt-auto w-full p-5 text-white sm:p-6">
                        <span className="mb-2 inline-flex rounded-full bg-brand-sun px-2.5 py-1 text-[9px] font-black uppercase tracking-[.12em] text-slate-950">
                          {collection.type}
                        </span>
                        <h4 className="text-xl font-black sm:text-2xl">{name}</h4>
                        {description && (
                          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-white/72 sm:text-sm">
                            {description}
                          </p>
                        )}
                        <span className="mt-3 inline-flex items-center text-xs font-black text-brand-sun">
                          {copy.explore}
                          <ArrowRight className="ms-1 h-4 w-4 rtl:rotate-180" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {ageGroups.length > 0 && (
          <div className={cn("mt-9", collections.length > 0 && "sm:mt-12")}>
            <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950 sm:text-lg">
              <Baby className="h-5 w-5 text-brand-ocean" />
              {copy.ages}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {ageGroups.slice(0, 12).map((group, index) => {
                const name = getTranslated(group, "name", locale);
                const range = formatAgeRange(group, locale);
                const tones = [
                  "from-[#fff0f0] to-[#fff9e8] text-brand-coral",
                  "from-[#eafaf8] to-[#eef6ff] text-brand-ocean",
                  "from-[#f4efff] to-[#fff1f7] text-violet-600",
                ];

                return (
                  <Reveal key={group.id} delay={(index % 6) * 45}>
                    <Link
                      href={`/${locale}/shop?ageGroup=${group.slug}`}
                      className={cn(
                        "age-card group flex min-h-[135px] flex-col justify-between rounded-[1.5rem] border border-white bg-gradient-to-br p-4 shadow-[0_10px_30px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,.11)] sm:min-h-[150px]",
                        tones[index % tones.length],
                      )}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/85 shadow-sm">
                        <Baby className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="line-clamp-2 text-sm font-black leading-tight text-slate-950 sm:text-base">
                          {name}
                        </h4>
                        {range && <p className="mt-1 text-[10px] font-extrabold opacity-75 sm:text-xs">{range}</p>}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PartnersSection({ brands }: { brands: PartnerBrand[] }) {
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);

  if (!brands.length) return null;

  const repeatedBrands = Array.from({
    length: Math.max(1, Math.ceil(8 / brands.length)),
  }).flatMap(() => brands);

  return (
    <section className="overflow-hidden border-y border-slate-100 bg-[#fbfcfe] py-12 sm:py-16 lg:py-20">
      <div className="container">
        <SectionHeading
          eyebrow="Kidorly network"
          title={copy.partners}
          subtitle={copy.partnersSubtitle}
          centered
        />
      </div>

      <div className="partners-loop relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 bg-gradient-to-r from-[#fbfcfe] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-[#fbfcfe] to-transparent sm:w-32" />
        <div className={cn("partners-loop-track", locale === "ar" && "partners-loop-track-rtl")}>
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="partners-loop-group" aria-hidden={groupIndex === 1}>
              {repeatedBrands.map((brand, index) => {
                const name = getTranslated(brand, "name", locale);
                return (
                  <Link
                    key={`${groupIndex}-${brand.id}-${index}`}
                    href={`/${locale}/brand/${brand.slug}`}
                    aria-label={name}
                    className="group flex h-24 w-32 shrink-0 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:border-brand-sky/50 hover:shadow-[0_16px_38px_rgba(15,23,42,.11)] sm:h-28 sm:w-40"
                  >
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={name}
                        width={150}
                        height={80}
                        className="max-h-14 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                      />
                    ) : (
                      <span className="text-center text-xs font-black text-brand-ocean sm:text-sm">{name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
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
  heroContent,
}: HomeClientProps) {
  return (
    <>
      <HeroSection content={heroContent} />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <DiscoverySection collections={collections} ageGroups={ageGroups} />
      <PartnersSection brands={brands} />
      <ExperienceSection />
    </>
  );
}
