"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { HeroSection } from "@/components/public/hero-section";
import { WhyChooseUs, CityHighlight, PaymentMethodsSection } from "@/components/public/home-sections";
import { Reveal } from "@/components/shared/reveal";
import { getTranslated, cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory, CategoryFull } from "@/types";

interface HomeClientProps {
  categories: CategoryFull[];
  featuredProducts: ProductWithCategory[];
}

export function HomeClient({ categories, featuredProducts }: HomeClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <>
      <HeroSection />

      {/* ══════════════════════════════════════════════
          FEATURED CATEGORIES
          ══════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <Reveal>
              <div className="flex items-center justify-between mb-10 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {t("sections.featuredCategories")}
                </h2>
                <Button variant="ghost" className="press-effect hidden sm:inline-flex" asChild>
                  <Link href={`/${locale}/shop`}>
                    {t("common.viewAll")} <ArrowRight className="ms-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            {/* Category Grid — NO Reveal wrapper on individual items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden card-hover"
                >
                  {/* Category Image */}
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={getTranslated(cat, "name", locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    />
                  ) : (
                    /* Fallback when no image is set */
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-coral/30 to-brand-sky/30" />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category name */}
                  <div className="absolute bottom-3 start-3 end-3">
                    <span className="text-white font-semibold text-xs md:text-sm drop-shadow-md line-clamp-2">
                      {getTranslated(cat, "name", locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" size="sm" className="press-effect" asChild>
                <Link href={`/${locale}/shop`}>
                  {t("common.viewAll")} <ArrowRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
          ══════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="container">
            <Reveal>
              <div className="flex items-center justify-between mb-10 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {t("sections.featuredProducts")}
                </h2>
                <Button variant="ghost" className="press-effect hidden sm:inline-flex" asChild>
                  <Link href={`/${locale}/shop`}>
                    {t("common.viewAll")} <ArrowRight className="ms-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" size="sm" className="press-effect" asChild>
                <Link href={`/${locale}/shop`}>
                  {t("common.viewAll")} <ArrowRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <WhyChooseUs />
      <CityHighlight />
      <PaymentMethodsSection />
    </>
  );
}