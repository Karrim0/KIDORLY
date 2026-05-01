"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createProduct, updateProduct } from "@/actions/products";
import { slugify } from "@/lib/utils";
import { Loader2, Save, Tag, Clock } from "lucide-react";
import type { ProductWithCategory, CategoryBasic, BrandBasic } from "@/types";

interface ProductFormProps {
  product?: ProductWithCategory | null;
  categories: CategoryBasic[];
  brands: BrandBasic[];
}

// Convert DateTime to <input type="datetime-local"> format
function toDatetimeLocal(date?: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  // Format: YYYY-MM-DDTHH:mm
  return d.toISOString().slice(0, 16);
}

export function ProductForm({ product, categories, brands }: ProductFormProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug:            product?.slug || "",
    brandId:         product?.brandId || "",
    nameEn:          product?.nameEn || "",
    nameAr:          product?.nameAr || "",
    nameDe:          product?.nameDe || "",
    shortDescEn:     product?.shortDescEn || "",
    shortDescAr:     product?.shortDescAr || "",
    shortDescDe:     product?.shortDescDe || "",
    descriptionEn:   product?.descriptionEn || "",
    descriptionAr:   product?.descriptionAr || "",
    descriptionDe:   product?.descriptionDe || "",
    price:           product?.price?.toString() || "",
    compareAtPrice:  product?.compareAtPrice?.toString() || "",
    discountPercentage: product?.discountPercentage?.toString() || "",
    saleEndsAt:      toDatetimeLocal(product?.saleEndsAt),   // ← جديد
    availability:    product?.availability || "AVAILABLE",
    featured:        product?.featured || false,
    categoryId:      product?.categoryId || "",
    images:          product?.images?.join("\n") || "",
    colors:          product?.colors?.join(", ") || "",
    sizes:           product?.sizes?.join(", ") || "",
    seoTitleEn:      product?.seoTitleEn || "",
    seoTitleAr:      product?.seoTitleAr || "",
    seoTitleDe:      product?.seoTitleDe || "",
    seoDescEn:       product?.seoDescEn || "",
    seoDescAr:       product?.seoDescAr || "",
    seoDescDe:       product?.seoDescDe || "",
  });

  const hasDiscount = parseFloat(form.discountPercentage) > 0;

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const data = {
      slug:        form.slug || slugify(form.nameEn),
      brandId:     form.brandId || null,
      nameEn:      form.nameEn,
      nameAr:      form.nameAr,
      nameDe:      form.nameDe,
      shortDescEn: form.shortDescEn || null,
      shortDescAr: form.shortDescAr || null,
      shortDescDe: form.shortDescDe || null,
      descriptionEn: form.descriptionEn || null,
      descriptionAr: form.descriptionAr || null,
      descriptionDe: form.descriptionDe || null,
      price:              parseFloat(form.price) || 0,
      compareAtPrice:     form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      discountPercentage: form.discountPercentage ? parseFloat(form.discountPercentage) : null,
      // سالنا: لو مفيش خصم، مسح التاريخ تلقائي
      saleEndsAt: (hasDiscount && form.saleEndsAt)
        ? new Date(form.saleEndsAt).toISOString()
        : null,
      availability: form.availability as "AVAILABLE" | "UNAVAILABLE",
      featured:     form.featured,
      categoryId:   form.categoryId || null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      sizes:  form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      seoTitleEn: form.seoTitleEn || null,
      seoTitleAr: form.seoTitleAr || null,
      seoTitleDe: form.seoTitleDe || null,
      seoDescEn:  form.seoDescEn || null,
      seoDescAr:  form.seoDescAr || null,
      seoDescDe:  form.seoDescDe || null,
    };
    try {
      if (product) await updateProduct(product.id, data);
      else await createProduct(data);
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">

      {/* ── Basic Info ────────────────────────────── */}
      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("basicInfo")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>{t("slug")}</Label>
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="mt-1.5" />
          </div>
          <div>
            <Label>{t("brand")}</Label>
            <Select value={form.brandId} onValueChange={(v) => set("brandId", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("selectBrand")} /></SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.nameAr || b.nameEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("category")}</Label>
            <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.nameAr || cat.nameEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("nameEn")}</Label><Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="mt-1.5" required /></div>
          <div><Label>{t("nameAr")}</Label><Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="mt-1.5" dir="rtl" required /></div>
          <div><Label>{t("nameDe")}</Label><Input value={form.nameDe} onChange={(e) => set("nameDe", e.target.value)} className="mt-1.5" required /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("shortDescEn")}</Label><Input value={form.shortDescEn} onChange={(e) => set("shortDescEn", e.target.value)} className="mt-1.5" /></div>
          <div><Label>{t("shortDescAr")}</Label><Input value={form.shortDescAr} onChange={(e) => set("shortDescAr", e.target.value)} className="mt-1.5" dir="rtl" /></div>
          <div><Label>{t("shortDescDe")}</Label><Input value={form.shortDescDe} onChange={(e) => set("shortDescDe", e.target.value)} className="mt-1.5" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label>{t("descEn")}</Label><Textarea value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className="mt-1.5" rows={4} /></div>
          <div><Label>{t("descAr")}</Label><Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="mt-1.5" rows={4} dir="rtl" /></div>
          <div><Label>{t("descDe")}</Label><Textarea value={form.descriptionDe} onChange={(e) => set("descriptionDe", e.target.value)} className="mt-1.5" rows={4} /></div>
        </div>
      </div>

      {/* ── Pricing & Sale ────────────────────────── */}
      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Tag className="h-5 w-5 text-brand-coral" />
          {t("pricingAvailability")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>{t("priceEgp")}</Label>
            <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label>{t("compareAtPrice")}</Label>
            <Input type="number" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="flex items-center gap-1.5">
              {t("discountPercent")}
              {hasDiscount && (
                <span className="text-[11px] font-bold text-brand-coral bg-brand-coral/10 px-1.5 py-0.5 rounded-md">
                  -{form.discountPercentage}%
                </span>
              )}
            </Label>
            <Input
              type="number"
              value={form.discountPercentage}
              onChange={(e) => set("discountPercentage", e.target.value)}
              className="mt-1.5"
              min="0"
              max="100"
              placeholder="0"
            />
          </div>
          <div>
            <Label>{t("availability")}</Label>
            <Select value={form.availability} onValueChange={(v) => set("availability", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">{t("available")}</SelectItem>
                <SelectItem value="UNAVAILABLE">{t("unavailable")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sale Timer — only shows when discount > 0 */}
        {hasDiscount && (
          <div className="rounded-xl border border-brand-coral/20 bg-brand-coral/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-coral" />
              <h3 className="font-semibold text-sm text-brand-coral">{t("saleTimer")}</h3>
              <span className="text-xs text-muted-foreground ms-1">{t("saleTimerOptional")}</span>
            </div>

            <div className="max-w-xs">
              <Label>{t("saleEndsAt")}</Label>
              <Input
                type="datetime-local"
                value={form.saleEndsAt}
                onChange={(e) => set("saleEndsAt", e.target.value)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1.5">{t("saleEndsAtHint")}</p>
            </div>

            {/* Preview timer (shows in form if date is set) */}
            {form.saleEndsAt && new Date(form.saleEndsAt) > new Date() && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">{t("timerPreview")}:</p>
                <TimerPreview endsAt={form.saleEndsAt} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
          <Label htmlFor="featured">{t("featuredProduct")}</Label>
        </div>
      </div>

      {/* ── Media & Variants ─────────────────────── */}
      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold text-lg">{t("mediaVariants")}</h2>
        <div>
          <Label className="mb-3 block">{t("productImages")}</Label>
          <ImageUploader value={form.images.split("\n").filter(Boolean)} onChange={(urls) => set("images", urls.join("\n"))} />
          <p className="text-xs text-muted-foreground mt-2">{t("uploadHint")}</p>
          <Textarea value={form.images} onChange={(e) => set("images", e.target.value)} className="mt-2 font-mono text-xs" rows={3} placeholder="https://res.cloudinary.com/..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>{t("colorsHint")}</Label><Input value={form.colors} onChange={(e) => set("colors", e.target.value)} className="mt-1.5" placeholder="Red, Blue, Green" /></div>
          <div><Label>{t("sizesHint")}</Label><Input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="mt-1.5" placeholder="S, M, L, XL" /></div>
        </div>
      </div>

      {/* ── SEO ──────────────────────────────────── */}
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
          {product ? t("updateProduct") : t("createProduct")}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>{t("cancel")}</Button>
      </div>
    </form>
  );
}

// Mini timer preview inside the form (no translations needed)
function TimerPreview({ endsAt }: { endsAt: string }) {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  React.useEffect(() => {
    function calc() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setT(null); return; }
      setT({
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

  if (!t) return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-brand-coral font-mono font-bold text-sm">
      {t.d > 0 && <span>{t.d}d</span>}
      <span>{String(t.h).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(t.m).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(t.s).padStart(2, "0")}</span>
    </div>
  );
}