"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Filter,
  PackageOpen,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ProductCard } from "@/components/public/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTranslated } from "@/lib/utils";

import type { Locale } from "@/lib/i18n";
import type {
  AgeGroupBasic,
  BrandFull,
  CategoryFull,
  CollectionBasic,
  ProductWithCategory,
  TagBasic,
} from "@/types";

type FilterKey =
  | "category"
  | "brand"
  | "collection"
  | "tag"
  | "ageGroup"
  | "sort"
  | "q"
  | "minPrice"
  | "maxPrice";

interface ShopClientProps {
  products: ProductWithCategory[];
  categories: CategoryFull[];
  brands: BrandFull[];
  collections: CollectionBasic[];
  tags: TagBasic[];
  ageGroups: AgeGroupBasic[];

  activeCategory?: string;
  activeBrand?: string;
  activeCollection?: string;
  activeTag?: string;
  activeAgeGroup?: string;
  activeSort?: string;
  searchQuery?: string;
  minPrice?: string;
  maxPrice?: string;

  categoryPageMode?: boolean;
}

export function ShopClient({
  products,
  categories,
  brands,
  collections,
  tags,
  ageGroups,
  activeCategory,
  activeBrand,
  activeCollection,
  activeTag,
  activeAgeGroup,
  activeSort,
  searchQuery,
  minPrice,
  maxPrice,
  categoryPageMode = false,
}: ShopClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchQuery || "");
  const [priceMin, setPriceMin] = useState(minPrice || "");
  const [priceMax, setPriceMax] = useState(maxPrice || "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategoryData = useMemo(() => {
    return categories.find((item) => item.slug === activeCategory) || null;
  }, [categories, activeCategory]);

  const hasActiveFilters = Boolean(
    activeCategory ||
      activeBrand ||
      activeCollection ||
      activeTag ||
      activeAgeGroup ||
      searchQuery ||
      minPrice ||
      maxPrice
  );

  function updateParams(key: FilterKey, value: string | null) {
    const params = new URLSearchParams(window.location.search);

    if (value && value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function updateManyParams(values: Partial<Record<FilterKey, string | null>>) {
    const params = new URLSearchParams(window.location.search);

    Object.entries(values).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function selectCategory(slug: string | null) {
    if (!categoryPageMode) {
      updateParams("category", slug);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.delete("category");

    const queryString = params.toString();

    if (!slug) {
      router.push(queryString ? `/${locale}/shop?${queryString}` : `/${locale}/shop`);
      return;
    }

    router.push(
      queryString
        ? `/${locale}/category/${slug}?${queryString}`
        : `/${locale}/category/${slug}`
    );
  }

  function clearAllFilters() {
    setSearch("");
    setPriceMin("");
    setPriceMax("");
    router.push(`/${locale}/shop`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", search.trim() || null);
  }

  function applyPriceFilters() {
    updateManyParams({
      minPrice: priceMin.trim() || null,
      maxPrice: priceMax.trim() || null,
    });
  }

  const filterPanel = (
    <FilterPanel
      locale={locale}
      categories={categories}
      brands={brands}
      collections={collections}
      tags={tags}
      ageGroups={ageGroups}
      activeCategory={activeCategory}
      activeBrand={activeBrand}
      activeCollection={activeCollection}
      activeTag={activeTag}
      activeAgeGroup={activeAgeGroup}
      priceMin={priceMin}
      priceMax={priceMax}
      setPriceMin={setPriceMin}
      setPriceMax={setPriceMax}
      onApplyPrice={applyPriceFilters}
      onSelectCategory={(slug) => {
        selectCategory(slug);
        setMobileFiltersOpen(false);
      }}
      onChangeFilter={(key, value) => {
        updateParams(key, value);
        setMobileFiltersOpen(false);
      }}
    />
  );

  return (
    <main className="page-safe-top relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-80 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative py-6 sm:py-10 md:py-12">
        <section className="mb-5 overflow-hidden rounded-3xl border border-gray-100 bg-white/85 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:mb-8">
          {activeCategoryData?.banner && (
            <div
              className="h-32 bg-cover bg-center sm:h-44 md:h-56"
              style={{ backgroundImage: `url(${activeCategoryData.banner})` }}
            />
          )}

          <div className="p-5 sm:p-7 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
                  {activeCategoryData
                    ? getTranslated(activeCategoryData, "name", locale)
                    : t("shop.title")}
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t("shop.showing", { count: products.length })}
                </p>

                {activeCategoryData && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {getTranslated(activeCategoryData, "description", locale)}
                  </p>
                )}
              </div>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-fit rounded-xl border-gray-200 bg-white font-semibold"
                >
                  {t("common.clearFilters")}
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.07)] sm:mb-6 sm:p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-center">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`${t("common.search")}...`}
                  className="h-11 rounded-2xl border-gray-200 bg-gray-50/80 ps-10 pe-20 text-sm shadow-none focus-visible:ring-brand-coral/30"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      updateParams("q", null);
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground transition-colors hover:text-brand-coral"
                  >
                    {t("common.close")}
                  </button>
                )}
              </div>
            </form>

            <Select
              value={activeSort || "newest"}
              onValueChange={(value) =>
                updateParams("sort", value === "newest" ? null : value)
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
                <SelectItem value="price_asc">{t("shop.sortPriceLow")}</SelectItem>
                <SelectItem value="price_desc">{t("shop.sortPriceHigh")}</SelectItem>
                <SelectItem value="discount">
                  {locale === "ar" ? "أعلى خصم" : locale === "de" ? "Höchster Rabatt" : "Highest discount"}
                </SelectItem>
                <SelectItem value="name">{t("shop.sortName")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl font-bold lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="me-2 h-4 w-4" />
              {locale === "ar" ? "الفلاتر" : locale === "de" ? "Filter" : "Filters"}
            </Button>
          </div>
        </section>

        {hasActiveFilters && (
          <ActiveFilters
            locale={locale}
            categories={categories}
            brands={brands}
            collections={collections}
            tags={tags}
            ageGroups={ageGroups}
            activeCategory={activeCategory}
            activeBrand={activeBrand}
            activeCollection={activeCollection}
            activeTag={activeTag}
            activeAgeGroup={activeAgeGroup}
            searchQuery={searchQuery}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onRemove={(key) => {
              if (key === "category") selectCategory(null);
              else updateParams(key, null);
            }}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div className="min-w-0">
            {products.length > 0 ? (
              <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
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
                  onClick={clearAllFilters}
                >
                  {t("common.clearFilters")}
                </Button>
              </section>
            )}
          </div>
        </div>
      </div>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="max-h-[86svh] max-w-[calc(100vw-24px)] overflow-y-auto rounded-3xl p-4 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {locale === "ar" ? "تصفية المنتجات" : locale === "de" ? "Produkte filtern" : "Filter products"}
            </DialogTitle>
          </DialogHeader>

          {filterPanel}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function FilterPanel({
  locale,
  categories,
  brands,
  collections,
  tags,
  ageGroups,
  activeCategory,
  activeBrand,
  activeCollection,
  activeTag,
  activeAgeGroup,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  onApplyPrice,
  onSelectCategory,
  onChangeFilter,
}: {
  locale: Locale;
  categories: CategoryFull[];
  brands: BrandFull[];
  collections: CollectionBasic[];
  tags: TagBasic[];
  ageGroups: AgeGroupBasic[];
  activeCategory?: string;
  activeBrand?: string;
  activeCollection?: string;
  activeTag?: string;
  activeAgeGroup?: string;
  priceMin: string;
  priceMax: string;
  setPriceMin: (value: string) => void;
  setPriceMax: (value: string) => void;
  onApplyPrice: () => void;
  onSelectCategory: (slug: string | null) => void;
  onChangeFilter: (key: FilterKey, value: string | null) => void;
}) {
  const allLabel = locale === "ar" ? "الكل" : locale === "de" ? "Alle" : "All";

  return (
    <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
      <FilterGroup title={locale === "ar" ? "الفئات" : locale === "de" ? "Kategorien" : "Categories"}>
        <FilterButton active={!activeCategory} onClick={() => onSelectCategory(null)}>
          {allLabel}
        </FilterButton>

        {categories.map((item) => (
          <FilterButton
            key={item.id}
            active={activeCategory === item.slug}
            onClick={() => onSelectCategory(item.slug)}
          >
            {getTranslated(item, "name", locale)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={locale === "ar" ? "البراند" : locale === "de" ? "Marke" : "Brand"}>
        <FilterButton active={!activeBrand} onClick={() => onChangeFilter("brand", null)}>
          {allLabel}
        </FilterButton>

        {brands.map((item) => (
          <FilterButton
            key={item.id}
            active={activeBrand === item.slug}
            onClick={() => onChangeFilter("brand", item.slug)}
          >
            {getTranslated(item, "name", locale)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={locale === "ar" ? "الكولكشنز" : locale === "de" ? "Kollektionen" : "Collections"}>
        <FilterButton active={!activeCollection} onClick={() => onChangeFilter("collection", null)}>
          {allLabel}
        </FilterButton>

        {collections.map((item) => (
          <FilterButton
            key={item.id}
            active={activeCollection === item.slug}
            onClick={() => onChangeFilter("collection", item.slug)}
          >
            {getTranslated(item, "name", locale)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={locale === "ar" ? "العمر" : locale === "de" ? "Alter" : "Age group"}>
        <FilterButton active={!activeAgeGroup} onClick={() => onChangeFilter("ageGroup", null)}>
          {allLabel}
        </FilterButton>

        {ageGroups.map((item) => (
          <FilterButton
            key={item.id}
            active={activeAgeGroup === item.slug}
            onClick={() => onChangeFilter("ageGroup", item.slug)}
          >
            {getTranslated(item, "name", locale)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={locale === "ar" ? "الخصائص" : locale === "de" ? "Tags" : "Tags"}>
        <FilterButton active={!activeTag} onClick={() => onChangeFilter("tag", null)}>
          {allLabel}
        </FilterButton>

        {tags.map((item) => (
          <FilterButton
            key={item.id}
            active={activeTag === item.slug}
            onClick={() => onChangeFilter("tag", item.slug)}
          >
            {getTranslated(item, "name", locale)}
          </FilterButton>
        ))}
      </FilterGroup>

      <div className="rounded-2xl border bg-gray-50/70 p-3">
        <p className="mb-3 text-sm font-extrabold text-gray-950">
          {locale === "ar" ? "السعر" : locale === "de" ? "Preis" : "Price"}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min="0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder={locale === "ar" ? "من" : "Min"}
            className="rounded-xl bg-white"
          />

          <Input
            type="number"
            min="0"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder={locale === "ar" ? "إلى" : "Max"}
            className="rounded-xl bg-white"
          />
        </div>

        <Button type="button" className="mt-3 w-full rounded-xl font-bold" onClick={onApplyPrice}>
          {locale === "ar" ? "تطبيق السعر" : locale === "de" ? "Preis anwenden" : "Apply price"}
        </Button>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-gray-50/70 p-3">
      <h3 className="mb-3 text-sm font-extrabold text-gray-950">{title}</h3>
      <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pe-1">
        {children}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
        active
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ActiveFilters({
  locale,
  categories,
  brands,
  collections,
  tags,
  ageGroups,
  activeCategory,
  activeBrand,
  activeCollection,
  activeTag,
  activeAgeGroup,
  searchQuery,
  minPrice,
  maxPrice,
  onRemove,
}: {
  locale: Locale;
  categories: CategoryFull[];
  brands: BrandFull[];
  collections: CollectionBasic[];
  tags: TagBasic[];
  ageGroups: AgeGroupBasic[];
  activeCategory?: string;
  activeBrand?: string;
  activeCollection?: string;
  activeTag?: string;
  activeAgeGroup?: string;
  searchQuery?: string;
  minPrice?: string;
  maxPrice?: string;
  onRemove: (key: FilterKey) => void;
}) {
  const filters: Array<{ key: FilterKey; label: string }> = [];

  const category = categories.find((item) => item.slug === activeCategory);
  const brand = brands.find((item) => item.slug === activeBrand);
  const collection = collections.find((item) => item.slug === activeCollection);
  const tag = tags.find((item) => item.slug === activeTag);
  const ageGroup = ageGroups.find((item) => item.slug === activeAgeGroup);

  if (category) filters.push({ key: "category", label: getTranslated(category, "name", locale) });
  if (brand) filters.push({ key: "brand", label: getTranslated(brand, "name", locale) });
  if (collection) filters.push({ key: "collection", label: getTranslated(collection, "name", locale) });
  if (tag) filters.push({ key: "tag", label: getTranslated(tag, "name", locale) });
  if (ageGroup) filters.push({ key: "ageGroup", label: getTranslated(ageGroup, "name", locale) });
  if (searchQuery) filters.push({ key: "q", label: searchQuery });
  if (minPrice) filters.push({ key: "minPrice", label: `${locale === "ar" ? "من" : "Min"} ${minPrice}` });
  if (maxPrice) filters.push({ key: "maxPrice", label: `${locale === "ar" ? "إلى" : "Max"} ${maxPrice}` });

  if (!filters.length) return null;

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge
          key={`${filter.key}-${filter.label}`}
          variant="outline"
          className="gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold"
        >
          {filter.label}

          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            className="ms-1 rounded-full text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Remove filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}