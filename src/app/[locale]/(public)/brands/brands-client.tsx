"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Award,
  Star,
  Package,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { getTranslated, cn } from "@/lib/utils";

import type { Locale } from "@/lib/i18n";

interface BrandItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  logo: string | null;
  banner: string | null;
  featured: boolean;
  _count?: { products: number };
}

interface Props {
  brands: BrandItem[];
}

export function BrandsClient({ brands }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const featured = brands.filter((brand) => brand.featured);
  const regular = brands.filter((brand) => !brand.featured);

  const totalProducts = brands.reduce(
    (sum, brand) => sum + (brand._count?.products || 0),
    0,
  );

  function getBrandName(brand: BrandItem) {
    return getTranslated(brand, "name", locale);
  }

  function getBrandInitials(brand: BrandItem) {
    return getBrandName(brand).slice(0, 2).toUpperCase();
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[520px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14 sm:pb-16">
        {/* Header */}
        <section className="mb-7 overflow-hidden rounded-[2rem] border border-gray-100 bg-white/85 p-5 text-center shadow-[0_14px_44px_rgba(15,23,42,0.09)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:mb-10 sm:p-8">
          <Reveal direction="up" duration={650}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-coral/10 text-brand-coral sm:h-16 sm:w-16">
              <Award className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
          </Reveal>

          <Reveal direction="up" delay={80} duration={650}>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl">
              {t("brands.title")}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={150} duration={650}>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {t("brands.description")}
            </p>
          </Reveal>

          {brands.length > 0 && (
            <Reveal direction="up" delay={220} duration={650}>
              <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-3xl border border-gray-100 bg-gray-50/80 px-3 py-4">
                  <p className="text-xl font-extrabold text-brand-coral sm:text-2xl">
                    {brands.length}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground sm:text-xs">
                    {t("brands.brandsCount")}
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50/80 px-3 py-4">
                  <p className="text-xl font-extrabold text-brand-sky sm:text-2xl">
                    {totalProducts}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground sm:text-xs">
                    {t("brands.totalProducts")}
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50/80 px-3 py-4">
                  <p className="text-xl font-extrabold text-amber-500 sm:text-2xl">
                    {featured.length}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground sm:text-xs">
                    {t("brands.featuredCount")}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </section>

        {brands.length === 0 ? (
          <section className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-gray-100 bg-white px-6 py-14 text-center shadow-[0_14px_44px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:px-8 sm:py-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
              <Package className="h-12 w-12" />
            </div>

            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              {t("brands.noBrands")}
            </h2>

            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("brands.description")}
            </p>

            <Button
              size="lg"
              asChild
              className="h-12 rounded-2xl px-6 font-extrabold shadow-lg shadow-brand-coral/25"
            >
              <Link href={`/${locale}/shop`}>
                <ShoppingBag className="me-2 h-5 w-5" />
                {t("common.shop")}
              </Link>
            </Button>
          </section>
        ) : (
          <div className="space-y-12 sm:space-y-14">
            {/* Featured Brands */}
            {featured.length > 0 && (
              <section>
                <Reveal>
                  <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {t("brands.featured")}
                      </div>

                      <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                        {t("brands.featured")}
                      </h2>
                    </div>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
                  {featured.map((brand, index) => {
                    const name = getBrandName(brand);

                    return (
                      <Reveal key={brand.id} delay={index * 70}>
                        <Link
                          href={`/${locale}/brand/${brand.slug}`}
                          className={cn(
                            "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white",
                            "shadow-[0_14px_40px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03]",
                            "transition-all duration-300 ease-out",
                            "md:shadow-[0_8px_26px_rgba(15,23,42,0.07)] md:hover:-translate-y-1 md:hover:shadow-[0_18px_48px_rgba(15,23,42,0.13)]",
                          )}
                        >
                          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-coral/10 via-brand-sky/5 to-brand-sun/10 sm:h-40">
                            {brand.banner ? (
                              <Image
                                src={brand.banner}
                                alt={name}
                                fill
                                className="object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 420px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-7xl font-black text-brand-coral/10">
                                  {getBrandInitials(brand)}
                                </span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                            <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg">
                              <Star className="h-4 w-4 fill-white" />
                            </div>
                          </div>

                          <div className="relative px-5">
                            <div className="-mt-9 flex h-18 w-18 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg sm:h-20 sm:w-20">
                              {brand.logo ? (
                                <Image
                                  src={brand.logo}
                                  alt={name}
                                  fill
                                  className="object-contain p-2.5"
                                  sizes="80px"
                                />
                              ) : (
                                <span className="text-xl font-black text-brand-coral">
                                  {getBrandInitials(brand)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                            <h3 className="text-lg font-extrabold text-gray-950 transition-colors group-hover:text-brand-coral">
                              {name}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-muted-foreground">
                              {brand._count?.products || 0}{" "}
                              {t("brands.productsCount")}
                            </p>

                            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-coral">
                              {t("brands.viewProducts")}
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Brands */}
            {regular.length > 0 && (
              <section>
                <Reveal>
                  <div className="mb-5 sm:mb-7">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-coral/15 bg-brand-coral/8 px-3 py-1 text-xs font-extrabold text-brand-coral">
                      <Sparkles className="h-3.5 w-3.5" />
                      {regular.length}
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                      {featured.length > 0
                        ? t("brands.allBrandsTitle")
                        : t("brands.title")}
                    </h2>
                  </div>
                </Reveal>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
                  {regular.map((brand, index) => {
                    const name = getBrandName(brand);

                    return (
                      <Reveal key={brand.id} delay={index * 35}>
                        <Link
                          href={`/${locale}/brand/${brand.slug}`}
                          className={cn(
                            "group flex h-full flex-col items-center rounded-3xl border border-gray-100 bg-white p-4 text-center",
                            "shadow-[0_12px_34px_rgba(15,23,42,0.09)] ring-1 ring-black/[0.03]",
                            "transition-all duration-300 ease-out",
                            "md:shadow-[0_8px_24px_rgba(15,23,42,0.06)] md:hover:-translate-y-1 md:hover:border-brand-coral/30 md:hover:shadow-[0_16px_38px_rgba(15,23,42,0.12)]",
                          )}
                        >
                          <div className="relative mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 shadow-sm transition-transform duration-300 md:group-hover:scale-105 sm:h-18 sm:w-18">
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={name}
                                fill
                                className="object-contain p-2.5"
                                sizes="72px"
                              />
                            ) : (
                              <span className="text-lg font-black text-brand-coral">
                                {getBrandInitials(brand)}
                              </span>
                            )}
                          </div>

                          <h3 className="line-clamp-1 text-sm font-extrabold text-gray-950 transition-colors group-hover:text-brand-coral">
                            {name}
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {brand._count?.products || 0}{" "}
                            {t("brands.productsCount")}
                          </p>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}