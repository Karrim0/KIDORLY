"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Loader2, Save } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { BrandFull } from "@/types";

interface Props {
  brand?: BrandFull | null;
}

export function BrandForm({ brand }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: brand?.slug || "",
    nameEn: brand?.nameEn || "",
    nameAr: brand?.nameAr || "",
    nameDe: brand?.nameDe || "",
    descriptionEn: brand?.descriptionEn || "",
    descriptionAr: brand?.descriptionAr || "",
    descriptionDe: brand?.descriptionDe || "",
    logo: brand?.logo || "",
    banner: brand?.banner || "",
    featured: brand?.featured || false,
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      slug: form.slug || slugify(form.nameEn),
      nameEn: form.nameEn,
      nameAr: form.nameAr,
      nameDe: form.nameDe,
      descriptionEn: form.descriptionEn || null,
      descriptionAr: form.descriptionAr || null,
      descriptionDe: form.descriptionDe || null,
      logo: form.logo || null,
      banner: form.banner || null,
      featured: form.featured,
    };

    try {
      const url = brand ? `/api/brands/${brand.id}` : "/api/brands";
      const method = brand ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${locale}/admin/brands`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">
        {brand ? t("editBrand") : t("addBrand")}
      </h1>

      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("basicInfo")}</h2>

        <div>
          <Label>{t("slug")}</Label>
          <Input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto-generated"
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>{t("nameEn")}</Label>
            <Input
              value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label>{t("nameAr")}</Label>
            <Input
              value={form.nameAr}
              onChange={(e) => set("nameAr", e.target.value)}
              className="mt-1.5"
              dir="rtl"
              required
            />
          </div>
          <div>
            <Label>{t("nameDe")}</Label>
            <Input
              value={form.nameDe}
              onChange={(e) => set("nameDe", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>{t("descEn")}</Label>
            <Textarea
              value={form.descriptionEn}
              onChange={(e) => set("descriptionEn", e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>
          <div>
            <Label>{t("descAr")}</Label>
            <Textarea
              value={form.descriptionAr}
              onChange={(e) => set("descriptionAr", e.target.value)}
              className="mt-1.5"
              rows={3}
              dir="rtl"
            />
          </div>
          <div>
            <Label>{t("descDe")}</Label>
            <Textarea
              value={form.descriptionDe}
              onChange={(e) => set("descriptionDe", e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("brandImages")}</h2>

        <div>
          <Label className="mb-3 block">{t("brandLogo")}</Label>
          <ImageUploader
            value={form.logo ? [form.logo] : []}
            onChange={(urls) => set("logo", urls[0] || "")}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t("brandLogoHint")}
          </p>
        </div>

        <div>
          <Label className="mb-3 block">{t("brandBanner")}</Label>
          <ImageUploader
            value={form.banner ? [form.banner] : []}
            onChange={(urls) => set("banner", urls[0] || "")}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t("brandBannerHint")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="featured">{t("featuredBrand")}</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {brand ? t("updateBrand") : t("createBrand")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
