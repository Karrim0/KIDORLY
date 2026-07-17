"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Baby,
  BadgeCheck,
  Headphones,
  Layers3,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { CollectionStory } from "@/components/public/collection-story";
import { ExperienceSection } from "@/components/public/home-sections";
import { HeroSection, type HeroContent } from "@/components/public/hero-section";
import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
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

type HomeCategory = Omit<CategoryFull, "children"> & {
  children?: Array<CategoryFull & { _count?: { products: number } }>;
};

export type HomeSectionKey =
  | "categories"
  | "featured_products"
  | "collections"
  | "age_groups"
  | "partners"
  | "experience";

export interface HomeSectionConfig {
  sectionKey: HomeSectionKey;
  sortOrder: number;
  visible: boolean;
}

export type HomeAgeGroup = AgeGroupBasic & {
  _count?: { products: number };
  products?: Array<{ product: ProductWithCategory }>;
};

interface HomeClientProps {
  categories: HomeCategory[];
  featuredProducts: ProductWithCategory[];
  brands?: PartnerBrand[];
  collections?: CollectionFull[];
  ageGroups?: HomeAgeGroup[];
  heroContent?: HeroContent;
  sectionConfig?: HomeSectionConfig[];
}

const DEFAULT_SECTION_CONFIG: HomeSectionConfig[] = [
  { sectionKey: "categories", sortOrder: 10, visible: true },
  { sectionKey: "featured_products", sortOrder: 20, visible: true },
  { sectionKey: "collections", sortOrder: 30, visible: true },
  { sectionKey: "age_groups", sortOrder: 40, visible: true },
  { sectionKey: "partners", sortOrder: 50, visible: true },
  { sectionKey: "experience", sortOrder: 60, visible: true },
];

const CATEGORY_TONES = [
  "from-[#fff0ec] to-[#ffe3db] ring-[#ffb2a6]",
  "from-[#e9faf8] to-[#d6f4f0] ring-[#8bded5]",
  "from-[#fff9df] to-[#fff1b9] ring-[#f3d56a]",
  "from-[#f2edff] to-[#e4dcff] ring-[#b9a6ed]",
  "from-[#edf6ff] to-[#dcecff] ring-[#9ec8ef]",
  "from-[#fff0f6] to-[#ffe0ed] ring-[#f3a8c8]",
];

function homeCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      categoriesEyebrow: "ابدأ من هنا",
      categoriesTitle: "اختار عالم صغيرك",
      categoriesSubtitle: "أقسام واضحة توصلك للمنتج الصح من أول لمسة.",
      productsEyebrow: "مختارات كيدورلي",
      productsSubtitle: "منتجات مميزة اختارناها عشان تسهّل عليك القرار.",
      agesEyebrow: "اختيار مناسب لكل مرحلة",
      agesTitle: "اختار حسب العمر",
      agesSubtitle: "حدد المرحلة وشوف المنتجات اللي الأدمن ربطها بالعمر ده.",
      explore: "اكتشف الآن",
      partners: "شركاؤنا",
      partnersSubtitle: "براندات موثوقة بتكمل تجربة كيدورلي.",
      products: "منتج",
      noAgeProducts: "لسه مفيش منتجات مربوطة بالعمر ده.",
      ageCta: "شوف كل منتجات العمر",
      viewAll: "عرض الكل",
    };
  }

  if (locale === "de") {
    return {
      categoriesEyebrow: "Hier starten",
      categoriesTitle: "Wähle die Welt deines Kindes",
      categoriesSubtitle: "Klare Kategorien bringen dich mit einem Tippen zum richtigen Produkt.",
      productsEyebrow: "Kidorly Auswahl",
      productsSubtitle: "Besondere Produkte, die deine Entscheidung leichter machen.",
      agesEyebrow: "Für jede Entwicklungsphase",
      agesTitle: "Nach Alter wählen",
      agesSubtitle: "Wähle eine Phase und entdecke passend zugeordnete Produkte.",
      explore: "Jetzt entdecken",
      partners: "Unsere Partner",
      partnersSubtitle: "Vertrauenswürdige Marken für ein rundes Kidorly Erlebnis.",
      products: "Produkte",
      noAgeProducts: "Für diese Altersgruppe sind noch keine Produkte zugeordnet.",
      ageCta: "Alle Produkte für dieses Alter",
      viewAll: "Alle ansehen",
    };
  }

  return {
    categoriesEyebrow: "Start here",
    categoriesTitle: "Choose their little world",
    categoriesSubtitle: "Clear categories take you to the right product in one tap.",
    productsEyebrow: "Kidorly picks",
    productsSubtitle: "Standout products selected to make your choice easier.",
    agesEyebrow: "Made for every stage",
    agesTitle: "Choose by age",
    agesSubtitle: "Pick a stage and see products assigned to that age group.",
    explore: "Explore now",
    partners: "Our partners",
    partnersSubtitle: "Trusted brands that complete the Kidorly experience.",
    products: "products",
    noAgeProducts: "No products have been assigned to this age group yet.",
    ageCta: "See all products for this age",
    viewAll: "View all",
  };
}

