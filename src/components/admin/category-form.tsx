"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory } from "@/actions/products";
import { slugify } from "@/lib/utils";
import { Loader2, Save } from "lucide-react";
import type { CategoryFull } from "@/types";

export function CategoryForm({ category }: { category?: CategoryFull | null }) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: category?.slug || "",
    nameEn: category?.nameEn || "", nameAr: category?.nameAr || "", nameDe: category?.nameDe || "",
    descriptionEn: category?.descriptionEn || "", descriptionAr: category?.descriptionAr || "", descriptionDe: category?.descriptionDe || "",
    image: category?.image || "",
    discountPercentage: category?.discountPercentage?.toString() || "",
    seoTitleEn: category?.seoTitleEn || "", seoTitleAr: category?.seoTitleAr || "", seoTitleDe: category?.seoTitleDe || "",
    seoDescEn: category?.seoDescEn || "", seoDescAr: category?.seoDescAr || "", seoDescDe: category?.seoDescDe || "",
  });

  function set(key: string, value: string) { setForm((prev) => ({ ...prev, [key]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const data = {
      slug: form.slug || slugify(form.nameEn),
      nameEn: form.nameEn, nameAr: form.nameAr, nameDe: form.nameDe,
      descriptionEn: form.descriptionEn || null, descriptionAr: form.descriptionAr || null, descriptionDe: form.descriptionDe || null,
      image: form.image || null,
      discountPercentage: form.discountPercentage ? parseFloat(form.discountPercentage) : null,
      seoTitleEn: form.seoTitleEn || null, seoTitleAr: form.seoTitleAr || null, seoTitleDe: form.seoTitleDe || null,
      seoDescEn: form.seoDescEn || null, seoDescAr: form.seoDescAr || null, seoDescDe: form.seoDescDe || null,
    };
    try {
      if (category) await updateCategory(category.id, data);
      else await createCategory(data);
      router.push(`/${locale}/admin/categories`);
      router.refresh();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("categoryDetails")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>{t("slug")}</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="mt-1.5" /></div>
          <div><Label>{t("imageUrl")}</Label><Input value={form.image} onChange={(e) => set("image", e.target.value)} className="mt-1.5" placeholder="https://..." /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("nameEn")}</Label><Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="mt-1.5" required /></div>
          <div><Label>{t("nameAr")}</Label><Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="mt-1.5" dir="rtl" required /></div>
          <div><Label>{t("nameDe")}</Label><Input value={form.nameDe} onChange={(e) => set("nameDe", e.target.value)} className="mt-1.5" required /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("descEn")}</Label><Textarea value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className="mt-1.5" rows={3} /></div>
          <div><Label>{t("descAr")}</Label><Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="mt-1.5" rows={3} dir="rtl" /></div>
          <div><Label>{t("descDe")}</Label><Textarea value={form.descriptionDe} onChange={(e) => set("descriptionDe", e.target.value)} className="mt-1.5" rows={3} /></div>
        </div>
        <div><Label>{t("discountPercent")}</Label><Input type="number" value={form.discountPercentage} onChange={(e) => set("discountPercentage", e.target.value)} className="mt-1.5 max-w-[200px]" min="0" max="100" /></div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("seo")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("seoTitleEn")}</Label><Input value={form.seoTitleEn} onChange={(e) => set("seoTitleEn", e.target.value)} className="mt-1.5" /></div>
          <div><Label>{t("seoTitleAr")}</Label><Input value={form.seoTitleAr} onChange={(e) => set("seoTitleAr", e.target.value)} className="mt-1.5" dir="rtl" /></div>
          <div><Label>{t("seoTitleDe")}</Label><Input value={form.seoTitleDe} onChange={(e) => set("seoTitleDe", e.target.value)} className="mt-1.5" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("seoDescEn")}</Label><Textarea value={form.seoDescEn} onChange={(e) => set("seoDescEn", e.target.value)} className="mt-1.5" rows={2} /></div>
          <div><Label>{t("seoDescAr")}</Label><Textarea value={form.seoDescAr} onChange={(e) => set("seoDescAr", e.target.value)} className="mt-1.5" rows={2} dir="rtl" /></div>
          <div><Label>{t("seoDescDe")}</Label><Textarea value={form.seoDescDe} onChange={(e) => set("seoDescDe", e.target.value)} className="mt-1.5" rows={2} /></div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
          {category ? t("updateCategory") : t("createCategory")}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>{t("cancel")}</Button>
      </div>
    </form>
  );
}
