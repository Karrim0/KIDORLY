"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateHomepageSectionAction } from "@/actions/settings";
import { Loader2, Save, Home } from "lucide-react";

interface Section {
  id: string;
  sectionKey: string;
  data: string;
  sortOrder: number;
  visible: boolean;
}

export function HomepageClient({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [saving, setSaving] = useState<string | null>(null);

  const EDITABLE_SECTIONS = [
    { key: "announcement", label: t("announcementBar"), fields: ["textEn", "textAr", "textDe"] },
    { key: "hero", label: t("heroSection"), fields: ["titleEn", "titleAr", "titleDe", "subtitleEn", "subtitleAr", "subtitleDe", "ctaEn", "ctaAr", "ctaDe", "image"] },
    { key: "trust", label: t("trustSection"), fields: ["titleEn", "titleAr", "titleDe", "contentEn", "contentAr", "contentDe"] },
    { key: "delivery_note", label: t("deliveryNote"), fields: ["textEn", "textAr", "textDe"] },
    { key: "footer_about", label: t("footerAbout"), fields: ["textEn", "textAr", "textDe"] },
  ];

  const sectionMap: Record<string, Record<string, string>> = {};
  for (const s of sections) {
    try { sectionMap[s.sectionKey] = JSON.parse(s.data); } catch { sectionMap[s.sectionKey] = {}; }
  }

  const [forms, setForms] = useState<Record<string, Record<string, string>>>(
    EDITABLE_SECTIONS.reduce((acc, sec) => {
      acc[sec.key] = sec.fields.reduce((f, field) => {
        f[field] = sectionMap[sec.key]?.[field] || "";
        return f;
      }, {} as Record<string, string>);
      return acc;
    }, {} as Record<string, Record<string, string>>)
  );

  function updateField(sectionKey: string, field: string, value: string) {
    setForms((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [field]: value } }));
  }

  async function saveSection(sectionKey: string) {
    setSaving(sectionKey);
    await updateHomepageSectionAction(sectionKey, forms[sectionKey]);
    setSaving(null);
    router.refresh();
  }

  function getLabel(field: string): string {
    if (field.endsWith("En")) return field.replace("En", " (EN)");
    if (field.endsWith("Ar")) return field.replace("Ar", " (AR)");
    if (field.endsWith("De")) return field.replace("De", " (DE)");
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  function isTextarea(field: string): boolean {
    return field.startsWith("subtitle") || field.startsWith("content") || field.startsWith("text");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Home className="h-6 w-6" /> {t("homepageEditor")}
      </h1>
      <div className="space-y-6 max-w-4xl">
        {EDITABLE_SECTIONS.map((sec) => (
          <div key={sec.key} className="bg-white rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">{sec.label}</h2>
              <Button size="sm" onClick={() => saveSection(sec.key)} disabled={saving === sec.key}>
                {saving === sec.key ? <Loader2 className="h-3.5 w-3.5 animate-spin me-1" /> : <Save className="h-3.5 w-3.5 me-1" />}
                {t("save")}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sec.fields.map((field) => (
                <div key={field}>
                  <Label className="text-xs">{getLabel(field)}</Label>
                  {isTextarea(field) ? (
                    <Textarea value={forms[sec.key]?.[field] || ""} onChange={(e) => updateField(sec.key, field, e.target.value)} className="mt-1 text-sm" rows={3} dir={field.endsWith("Ar") ? "rtl" : "ltr"} />
                  ) : (
                    <Input value={forms[sec.key]?.[field] || ""} onChange={(e) => updateField(sec.key, field, e.target.value)} className="mt-1 text-sm" dir={field.endsWith("Ar") ? "rtl" : "ltr"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
