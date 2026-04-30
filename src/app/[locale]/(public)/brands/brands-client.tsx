"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Award, Star, Package } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { getTranslated } from "@/lib/utils";
import type { BrandFull } from "@/types";
import type { Locale } from "@/lib/i18n";

interface Props {
  brands: BrandFull[];
}

export function BrandsClient({ brands }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <div className="container py-10 md:py-16">
      {/* Hero */}
      <Reveal>
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-coral/10 text-brand-coral text-sm font-semibold mb-4">
            <Award className="h-4 w-4" />
            {t("brands.subtitle")}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("brands.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("brands.description")}
          </p>
        </div>
      </Reveal>

      {brands.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/60 rounded-3xl">
          <Package className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
          <p className="text-muted-foreground">{t("brands.noBrands")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand, i) => (
            <Reveal key={brand.id} delay={i * 60}>
              <Link
                href={`/${locale}/brand/${brand.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border card-hover transition-all duration-300"
              >
                {/* Logo Area */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 flex items-center justify-center">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={getTranslated(brand, "name", locale)}
                      fill
                      className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-muted-foreground/30">
                      {getTranslated(brand, "name", locale)
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  {brand.featured && (
                    <div className="absolute top-3 end-3 h-7 w-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                      <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 text-center border-t">
                  <h3 className="font-bold text-sm md:text-base group-hover:text-primary transition-colors mb-0.5">
                    {getTranslated(brand, "name", locale)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {brand._count?.products || 0} {t("brands.productsCount")}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
