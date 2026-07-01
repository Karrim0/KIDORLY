"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  Clock,
  Loader2,
  PackageCheck,
  Save,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createProduct, updateProduct } from "@/actions/products";
import { slugify } from "@/lib/utils";
import type {
  AgeGroupBasic,
  BrandBasic,
  CategoryBasic,
  CollectionBasic,
  ProductWithCategory,
  TagBasic,
} from "@/types";

type ProductFormProduct = ProductWithCategory & {
  collections?: Array<{ collection: CollectionBasic }>;
  tags?: Array<{ tag: TagBasic }>;
  ageGroups?: Array<{ ageGroup: AgeGroupBasic }>;
};

interface ProductFormProps {
  product?: ProductFormProduct | null;
  categories: CategoryBasic[];
  brands: BrandBasic[];
  collections?: CollectionBasic[];
  tags?: TagBasic[];
  ageGroups?: AgeGroupBasic[];
}

function toDatetimeLocal(date?: Date | string | null): string {
  if (!date) return "";

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cleanList(value: string, separator: "comma" | "line") {
  const parts = separator === "comma" ? value.split(",") : value.split("\n");

  return parts.map((item) => item.trim()).filter(Boolean);
}

export function ProductForm({
  product,
  categories,
  brands,
  collections = [],
  tags = [],
  ageGroups = [],
}: ProductFormProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [classificationSearch, setClassificationSearch] = useState("");

  function tr(key: string, fallback: string) {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  }

  const [form, setForm] = useState({
    slug: product?.slug || "",

    brandId: product?.brandId || "none",
    categoryId: product?.categoryId || "none",

    collectionIds:
      product?.collections?.map((item) => item.collection.id) || [],
    tagIds: product?.tags?.map((item) => item.tag.id) || [],
    ageGroupIds: product?.ageGroups?.map((item) => item.ageGroup.id) || [],

    nameEn: product?.nameEn || "",
    nameAr: product?.nameAr || "",
    nameDe: product?.nameDe || "",

    shortDescEn: product?.shortDescEn || "",
    shortDescAr: product?.shortDescAr || "",
    shortDescDe: product?.shortDescDe || "",

    descriptionEn: product?.descriptionEn || "",
    descriptionAr: product?.descriptionAr || "",
    descriptionDe: product?.descriptionDe || "",

    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    discountPercentage: product?.discountPercentage?.toString() || "",
    saleEndsAt: toDatetimeLocal(product?.saleEndsAt),

    availability: product?.availability || "AVAILABLE",
    featured: product?.featured || false,

    images: product?.images?.join("\n") || "",
    colors: product?.colors?.join(", ") || "",
    sizes: product?.sizes?.join(", ") || "",

    seoTitleEn: product?.seoTitleEn || "",
    seoTitleAr: product?.seoTitleAr || "",
    seoTitleDe: product?.seoTitleDe || "",

    seoDescEn: product?.seoDescEn || "",
    seoDescAr: product?.seoDescAr || "",
    seoDescDe: product?.seoDescDe || "",
  });

  const hasDiscount = Number(form.discountPercentage) > 0;

  const selectedClassificationCount =
    form.collectionIds.length + form.tagIds.length + form.ageGroupIds.length;

  function setValue(key: string, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(
    key: "collectionIds" | "tagIds" | "ageGroupIds",
    id: string
  ) {
    setForm((prev) => {
      const current = prev[key];
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      return {
        ...prev,
        [key]: next,
      };
    });
  }

  function getName(
    item:
      | CategoryBasic
      | BrandBasic
      | CollectionBasic
      | TagBasic
      | AgeGroupBasic
  ) {
    if (locale === "ar") return item.nameAr || item.nameEn;
    if (locale === "de") return item.nameDe || item.nameEn;
    return item.nameEn || item.nameAr;
  }

  function generateSlug() {
    const source = form.nameEn || form.nameAr || form.nameDe;
    if (!source) return;

    setValue("slug", slugify(source));
  }

  const filteredCollections = useMemo(() => {
    const q = classificationSearch.trim().toLowerCase();
    if (!q) return collections;

    return collections.filter((item) =>
      `${item.nameEn} ${item.nameAr} ${item.nameDe} ${item.slug}`
        .toLowerCase()
        .includes(q)
    );
  }, [collections, classificationSearch]);

  const filteredTags = useMemo(() => {
    const q = classificationSearch.trim().toLowerCase();
    if (!q) return tags;

    return tags.filter((item) =>
      `${item.nameEn} ${item.nameAr} ${item.nameDe} ${item.slug}`
        .toLowerCase()
        .includes(q)
    );
  }, [tags, classificationSearch]);

  const filteredAgeGroups = useMemo(() => {
    const q = classificationSearch.trim().toLowerCase();
    if (!q) return ageGroups;

    return ageGroups.filter((item) =>
      `${item.nameEn} ${item.nameAr} ${item.nameDe} ${item.slug}`
        .toLowerCase()
        .includes(q)
    );
  }, [ageGroups, classificationSearch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      slug: form.slug || slugify(form.nameEn || form.nameAr || form.nameDe),

      brandId: form.brandId !== "none" ? form.brandId : null,
      categoryId: form.categoryId !== "none" ? form.categoryId : null,

      collectionIds: form.collectionIds,
      tagIds: form.tagIds,
      ageGroupIds: form.ageGroupIds,

      nameEn: form.nameEn,
      nameAr: form.nameAr,
      nameDe: form.nameDe,

      shortDescEn: form.shortDescEn || null,
      shortDescAr: form.shortDescAr || null,
      shortDescDe: form.shortDescDe || null,

      descriptionEn: form.descriptionEn || null,
      descriptionAr: form.descriptionAr || null,
      descriptionDe: form.descriptionDe || null,

      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice
        ? Number(form.compareAtPrice)
        : null,
      discountPercentage: form.discountPercentage
        ? Number(form.discountPercentage)
        : null,

      saleEndsAt:
        hasDiscount && form.saleEndsAt
          ? new Date(form.saleEndsAt).toISOString()
          : null,

      availability: form.availability as "AVAILABLE" | "UNAVAILABLE",
      featured: form.featured,

      images: cleanList(form.images, "line"),
      colors: cleanList(form.colors, "comma"),
      sizes: cleanList(form.sizes, "comma"),

      seoTitleEn: form.seoTitleEn || null,
      seoTitleAr: form.seoTitleAr || null,
      seoTitleDe: form.seoTitleDe || null,

      seoDescEn: form.seoDescEn || null,
      seoDescAr: form.seoDescAr || null,
      seoDescDe: form.seoDescDe || null,
    };

    try {
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-7xl space-y-6 pb-28"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {tr("basicInfo", "Basic info")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tr(
                    "productBasicHint",
                    "Main product names, descriptions, brand, and category."
                  )}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={generateSlug}
              >
                {tr("generateSlug", "Generate slug")}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("slug", "Slug")}</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setValue("slug", e.target.value)}
                  placeholder="auto-generated"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>{tr("brand", "Brand")}</Label>
                <Select
                  value={form.brandId}
                  onValueChange={(value) => setValue("brandId", value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={tr("selectBrand", "Select brand")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">
                      {tr("noBrand", "No brand")}
                    </SelectItem>

                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {getName(brand)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{tr("category", "Category")}</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue
                      placeholder={tr("selectCategory", "Select category")}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">
                      {tr("noCategory", "No category")}
                    </SelectItem>

                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {getName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("nameEn", "Name EN")}</Label>
                <Input
                  value={form.nameEn}
                  onChange={(e) => setValue("nameEn", e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label>{tr("nameAr", "Name AR")}</Label>
                <Input
                  value={form.nameAr}
                  onChange={(e) => setValue("nameAr", e.target.value)}
                  className="mt-1.5"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <Label>{tr("nameDe", "Name DE")}</Label>
                <Input
                  value={form.nameDe}
                  onChange={(e) => setValue("nameDe", e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("shortDescEn", "Short description EN")}</Label>
                <Input
                  value={form.shortDescEn}
                  onChange={(e) => setValue("shortDescEn", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>{tr("shortDescAr", "Short description AR")}</Label>
                <Input
                  value={form.shortDescAr}
                  onChange={(e) => setValue("shortDescAr", e.target.value)}
                  className="mt-1.5"
                  dir="rtl"
                />
              </div>

              <div>
                <Label>{tr("shortDescDe", "Short description DE")}</Label>
                <Input
                  value={form.shortDescDe}
                  onChange={(e) => setValue("shortDescDe", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("descEn", "Description EN")}</Label>
                <Textarea
                  value={form.descriptionEn}
                  onChange={(e) => setValue("descriptionEn", e.target.value)}
                  className="mt-1.5 min-h-32"
                  rows={4}
                />
              </div>

              <div>
                <Label>{tr("descAr", "Description AR")}</Label>
                <Textarea
                  value={form.descriptionAr}
                  onChange={(e) => setValue("descriptionAr", e.target.value)}
                  className="mt-1.5 min-h-32"
                  rows={4}
                  dir="rtl"
                />
              </div>

              <div>
                <Label>{tr("descDe", "Description DE")}</Label>
                <Textarea
                  value={form.descriptionDe}
                  onChange={(e) => setValue("descriptionDe", e.target.value)}
                  className="mt-1.5 min-h-32"
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <PackageCheck className="h-5 w-5 text-brand-sky" />
                  {tr("productClassification", "Product classification")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {tr(
                    "productClassificationHint",
                    "Use collections, tags, and age groups for filters, mega menu, search suggestions, and campaigns."
                  )}
                </p>
              </div>

              {selectedClassificationCount > 0 && (
                <Badge variant="outline">
                  {selectedClassificationCount}{" "}
                  {tr("selected", "selected")}
                </Badge>
              )}
            </div>

            <div className="relative mb-4">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={classificationSearch}
                onChange={(e) => setClassificationSearch(e.target.value)}
                placeholder={tr(
                  "searchCollectionsTagsAge",
                  "Search collections, tags, or age groups..."
                )}
                className="ps-9"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <MultiPicker
                title={tr("collections", "Collections")}
                hint="Best Sellers, New Arrivals, Ramadan..."
                items={filteredCollections}
                selectedIds={form.collectionIds}
                onToggle={(id) => toggleArrayValue("collectionIds", id)}
                getName={getName}
                emptyText={tr("noCollectionsYet", "No collections yet")}
              />

              <MultiPicker
                title={tr("ageGroups", "Age groups")}
                hint="0-2, 3-5, 6-9..."
                items={filteredAgeGroups}
                selectedIds={form.ageGroupIds}
                onToggle={(id) => toggleArrayValue("ageGroupIds", id)}
                getName={getName}
                emptyText={tr("noAgeGroupsYet", "No age groups yet")}
              />

              <MultiPicker
                title={tr("tags", "Tags")}
                hint="Gift, Outdoor, Educational..."
                items={filteredTags}
                selectedIds={form.tagIds}
                onToggle={(id) => toggleArrayValue("tagIds", id)}
                getName={getName}
                emptyText={tr("noTagsYet", "No tags yet")}
              />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <Tag className="h-5 w-5 text-brand-coral" />
              {tr("pricingAvailability", "Pricing & availability")}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <Label>{tr("priceEgp", "Price EGP")}</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setValue("price", e.target.value)}
                  className="mt-1.5"
                  min="0"
                  required
                />
              </div>

              <div>
                <Label>{tr("compareAtPrice", "Compare at price")}</Label>
                <Input
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) => setValue("compareAtPrice", e.target.value)}
                  className="mt-1.5"
                  min="0"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  {tr("discountPercent", "Discount percent")}

                  {hasDiscount && (
                    <span className="rounded-md bg-brand-coral/10 px-1.5 py-0.5 text-[11px] font-bold text-brand-coral">
                      -{form.discountPercentage}%
                    </span>
                  )}
                </Label>

                <Input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    setValue("discountPercentage", e.target.value)
                  }
                  className="mt-1.5"
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>

              <div>
                <Label>{tr("availability", "Availability")}</Label>
                <Select
                  value={form.availability}
                  onValueChange={(value) => setValue("availability", value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="AVAILABLE">
                      {tr("available", "Available")}
                    </SelectItem>

                    <SelectItem value="UNAVAILABLE">
                      {tr("unavailable", "Unavailable")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasDiscount && (
              <div className="mt-5 rounded-2xl border border-brand-coral/20 bg-brand-coral/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-coral" />
                    <h3 className="font-semibold text-brand-coral">
                      {tr("saleTimer", "Sale timer")}
                    </h3>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {tr("saleTimerOptional", "Optional countdown for this sale")}
                  </span>
                </div>

                <div className="mt-4 max-w-sm">
                  <Label>{tr("saleEndsAt", "Sale ends at")}</Label>
                  <Input
                    type="datetime-local"
                    value={form.saleEndsAt}
                    onChange={(e) => setValue("saleEndsAt", e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                {form.saleEndsAt && new Date(form.saleEndsAt) > new Date() && (
                  <div className="mt-4 rounded-xl bg-white p-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      {tr("timerPreview", "Timer preview")}
                    </p>
                    <TimerPreview endsAt={form.saleEndsAt} />
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-bold">
              {tr("mediaVariants", "Media & variants")}
            </h2>

            <div>
              <Label className="mb-3 block">
                {tr("productImages", "Product images")}
              </Label>

              <ImageUploader
                value={cleanList(form.images, "line")}
                onChange={(urls) => setValue("images", urls.join("\n"))}
              />

              <p className="mt-2 text-xs text-muted-foreground">
                {tr(
                  "uploadHint",
                  "Upload high-quality product images. First image is used as the cover."
                )}
              </p>

              <Textarea
                value={form.images}
                onChange={(e) => setValue("images", e.target.value)}
                className="mt-3 font-mono text-xs"
                rows={3}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>{tr("colorsHint", "Colors")}</Label>
                <Input
                  value={form.colors}
                  onChange={(e) => setValue("colors", e.target.value)}
                  className="mt-1.5"
                  placeholder="Red, Blue, Green"
                />
              </div>

              <div>
                <Label>{tr("sizesHint", "Sizes")}</Label>
                <Input
                  value={form.sizes}
                  onChange={(e) => setValue("sizes", e.target.value)}
                  className="mt-1.5"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-bold">{tr("seo", "SEO")}</h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("seoTitleEn", "SEO title EN")}</Label>
                <Input
                  value={form.seoTitleEn}
                  onChange={(e) => setValue("seoTitleEn", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>{tr("seoTitleAr", "SEO title AR")}</Label>
                <Input
                  value={form.seoTitleAr}
                  onChange={(e) => setValue("seoTitleAr", e.target.value)}
                  className="mt-1.5"
                  dir="rtl"
                />
              </div>

              <div>
                <Label>{tr("seoTitleDe", "SEO title DE")}</Label>
                <Input
                  value={form.seoTitleDe}
                  onChange={(e) => setValue("seoTitleDe", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>{tr("seoDescEn", "SEO description EN")}</Label>
                <Textarea
                  value={form.seoDescEn}
                  onChange={(e) => setValue("seoDescEn", e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div>
                <Label>{tr("seoDescAr", "SEO description AR")}</Label>
                <Textarea
                  value={form.seoDescAr}
                  onChange={(e) => setValue("seoDescAr", e.target.value)}
                  className="mt-1.5"
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div>
                <Label>{tr("seoDescDe", "SEO description DE")}</Label>
                <Textarea
                  value={form.seoDescDe}
                  onChange={(e) => setValue("seoDescDe", e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
            <h3 className="font-bold">{tr("publishing", "Publishing")}</h3>

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-gray-50/70 p-4">
                <div>
                  <span className="font-semibold">
                    {tr("featuredProduct", "Featured product")}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tr(
                      "featuredProductHint",
                      "Show this product in homepage sections."
                    )}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setValue("featured", e.target.checked)}
                  className="h-5 w-5 shrink-0 rounded"
                />
              </label>

              <div className="rounded-2xl border bg-gray-50/70 p-4">
                <p className="text-sm font-semibold">
                  {tr("currentStatus", "Current status")}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={
                      form.availability === "AVAILABLE"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }
                  >
                    {form.availability === "AVAILABLE"
                      ? tr("available", "Available")
                      : tr("unavailable", "Unavailable")}
                  </Badge>

                  {form.featured && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Sparkles className="me-1 h-3 w-3" />
                      {tr("featured", "Featured")}
                    </Badge>
                  )}

                  {hasDiscount && (
                    <Badge className="bg-brand-coral text-white hover:bg-brand-coral">
                      -{form.discountPercentage}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
            <h3 className="font-bold">
              {tr("selectedClassification", "Selected classification")}
            </h3>

            <div className="mt-4 space-y-4">
              <SelectedPills
                title={tr("collections", "Collections")}
                items={collections}
                selectedIds={form.collectionIds}
                getName={getName}
                onRemove={(id) => toggleArrayValue("collectionIds", id)}
              />

              <SelectedPills
                title={tr("ageGroups", "Age groups")}
                items={ageGroups}
                selectedIds={form.ageGroupIds}
                getName={getName}
                onRemove={(id) => toggleArrayValue("ageGroupIds", id)}
              />

              <SelectedPills
                title={tr("tags", "Tags")}
                items={tags}
                selectedIds={form.tagIds}
                getName={getName}
                onRemove={(id) => toggleArrayValue("tagIds", id)}
              />
            </div>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur md:left-auto md:right-6 md:bottom-6 md:w-auto md:rounded-2xl md:border md:shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="me-2 h-4 w-4" />
            )}
            {product
              ? tr("updateProduct", "Update product")
              : tr("createProduct", "Create product")}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            {tr("cancel", "Cancel")}
          </Button>
        </div>
      </div>
    </form>
  );
}

function MultiPicker<T extends { id: string; slug: string }>({
  title,
  hint,
  items,
  selectedIds,
  onToggle,
  getName,
  emptyText,
}: {
  title: string;
  hint: string;
  items: T[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  getName: (item: T) => string;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border bg-gray-50/70 p-3">
      <div className="mb-3">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-4 text-center text-xs text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const active = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(item.id)}
                className={[
                  "flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 py-3 text-start text-sm transition-all",
                  active
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-gray-100 text-gray-700 hover:border-primary/40 hover:text-primary",
                ].join(" ")}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {getName(item)}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {item.slug}
                  </span>
                </span>

                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-gray-50",
                  ].join(" ")}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SelectedPills<T extends { id: string }>({
  title,
  items,
  selectedIds,
  getName,
  onRemove,
}: {
  title: string;
  items: T[];
  selectedIds: string[];
  getName: (item: T) => string;
  onRemove: (id: string) => void;
}) {
  const selected = items.filter((item) => selectedIds.includes(item.id));

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      {selected.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-gray-50 p-3 text-xs text-muted-foreground">
          —
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:border-destructive/40 hover:text-destructive"
            >
              {getName(item)}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TimerPreview({ endsAt }: { endsAt: string }) {
  const [value, setValue] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);

  React.useEffect(() => {
    function calc() {
      const diff = new Date(endsAt).getTime() - Date.now();

      if (diff <= 0) {
        setValue(null);
        return;
      }

      setValue({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }

    calc();

    const id = setInterval(calc, 1000);

    return () => clearInterval(id);
  }, [endsAt]);

  if (!value) return null;

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 font-mono text-sm font-bold text-brand-coral">
      {value.d > 0 && <span>{value.d}d</span>}
      <span>{String(value.h).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(value.m).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(value.s).padStart(2, "0")}</span>
    </div>
  );
}