function validImage(value?: string | null) {
  const image = value?.trim();
  return image && (image.startsWith("/") || /^https?:\/\//i.test(image))
    ? image
    : null;
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-11 md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center md:flex-col md:items-center",
      )}
    >
      <div className="max-w-2xl">
        <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand-coral sm:text-xs">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-.045em] text-slate-950 sm:text-4xl lg:text-[3rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500 sm:text-base">
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
    </motion.div>
  );
}

function TrustRibbon() {
  const t = useTranslations("hero");
  const items = [
    { icon: Truck, label: t("trustDelivery"), tone: "text-brand-coral bg-brand-coral/10" },
    { icon: ShieldCheck, label: t("trustQuality"), tone: "text-brand-ocean bg-brand-sky/12" },
    { icon: Headphones, label: t("trustSupport"), tone: "text-violet-600 bg-violet-100" },
  ];

  return (
    <section className="relative z-20 border-y border-slate-100 bg-white">
      <div className="container grid grid-cols-3 gap-1 py-3 sm:gap-4 sm:py-5">
        {items.map(({ icon: Icon, label, tone }) => (
          <div key={label} className="flex min-w-0 items-center justify-center gap-2 text-center">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl", tone)}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="hidden truncate text-xs font-black text-slate-700 min-[390px]:block sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: HomeCategory[] }) {
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);
  const reduceMotion = useReducedMotion();

  if (!categories.length) return null;

  return (
    <section id="discover" className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      <div className="home-blob home-blob-coral -start-24 top-10" />
      <div className="home-blob home-blob-sky -end-28 bottom-0" />
      <div className="container relative">
        <SectionHeading
          eyebrow={copy.categoriesEyebrow}
          title={copy.categoriesTitle}
          subtitle={copy.categoriesSubtitle}
          href={`/${locale}/shop`}
          action={copy.viewAll}
        />

        <div className="category-orbit scrollbar-hide -mx-4 grid snap-x snap-mandatory auto-cols-[96px] grid-flow-col gap-3 overflow-x-auto px-4 pb-4 pt-2 sm:-mx-6 sm:auto-cols-[118px] sm:gap-5 sm:px-6 lg:mx-0 lg:grid-flow-row lg:grid-cols-7 lg:overflow-visible lg:px-0 xl:grid-cols-8">
          {categories.slice(0, 12).map((category, index) => {
            const name = getTranslated(category, "name", locale);
            const image = validImage(category.image) || validImage(category.icon) || validImage(category.banner);
            const childrenCount = category.children?.reduce(
              (total, child) => total + (child._count?.products || 0),
              0,
            ) || 0;
            const count = (category._count?.products || 0) + childrenCount;

            return (
              <motion.div
                key={category.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -7, rotate: index % 2 ? 1.5 : -1.5 }}
                whileTap={{ scale: 0.94 }}
                className="snap-start"
              >
                <Link href={`/${locale}/category/${category.slug}`} className="group flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br p-2 ring-2 ring-offset-4 ring-offset-white transition-shadow group-hover:shadow-[0_18px_38px_rgba(15,23,42,.15)] sm:h-[108px] sm:w-[108px]",
                      CATEGORY_TONES[index % CATEGORY_TONES.length],
                    )}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.08]"
                        sizes="108px"
                      />
                    ) : (
                      <Layers3 className="h-9 w-9 text-brand-coral" />
                    )}
                    {category.featured && (
                      <span className="absolute -end-1 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-coral text-white shadow-md">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="absolute -bottom-2 rounded-full border border-white bg-slate-950 px-2 py-1 text-[8px] font-black text-white shadow-md sm:text-[9px]">
                      {count} {copy.products}
                    </span>
                  </span>
                  <h3 className="mt-5 line-clamp-2 min-h-9 text-xs font-black leading-4 text-slate-800 transition-colors group-hover:text-brand-coral sm:text-sm sm:leading-5">
                    {name}
                  </h3>
                </Link>
              </motion.div>
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
  const reduceMotion = useReducedMotion();

  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-14 sm:py-20 lg:py-24">
      <div className="container relative">
        <SectionHeading
          eyebrow={copy.productsEyebrow}
          title={t("sections.featuredProducts")}
          subtitle={copy.productsSubtitle}
          href={`/${locale}/shop`}
          action={copy.viewAll}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <motion.div
              key={product.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatAgeRange(group: AgeGroupBasic, locale: Locale) {
  const { minAgeMonths, maxAgeMonths } = group;
  if (minAgeMonths == null && maxAgeMonths == null) return "";
  const unit = locale === "ar" ? "شهر" : locale === "de" ? "Monate" : "months";
  if (minAgeMonths == null) return `${locale === "ar" ? "حتى" : "Up to"} ${maxAgeMonths} ${unit}`;
  if (maxAgeMonths == null) return `${minAgeMonths}+ ${unit}`;
  return `${minAgeMonths}–${maxAgeMonths} ${unit}`;
}

function AgeExplorer({ ageGroups }: { ageGroups: HomeAgeGroup[] }) {
  const locale = useLocale() as Locale;
  const copy = homeCopy(locale);
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(ageGroups[0]?.id || "");
  const active = ageGroups.find((group) => group.id === activeId) || ageGroups[0];

  if (!active) return null;

  const products = active.products?.map((entry) => entry.product).slice(0, 4) || [];
  const name = getTranslated(active, "name", locale);
  const image =
    validImage(active.banner) ||
    validImage(active.image) ||
    validImage(products[0]?.images?.[0]) ||
    "/images/hero2.webp";

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      <div className="home-blob home-blob-sun start-1/3 top-0" />
      <div className="container relative">
        <SectionHeading
          eyebrow={copy.agesEyebrow}
          title={copy.agesTitle}
          subtitle={copy.agesSubtitle}
        />

        <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2 sm:mb-8 sm:flex-wrap">
          {ageGroups.map((group) => {
            const groupName = getTranslated(group, "name", locale);
            const selected = group.id === active.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveId(group.id)}
                aria-pressed={selected}
                className={cn(
                  "relative min-h-12 shrink-0 overflow-hidden rounded-full border px-5 text-sm font-black transition active:scale-95",
                  selected
                    ? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,.2)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-coral/40 hover:text-brand-coral",
                )}
              >
                {groupName}
                {selected && (
                  <motion.span
                    layoutId="age-active-dot"
                    className="absolute inset-x-5 bottom-1 h-0.5 rounded-full bg-brand-sun"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:gap-7"
          >
            <div className="group relative min-h-[300px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-[0_22px_60px_rgba(15,23,42,.15)] sm:min-h-[380px]">
              <Image src={image} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 38vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-black backdrop-blur-xl">
                  <Baby className="h-3.5 w-3.5 text-brand-sun" />
                  {formatAgeRange(active, locale)}
                </span>
                <h3 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">{name}</h3>
                <Link href={`/${locale}/shop?ageGroup=${active.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-sun">
                  {copy.ageCta}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>

            {products.length ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <BadgeCheck className="h-10 w-10 text-brand-ocean" />
                <p className="mt-4 text-sm font-bold text-slate-500">{copy.noAgeProducts}</p>
                <Button asChild className="mt-5 rounded-full">
                  <Link href={`/${locale}/shop?ageGroup=${active.slug}`}>{copy.ageCta}</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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
    <section className="overflow-hidden border-y border-slate-100 bg-[#fbfcfe] py-14 sm:py-20">
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
                const brandName = getTranslated(brand, "name", locale);
                const brandImage = validImage(brand.logo);
                return (
                  <Link
                    key={`${groupIndex}-${brand.id}-${index}`}
                    href={`/${locale}/brand/${brand.slug}`}
                    aria-label={brandName}
                    className="group flex h-24 w-32 shrink-0 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:border-brand-sky/50 sm:h-28 sm:w-40"
                  >
                    {brandImage ? (
                      <Image src={brandImage} alt={brandName} width={150} height={80} className="max-h-14 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16" />
                    ) : (
                      <span className="text-center text-xs font-black text-brand-ocean sm:text-sm">{brandName}</span>
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
  sectionConfig = DEFAULT_SECTION_CONFIG,
}: HomeClientProps) {
  const locale = useLocale() as Locale;

  const orderedSections = useMemo(() => {
    const stored = new Map(sectionConfig.map((item) => [item.sectionKey, item]));
    return DEFAULT_SECTION_CONFIG.map((fallback) => stored.get(fallback.sectionKey) || fallback)
      .filter((item) => item.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sectionConfig]);

  const sections: Record<HomeSectionKey, ReactNode> = {
    categories: <CategoriesSection categories={categories} />,
    featured_products: <FeaturedProductsSection products={featuredProducts} />,
    collections: <CollectionStory collections={collections} locale={locale} />,
    age_groups: <AgeExplorer ageGroups={ageGroups} />,
    partners: <PartnersSection brands={brands} />,
    experience: <ExperienceSection />,
  };

  return (
    <>
      <HeroSection content={heroContent} />
      <TrustRibbon />
      {orderedSections.map((item) => (
        <div key={item.sectionKey}>{sections[item.sectionKey]}</div>
      ))}
    </>
  );
}
