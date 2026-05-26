"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { PackageOpen, Search, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTranslated } from "@/lib/utils";

import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory, CategoryFull } from "@/types";

interface ShopClientProps {
  products: ProductWithCategory[];
  categories: CategoryFull[];
  activeCategory?: string;
  activeSort?: string;
  searchQuery?: string;
}

export function ShopClient({
  products,
  categories,
  activeCategory,
  activeSort,
  searchQuery,
}: ShopClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchQuery || "");

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);

    if (value && value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", search.trim() || null);
  }

  function clearSearch() {
    setSearch("");
    updateParams("q", null);
  }

  const hasActiveFilters = Boolean(activeCategory || searchQuery);

  return (
    <main className="page-safe-top relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-80 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative py-8 sm:py-10 md:py-12">
        {/* Header */}
        <section className="mb-6 rounded-3xl border border-gray-100 bg-white/80 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:mb-8 sm:p-7 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
                {t("shop.title")}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("shop.showing", { count: products.length })}
              </p>
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  router.push(pathname);
                }}
                className="w-fit rounded-xl border-gray-200 bg-white font-semibold"
              >
                {t("common.clearFilters")}
              </Button>
            )}
          </div>
        </section>

        {/* Search + Sort */}
        <section className="mb-5 rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.07)] sm:mb-6 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px] md:items-center">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`${t("common.search")}...`}
                  className="h-11 rounded-2xl border-gray-200 bg-gray-50/80 pl-10 pr-20 text-sm shadow-none focus-visible:ring-brand-coral/30"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground transition-colors hover:text-brand-coral"
                  >
                    {t("common.close")}
                  </button>
                )}
              </div>
            </form>

            <Select
              value={activeSort || "newest"}
              onValueChange={(v) =>
                updateParams("sort", v === "newest" ? null : v)
              }
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-gray-200 bg-gray-50/80 shadow-none focus:ring-brand-coral/30">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("common.sortBy")} />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">{t("shop.sortNewest")}</SelectItem>
                <SelectItem value="price_asc">
                  {t("shop.sortPriceLow")}
                </SelectItem>
                <SelectItem value="price_desc">
                  {t("shop.sortPriceHigh")}
                </SelectItem>
                <SelectItem value="name">{t("shop.sortName")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-7 sm:mb-8">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0">
            <div className="flex min-w-max items-center gap-2 sm:flex-wrap">
              <Button
                variant={!activeCategory ? "default" : "outline"}
                size="sm"
                onClick={() => updateParams("category", null)}
                className="shrink-0 rounded-full px-4 font-bold"
              >
                {t("common.all")}
              </Button>

              {categories.map((cat) => {
                const active = activeCategory === cat.slug;

                return (
                  <Button
                    key={cat.id}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateParams("category", cat.slug)}
                    className="shrink-0 rounded-full px-4 font-bold"
                  >
                    {getTranslated(cat, "name", locale)}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        {products.length > 0 ? (
          <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 text-muted-foreground">
              <PackageOpen className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-lg font-extrabold text-gray-950">
              {t("shop.noProducts")}
            </h3>

            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("shop.noProductsSubtitle")}
            </p>

            <Button
              type="button"
              className="mt-6 rounded-xl font-bold"
              onClick={() => {
                setSearch("");
                router.push(pathname);
              }}
            >
              {t("common.clearFilters")}
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}
