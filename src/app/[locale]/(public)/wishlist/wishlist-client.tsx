"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingBag, Trash2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { useWishlist } from "@/hooks/use-wishlist";

import type { ProductWithCategory } from "@/types";

interface WishlistClientProps {
  allProducts: ProductWithCategory[];
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { items, isHydrated, clear, count } = useWishlist();

  const wishlistProducts = allProducts.filter((product) =>
    items.includes(product.id),
  );

  if (!isHydrated) {
    return (
      <main className="page-safe-top bg-gradient-to-b from-white via-gray-50/60 to-white">
        <div className="container flex min-h-[45vh] items-center justify-center pb-14">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white px-8 py-10 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <Loader2 className="h-8 w-8 animate-spin text-brand-coral" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading wishlist...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14 sm:pb-16">
        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:mb-8 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-coral/15 bg-brand-coral/8 px-3 py-1 text-xs font-extrabold text-brand-coral">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{count > 0 ? `${count}` : "0"}</span>
              </div>

              <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral sm:h-12 sm:w-12">
                  <Heart className="h-6 w-6 fill-brand-coral sm:h-7 sm:w-7" />
                </span>

                <span>{t("wishlist.title")}</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {count > 0
                  ? t("wishlist.itemCount", { count })
                  : t("wishlist.empty")}
              </p>
            </div>

            {count > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm(t("wishlist.confirmClear"))) clear();
                }}
                className="h-10 w-fit rounded-2xl border-destructive/20 bg-white px-4 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="me-2 h-4 w-4" />
                {t("wishlist.clearAll")}
              </Button>
            )}
          </div>
        </section>

        {/* Content */}
        {wishlistProducts.length === 0 ? (
          <section className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-gray-100 bg-white px-6 py-14 text-center shadow-[0_14px_44px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:px-8 sm:py-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
              <Heart className="h-12 w-12" />
            </div>

            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              {t("wishlist.emptyTitle")}
            </h2>

            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("wishlist.emptyDesc")}
            </p>

            <Button
              size="lg"
              asChild
              className="h-12 rounded-2xl px-6 font-extrabold shadow-lg shadow-brand-coral/25"
            >
              <Link href={`/${locale}/shop`}>
                <ShoppingBag className="me-2 h-5 w-5" />
                {t("wishlist.startShopping")}
              </Link>
            </Button>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}