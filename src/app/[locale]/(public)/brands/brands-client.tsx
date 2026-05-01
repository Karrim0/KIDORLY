"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Award, Star, Package, ArrowRight } from "lucide-react";
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

  const featured = brands.filter((b) => b.featured);
  const regular  = brands.filter((b) => !b.featured);

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════
          PAGE HERO
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-coral/8 via-white to-brand-sky/8 border-b">
        {/* Decorative blurs */}
        <div className="absolute top-0 start-[20%] w-64 h-64 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 end-[10%] w-48 h-48 bg-brand-sky/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative py-16 md:py-20 text-center">
          <Reveal direction="up" duration={700}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-coral/10 text-brand-coral text-sm font-bold mb-5 border border-brand-coral/20">
              <Award className="h-4 w-4" />
              {t("brands.subtitle")}
            </div>
          </Reveal>

          <Reveal direction="up" delay={100} duration={700}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {t("brands.title")}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={200} duration={700}>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {t("brands.description")}
            </p>
          </Reveal>

          {/* Stats Row */}
          <Reveal direction="up" delay={300} duration={700}>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-coral">{brands.length}+</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("brands.brandsCount")}</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-sky">
                  {brands.reduce((sum, b) => sum + (b._count?.products || 0), 0)}+
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("brands.totalProducts")}</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-500">{featured.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("brands.featuredCount")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container py-12 md:py-16 space-y-16">

        {brands.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/60 rounded-3xl">
            <Package className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-lg font-semibold text-muted-foreground">{t("brands.noBrands")}</p>
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════════
                FEATURED BRANDS — big cards
                ══════════════════════════════════════════ */}
            {featured.length > 0 && (
              <section>
                <Reveal>
                  <div className="flex items-center gap-3 mb-8">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <h2 className="text-2xl md:text-3xl font-bold">{t("brands.featured")}</h2>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featured.map((brand, i) => (
                    <Reveal key={brand.id} delay={i * 80}>
                      <Link
                        href={`/${locale}/brand/${brand.slug}`}
                        className="group relative bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
                      >
                        {/* Banner / Logo area */}
                        <div className="relative h-40 bg-gradient-to-br from-brand-coral/10 via-brand-sky/5 to-brand-sun/10 overflow-hidden">
                          {brand.banner ? (
                            <Image
                              src={brand.banner}
                              alt={getTranslated(brand, "name", locale)}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                              <span className="text-7xl font-black text-brand-coral">
                                {getTranslated(brand, "name", locale).slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {/* Featured star badge */}
                          <div className="absolute top-3 end-3 h-8 w-8 rounded-full bg-amber-400 shadow-lg flex items-center justify-center">
                            <Star className="h-4 w-4 fill-white text-white" />
                          </div>
                        </div>

                        {/* Logo float */}
                        <div className="relative px-5 -mt-8">
                          <div className="relative h-16 w-16 rounded-2xl bg-white shadow-lg border flex items-center justify-center overflow-hidden">
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={getTranslated(brand, "name", locale)}
                                fill
                                className="object-contain p-2"
                                sizes="64px"
                              />
                            ) : (
                              <span className="text-xl font-black text-brand-coral">
                                {getTranslated(brand, "name", locale).slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="px-5 pt-3 pb-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold mb-1 group-hover:text-brand-coral transition-colors duration-200">
                            {getTranslated(brand, "name", locale)}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {brand._count?.products || 0} {t("brands.productsCount")}
                          </p>
                          <div className="mt-auto flex items-center gap-1.5 text-brand-coral text-sm font-semibold">
                            {t("brands.viewProducts")}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════
                ALL BRANDS — compact grid
                ══════════════════════════════════════════ */}
            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <Reveal>
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("brands.allBrandsTitle")}</h2>
                  </Reveal>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {regular.map((brand, i) => (
                    <Reveal key={brand.id} delay={i * 50}>
                      <Link
                        href={`/${locale}/brand/${brand.slug}`}
                        className={cn(
                          "group flex flex-col items-center bg-white rounded-2xl border p-5",
                          "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                          "hover:border-brand-coral/30"
                        )}
                      >
                        {/* Logo */}
                        <div className="relative h-16 w-16 rounded-xl bg-gray-50 overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                          {brand.logo ? (
                            <Image
                              src={brand.logo}
                              alt={getTranslated(brand, "name", locale)}
                              fill
                              className="object-contain p-2 transition-transform duration-400 group-hover:scale-110"
                              sizes="64px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-coral/10 to-brand-sky/10">
                              <span className="text-lg font-black text-brand-coral/60">
                                {getTranslated(brand, "name", locale).slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-center line-clamp-1 group-hover:text-brand-coral transition-colors">
                          {getTranslated(brand, "name", locale)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {brand._count?.products || 0} {t("brands.productsCount")}
                        </p>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}