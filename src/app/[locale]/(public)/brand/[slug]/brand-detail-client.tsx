"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Package, Star } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/public/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getTranslated } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { BrandFull, ProductWithCategory } from "@/types";

interface Props {
  brand: BrandFull & { products: ProductWithCategory[] };
}

export function BrandDetailClient({ brand }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const description = getTranslated(brand, "description", locale);
  const name = getTranslated(brand, "name", locale);

  return (
    <div>
      {/* ── Brand Hero ── */}
      <section className="relative bg-gradient-to-br from-brand-coral/5 via-brand-sky/5 to-brand-sun/5 border-b">
        {brand.banner && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={brand.banner}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="container relative py-12 md:py-16">
          <Link
            href={`/${locale}/brands`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("brands.allBrands")}
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            {/* Logo */}
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-white shadow-lg p-4 flex items-center justify-center shrink-0">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={name}
                  fill
                  className="object-contain p-4"
                  sizes="160px"
                />
              ) : (
                <div className="text-4xl font-bold text-muted-foreground/30">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-start">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                {brand.featured && (
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <Package className="h-4 w-4" />
                <span>
                  {brand.products.length} {t("brands.productsCount")}
                </span>
              </div>

              {description && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="container py-10 md:py-16">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {t("brands.allProductsFrom", { brand: name })}
          </h2>
        </Reveal>

        {brand.products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/60 rounded-3xl">
            <Package className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-muted-foreground">{t("brands.noProductsYet")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {brand.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
