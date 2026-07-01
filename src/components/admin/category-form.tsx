"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, Link2, Loader2, Save, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCategory, updateCategory } from "@/actions/products";
import { slugify } from "@/lib/utils";
import type { CategoryFull } from "@/types";

type AdminCategory = CategoryFull & {
  icon?: string | null;
  banner?: string | null;
  visible?: boolean;
  featured?: boolean;
  sortOrder?: number;
  parentId?: string | null;
  relatedTo?: CategoryOption[];
};

type CategoryOption = {
  id: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  parentId?: string | null;
};

type CategoryFormProps = {
  category?: AdminCategory | null;
  parentCategories?: CategoryOption[];
};

export function CategoryForm({
  category,
  parentCategories = [],
}: CategoryFormProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();

  const [saving, setSaving] = useState(false);

function tr(key: string, fallback: string) {
  try {
    return (t as unknown as (key: string) => string)(key);
  } catch {
    return fallback;
  }
}

  const availableParents = useMemo(() => {
    return parentCategories.filter((item) => item.id !== category?.id);
  }, [parentCategories, category?.id]);

  const relatedOptions = useMemo(() => {
    return parentCategories.filter((item) => item.id !== category?.id);
  }, [parentCategories, category?.id]);

  const [form, setForm] = useState({
    slug: category?.slug || "",

    nameEn: category?.nameEn || "",
    nameAr: category?.nameAr || "",
    nameDe: category?.nameDe || "",

    descriptionEn: category?.descriptionEn || "",
    descriptionAr: category?.descriptionAr || "",
    descriptionDe: category?.descriptionDe || "",

    image: category?.image || "",
    icon: category?.icon || "",
    banner: category?.banner || "",

    parentId: category?.parentId || "none",
    sortOrder: category?.sortOrder?.toString() || "0",
    discountPercentage: category?.discountPercentage?.toString() || "",

    visible: category?.visible ?? true,
    featured: category?.featured ?? false,

    relatedCategoryIds: category?.relatedTo?.map((item) => item.id) || [],

    seoTitleEn: category?.seoTitleEn || "",
    seoTitleAr: category?.seoTitleAr || "",
    seoTitleDe: category?.seoTitleDe || "",

    seoDescEn: category?.seoDescEn || "",
    seoDescAr: category?.seoDescAr || "",
    seoDescDe: category?.seoDescDe || "",
  });

  function setValue<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function getCategoryName(item: CategoryOption) {
    if (locale === "ar") return item.nameAr || item.nameEn;
    if (locale === "de") return item.nameDe || item.nameEn;

    return item.nameEn || item.nameAr;
  }

  function generateSlug() {
    const source = form.nameEn || form.nameAr || form.nameDe;
    if (!source) return;

    setValue("slug", slugify(source));
  }

  function toggleRelatedCategory(id: string) {
    setForm((prev) => {
      const exists = prev.relatedCategoryIds.includes(id);

      return {
        ...prev,
        relatedCategoryIds: exists
          ? prev.relatedCategoryIds.filter((item) => item !== id)
          : [...prev.relatedCategoryIds, id],
      };
    });
  }

  const selectedRelatedCategories = useMemo(() => {
    return relatedOptions.filter((item) =>
      form.relatedCategoryIds.includes(item.id),
    );
  }, [relatedOptions, form.relatedCategoryIds]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      slug: form.slug || slugify(form.nameEn || form.nameAr || form.nameDe),

      nameEn: form.nameEn,
      nameAr: form.nameAr,
      nameDe: form.nameDe,

      descriptionEn: form.descriptionEn || null,
      descriptionAr: form.descriptionAr || null,
      descriptionDe: form.descriptionDe || null,

      image: form.image || null,
      icon: form.icon || null,
      banner: form.banner || null,

      parentId:
        form.parentId && form.parentId !== "none" ? form.parentId : null,

      sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,

      discountPercentage: form.discountPercentage
        ? Number(form.discountPercentage)
        : null,

      visible: form.visible,
      featured: form.featured,

      relatedCategoryIds: form.relatedCategoryIds.filter(
        (id) => id && id !== category?.id,
      ),

      seoTitleEn: form.seoTitleEn || null,
      seoTitleAr: form.seoTitleAr || null,
      seoTitleDe: form.seoTitleDe || null,

      seoDescEn: form.seoDescEn || null,
      seoDescAr: form.seoDescAr || null,
      seoDescDe: form.seoDescDe || null,
    };

    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      router.push(`/${locale}/admin/categories`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {tr("categoryDetails", "Category details")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {tr(
                    "categoryDetailsHint",
                    "Basic category information shown across the website.",
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {form.featured
                  ? tr("featuredCategory", "Featured")
                  : tr("normalCategory", "Normal")}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <Label>{tr("slug", "Slug")}</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setValue("slug", e.target.value)}
                  placeholder="auto-generated"
                  className="mt-1.5"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={generateSlug}
                >
                  {tr("generateSlug", "Generate slug")}
                </Button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
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

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>{tr("descEn", "Description EN")}</Label>
                <Textarea
                  value={form.descriptionEn}
                  onChange={(e) => setValue("descriptionEn", e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              </div>

              <div>
                <Label>{tr("descAr", "Description AR")}</Label>
                <Textarea
                  value={form.descriptionAr}
                  onChange={(e) => setValue("descriptionAr", e.target.value)}
                  className="mt-1.5"
                  rows={4}
                  dir="rtl"
                />
              </div>

              <div>
                <Label>{tr("descDe", "Description DE")}</Label>
                <Textarea
                  value={form.descriptionDe}
                  onChange={(e) => setValue("descriptionDe", e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              {tr("categoryMedia", "Category media")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {tr(
                "categoryMediaHint",
                "Use clean square images for carousel cards and wide banners for category pages.",
              )}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>{tr("imageUrl", "Image URL")}</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setValue("image", e.target.value)}
                  className="mt-1.5"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>{tr("iconUrl", "Icon URL")}</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setValue("icon", e.target.value)}
                  className="mt-1.5"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>{tr("bannerUrl", "Banner URL")}</Label>
                <Input
                  value={form.banner}
                  onChange={(e) => setValue("banner", e.target.value)}
                  className="mt-1.5"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Link2 className="h-5 w-5 text-primary" />
                  {tr("relatedCategories", "Related categories")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {tr(
                    "relatedCategoriesHint",
                    "Choose categories that should appear as related suggestions on the category page.",
                  )}
                </p>
              </div>

              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {form.relatedCategoryIds.length} {tr("selected", "selected")}
              </span>
            </div>

            {relatedOptions.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedOptions.map((item) => {
                  const selected = form.relatedCategoryIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleRelatedCategory(item.id)}
                      className={[
                        "flex items-center justify-between gap-3 rounded-2xl border p-4 text-start transition-all",
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-white text-gray-700 hover:border-primary/40 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">
                          {getCategoryName(item)}
                        </span>

                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {item.parentId
                            ? tr("subCategory", "Sub category")
                            : tr("mainCategory", "Main category")}
                        </span>
                      </span>

                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-white text-transparent",
                        ].join(" ")}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed bg-gray-50 p-6 text-center text-sm text-muted-foreground">
                {tr("noRelatedCategoryOptions", "No categories available yet.")}
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">{tr("seo", "SEO")}</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {tr(
                "seoHint",
                "Optional metadata for better search visibility.",
              )}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
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

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">{tr("publishing", "Publishing")}</h3>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-2xl border bg-gray-50/70 p-4">
                <div>
                  <Label className="font-semibold">
                    {tr("visible", "Visible")}
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {tr("visibleHint", "Show this category to customers.")}
                  </p>
                </div>

                <Switch
                  checked={form.visible}
                  onCheckedChange={(checked) => setValue("visible", checked)}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border bg-gray-50/70 p-4">
                <div>
                  <Label className="font-semibold">
                    {tr("featured", "Featured")}
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {tr("featuredHint", "Show in homepage carousel.")}
                  </p>
                </div>

                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>

              <div>
                <Label>{tr("parentCategory", "Parent category")}</Label>
                <select
                  value={form.parentId}
                  onChange={(e) => setValue("parentId", e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="none">
                    {tr("noParentCategory", "No parent category")}
                  </option>

                  {availableParents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getCategoryName(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>{tr("sortOrder", "Sort order")}</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setValue("sortOrder", e.target.value)}
                  className="mt-1.5"
                  min="0"
                />
              </div>

              <div>
                <Label>{tr("discountPercent", "Discount percent")}</Label>
                <Input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    setValue("discountPercentage", e.target.value)
                  }
                  className="mt-1.5"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">{tr("preview", "Preview")}</h3>

            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-2xl border bg-gray-50">
                <div className="relative aspect-[16/8]">
                  {form.banner || form.image ? (
                    <Image
                      src={form.banner || form.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      {tr("noBannerPreview", "No banner preview")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
                  {form.icon || form.image ? (
                    <Image
                      src={form.icon || form.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {locale === "ar"
                      ? form.nameAr || form.nameEn || "Category name"
                      : locale === "de"
                        ? form.nameDe || form.nameEn || "Category name"
                        : form.nameEn || form.nameAr || "Category name"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    /category/{form.slug || "category-slug"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-bold">
              {tr("selectedClassification", "Selected classification")}
            </h3>

            <div className="mt-4 space-y-2">
              {selectedRelatedCategories.length > 0 ? (
                selectedRelatedCategories.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
                  >
                    {getCategoryName(item)}
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-gray-50 px-3 py-3 text-sm text-muted-foreground">
                  {tr("noRelatedCategoriesSelected", "No related categories selected.")}
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border bg-white/90 p-3 shadow-lg backdrop-blur sm:flex-row">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="me-2 h-4 w-4" />
          )}

          {category
            ? tr("updateCategory", "Update category")
            : tr("createCategory", "Create category")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          {tr("cancel", "Cancel")}
        </Button>
      </div>
    </form>
  );
}