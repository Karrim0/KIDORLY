"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTranslated, cn } from "@/lib/utils";
import { PackageOpen, Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory, CategoryFull } from "@/types";

interface ShopClientProps {
  products: ProductWithCategory[];
  categories: CategoryFull[];
  activeCategory?: string;
  activeSort?: string;
  searchQuery?: string;
}

export function ShopClient({ products, categories, activeCategory, activeSort, searchQuery }: ShopClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchQuery || "");

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", search || null);
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("shop.title")}</h1>
        <p className="text-muted-foreground">{t("shop.showing", { count: products.length })}</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common.search") + "..."}
            className="ps-10"
          />
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams("category", null)}
        >
          {t("common.all")}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.slug ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams("category", cat.slug)}
          >
            {getTranslated(cat, "name", locale)}
          </Button>
        ))}

        <div className="ms-auto">
          <Select value={activeSort || "newest"} onValueChange={(v) => updateParams("sort", v === "newest" ? null : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("common.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("shop.sortNewest")}</SelectItem>
              <SelectItem value="price_asc">{t("shop.sortPriceLow")}</SelectItem>
              <SelectItem value="price_desc">{t("shop.sortPriceHigh")}</SelectItem>
              <SelectItem value="name">{t("shop.sortName")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <PackageOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">{t("shop.noProducts")}</h3>
          <p className="text-muted-foreground">{t("shop.noProductsSubtitle")}</p>
        </div>
      )}
    </div>
  );
}
