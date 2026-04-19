"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/actions/settings";
import { SETTING_KEYS } from "@/lib/settings";
import { Loader2, Save, MessageCircle, CreditCard, Truck, Globe, Share2 } from "lucide-react";

export function SettingsClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
          {t("saveAllSettings")}
        </Button>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><MessageCircle className="h-5 w-5" />{t("whatsappSettings")}</h2>
          <div>
            <Label>{t("whatsappNumber")}</Label>
            <Input value={form[SETTING_KEYS.WHATSAPP_NUMBER] || ""} onChange={(e) => set(SETTING_KEYS.WHATSAPP_NUMBER, e.target.value)} className="mt-1.5 max-w-sm" placeholder="+201234567890" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("templateEn")}</Label><Textarea value={form[SETTING_KEYS.WHATSAPP_TEMPLATE_EN] || ""} onChange={(e) => set(SETTING_KEYS.WHATSAPP_TEMPLATE_EN, e.target.value)} className="mt-1.5" rows={3} /></div>
            <div><Label>{t("templateAr")}</Label><Textarea value={form[SETTING_KEYS.WHATSAPP_TEMPLATE_AR] || ""} onChange={(e) => set(SETTING_KEYS.WHATSAPP_TEMPLATE_AR, e.target.value)} className="mt-1.5" rows={3} dir="rtl" /></div>
            <div><Label>{t("templateDe")}</Label><Textarea value={form[SETTING_KEYS.WHATSAPP_TEMPLATE_DE] || ""} onChange={(e) => set(SETTING_KEYS.WHATSAPP_TEMPLATE_DE, e.target.value)} className="mt-1.5" rows={3} /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5" />{t("paymentSettings")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>{t("vodafoneNumber")}</Label><Input value={form[SETTING_KEYS.VODAFONE_NUMBER] || ""} onChange={(e) => set(SETTING_KEYS.VODAFONE_NUMBER, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("instapayId")}</Label><Input value={form[SETTING_KEYS.INSTAPAY_ID] || ""} onChange={(e) => set(SETTING_KEYS.INSTAPAY_ID, e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("instructionsEn")}</Label><Textarea value={form[SETTING_KEYS.PAYMENT_INSTRUCTIONS_EN] || ""} onChange={(e) => set(SETTING_KEYS.PAYMENT_INSTRUCTIONS_EN, e.target.value)} className="mt-1.5" rows={3} /></div>
            <div><Label>{t("instructionsAr")}</Label><Textarea value={form[SETTING_KEYS.PAYMENT_INSTRUCTIONS_AR] || ""} onChange={(e) => set(SETTING_KEYS.PAYMENT_INSTRUCTIONS_AR, e.target.value)} className="mt-1.5" rows={3} dir="rtl" /></div>
            <div><Label>{t("instructionsDe")}</Label><Textarea value={form[SETTING_KEYS.PAYMENT_INSTRUCTIONS_DE] || ""} onChange={(e) => set(SETTING_KEYS.PAYMENT_INSTRUCTIONS_DE, e.target.value)} className="mt-1.5" rows={3} /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Truck className="h-5 w-5" />{t("deliverySettings")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("shippingHurghada")}</Label><Input type="number" value={form[SETTING_KEYS.SHIPPING_HURGHADA] || ""} onChange={(e) => set(SETTING_KEYS.SHIPPING_HURGHADA, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("shippingCairo")}</Label><Input type="number" value={form[SETTING_KEYS.SHIPPING_CAIRO] || ""} onChange={(e) => set(SETTING_KEYS.SHIPPING_CAIRO, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("shippingAlexandria")}</Label><Input type="number" value={form[SETTING_KEYS.SHIPPING_ALEXANDRIA] || ""} onChange={(e) => set(SETTING_KEYS.SHIPPING_ALEXANDRIA, e.target.value)} className="mt-1.5" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Share2 className="h-5 w-5" />{t("contactSocial")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("contactEmail")}</Label><Input value={form[SETTING_KEYS.CONTACT_EMAIL] || ""} onChange={(e) => set(SETTING_KEYS.CONTACT_EMAIL, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("contactPhone")}</Label><Input value={form[SETTING_KEYS.CONTACT_PHONE] || ""} onChange={(e) => set(SETTING_KEYS.CONTACT_PHONE, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("brandName")}</Label><Input value={form[SETTING_KEYS.BRAND_NAME] || ""} onChange={(e) => set(SETTING_KEYS.BRAND_NAME, e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("instagramUrl")}</Label><Input value={form[SETTING_KEYS.INSTAGRAM] || ""} onChange={(e) => set(SETTING_KEYS.INSTAGRAM, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("facebookUrl")}</Label><Input value={form[SETTING_KEYS.FACEBOOK] || ""} onChange={(e) => set(SETTING_KEYS.FACEBOOK, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("tiktokUrl")}</Label><Input value={form[SETTING_KEYS.TIKTOK] || ""} onChange={(e) => set(SETTING_KEYS.TIKTOK, e.target.value)} className="mt-1.5" /></div>
          </div>
          <div><Label>{t("logoUrl")}</Label><Input value={form[SETTING_KEYS.LOGO_URL] || ""} onChange={(e) => set(SETTING_KEYS.LOGO_URL, e.target.value)} className="mt-1.5 max-w-lg" /></div>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Globe className="h-5 w-5" />{t("defaultSeo")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("seoTitleEn")}</Label><Input value={form[SETTING_KEYS.SEO_TITLE_EN] || ""} onChange={(e) => set(SETTING_KEYS.SEO_TITLE_EN, e.target.value)} className="mt-1.5" /></div>
            <div><Label>{t("seoTitleAr")}</Label><Input value={form[SETTING_KEYS.SEO_TITLE_AR] || ""} onChange={(e) => set(SETTING_KEYS.SEO_TITLE_AR, e.target.value)} className="mt-1.5" dir="rtl" /></div>
            <div><Label>{t("seoTitleDe")}</Label><Input value={form[SETTING_KEYS.SEO_TITLE_DE] || ""} onChange={(e) => set(SETTING_KEYS.SEO_TITLE_DE, e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>{t("seoDescEn")}</Label><Textarea value={form[SETTING_KEYS.SEO_DESC_EN] || ""} onChange={(e) => set(SETTING_KEYS.SEO_DESC_EN, e.target.value)} className="mt-1.5" rows={2} /></div>
            <div><Label>{t("seoDescAr")}</Label><Textarea value={form[SETTING_KEYS.SEO_DESC_AR] || ""} onChange={(e) => set(SETTING_KEYS.SEO_DESC_AR, e.target.value)} className="mt-1.5" rows={2} dir="rtl" /></div>
            <div><Label>{t("seoDescDe")}</Label><Textarea value={form[SETTING_KEYS.SEO_DESC_DE] || ""} onChange={(e) => set(SETTING_KEYS.SEO_DESC_DE, e.target.value)} className="mt-1.5" rows={2} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
