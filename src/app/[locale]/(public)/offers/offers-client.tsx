"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Percent } from "lucide-react";

import type { ProductWithCategory } from "@/types";

export function OffersClient({ products }: { products: ProductWithCategory[] }) {
  const t = useTranslations("offers");
  const locale = useLocale();

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14 sm:pb-16">
        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white/85 p-5 text-center shadow-[0_14px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:mb-8 sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-coral/10 text-brand-coral sm:h-16 sm:w-16">
            <Percent className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
            {t("title")}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>

          {products.length > 0 && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-brand-coral/15 bg-brand-coral/8 px-4 py-2 text-xs font-extrabold text-brand-coral">
              <Sparkles className="h-4 w-4" />
              <span>{products.length}</span>
            </div>
          )}
        </section>

        {/* Content */}
        {products.length > 0 ? (
          <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-gray-100 bg-white px-6 py-14 text-center shadow-[0_14px_44px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:px-8 sm:py-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
              <Sparkles className="h-12 w-12" />
            </div>

            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              {t("noOffers")}
            </h2>

            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("noOffersSubtitle")}
            </p>

            <Button
              size="lg"
              asChild
              className="h-12 rounded-2xl px-6 font-extrabold shadow-lg shadow-brand-coral/25"
            >
              <Link href={`/${locale}/shop`}>
                <ShoppingBag className="me-2 h-5 w-5" />
                {t("shopNow")}
              </Link>
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}