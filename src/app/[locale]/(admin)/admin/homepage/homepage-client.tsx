"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  Loader2,
  Save,
} from "lucide-react";

import {
  updateHomepageLayoutAction,
  updateHomepageSectionAction,
} from "@/actions/settings";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Section {
  id: string;
  sectionKey: string;
  data: string;
  sortOrder: number;
  visible: boolean;
}

type LayoutKey =
  | "categories"
  | "featured_products"
  | "collections"
  | "age_groups"
  | "partners"
  | "experience";

interface LayoutItem {
  sectionKey: LayoutKey;
  sortOrder: number;
  visible: boolean;
}

const DEFAULT_LAYOUT: LayoutItem[] = [
  { sectionKey: "categories", sortOrder: 10, visible: true },
  { sectionKey: "featured_products", sortOrder: 20, visible: true },
  { sectionKey: "collections", sortOrder: 30, visible: true },
  { sectionKey: "age_groups", sortOrder: 40, visible: true },
  { sectionKey: "partners", sortOrder: 50, visible: true },
  { sectionKey: "experience", sortOrder: 60, visible: true },
];

function layoutCopy(locale: string) {
  if (locale === "ar") {
    return {
      title: "ترتيب الصفحة الرئيسية",
      subtitle: "رتب الأقسام أو اخفِ أي جزء. الهيرو وشريط الثقة يفضلوا في البداية دائمًا.",
      save: "حفظ ترتيب الرئيسية",
      saved: "تم حفظ ترتيب الصفحة",
      sections: {
        categories: "دواير الأقسام",
        featured_products: "المنتجات الرائجة",
        collections: "قصة الكوليكشنز",
        age_groups: "اختيار حسب العمر",
        partners: "الشركاء",
        experience: "رحلة الشراء والثقة",
      },
    };
  }

  return {
    title: "Homepage order",
    subtitle: "Reorder or hide sections. The hero and trust ribbon always stay first.",
    save: "Save homepage order",
    saved: "Homepage order saved",
    sections: {
      categories: "Category circles",
      featured_products: "Trending products",
      collections: "Collection story",
      age_groups: "Shop by age",
      partners: "Partners",
      experience: "Buying journey and trust",
    },
  };
}

export function HomepageClient({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin");
  const copy = layoutCopy(locale);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const editableSections = useMemo(
    () => [
      { key: "announcement", label: t("announcementBar"), fields: ["textEn", "textAr", "textDe"] },
      {
        key: "hero",
        label: t("heroSection"),
        fields: [
          "titleEn",
          "titleAr",
          "titleDe",
          "subtitleEn",
          "subtitleAr",
          "subtitleDe",
          "ctaEn",
          "ctaAr",
          "ctaDe",
          "image",
          "mobileImage",
        ],
      },
      { key: "trust", label: t("trustSection"), fields: ["titleEn", "titleAr", "titleDe", "contentEn", "contentAr", "contentDe"] },
      { key: "delivery_note", label: t("deliveryNote"), fields: ["textEn", "textAr", "textDe"] },
      { key: "footer_about", label: t("footerAbout"), fields: ["textEn", "textAr", "textDe"] },
    ],
    [t],
  );

  const sectionMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const section of sections) {
      try {
        map[section.sectionKey] = JSON.parse(section.data) as Record<string, string>;
      } catch {
        map[section.sectionKey] = {};
      }
    }
    return map;
  }, [sections]);

  const [forms, setForms] = useState<Record<string, Record<string, string>>>(() =>
    editableSections.reduce((result, section) => {
      result[section.key] = section.fields.reduce((fields, field) => {
        fields[field] = sectionMap[section.key]?.[field] || "";
        return fields;
      }, {} as Record<string, string>);
      return result;
    }, {} as Record<string, Record<string, string>>),
  );

  const [layout, setLayout] = useState<LayoutItem[]>(() => {
    const stored = new Map(sections.map((section) => [section.sectionKey, section]));
    return DEFAULT_LAYOUT.map((fallback) => {
      const section = stored.get(fallback.sectionKey);
      return section
        ? {
            sectionKey: fallback.sectionKey,
            sortOrder: section.sortOrder,
            visible: section.visible,
          }
        : fallback;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  });

  function updateField(sectionKey: string, field: string, value: string) {
    setForms((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [field]: value,
      },
    }));
  }

  async function saveSection(sectionKey: string) {
    setSaving(sectionKey);
    setMessage("");
    try {
      await updateHomepageSectionAction(sectionKey, forms[sectionKey]);
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= layout.length) return;

    setLayout((current) => {
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered.map((item, itemIndex) => ({
        ...item,
        sortOrder: (itemIndex + 1) * 10,
      }));
    });
  }

  async function saveLayout() {
    setSaving("layout");
    setMessage("");
    try {
      await updateHomepageLayoutAction(layout);
      setMessage(copy.saved);
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  function getLabel(field: string) {
    if (field === "image") return locale === "ar" ? "صورة الهيرو للابتوب" : "Hero desktop image";
    if (field === "mobileImage") return locale === "ar" ? "صورة الهيرو للموبايل" : "Hero mobile image";
    if (field.endsWith("En")) return field.replace("En", " (EN)");
    if (field.endsWith("Ar")) return field.replace("Ar", " (AR)");
    if (field.endsWith("De")) return field.replace("De", " (DE)");
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  function isTextarea(field: string) {
    return field.startsWith("subtitle") || field.startsWith("content") || field.startsWith("text");
  }

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Home className="h-6 w-6" /> {t("homepageEditor")}
      </h1>

      <section className="rounded-3xl border bg-slate-50/70 p-4 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">{copy.title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
          </div>
          <Button onClick={saveLayout} disabled={saving === "layout"}>
            {saving === "layout" ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Save className="me-2 h-4 w-4" />}
            {copy.save}
          </Button>
        </div>

        <div className="space-y-2">
          {layout.map((item, index) => (
            <div key={item.sectionKey} className="flex items-center gap-2 rounded-2xl border bg-white p-3 shadow-sm">
              <GripVertical className="h-5 w-5 shrink-0 text-slate-300" />
              <span className="flex-1 text-sm font-black text-slate-800">{copy.sections[item.sectionKey]}</span>
              <span className="hidden text-[10px] font-bold text-slate-400 sm:block">#{index + 1}</span>
              <Switch
                checked={item.visible}
                onCheckedChange={(visible) =>
                  setLayout((current) => current.map((entry) => entry.sectionKey === item.sectionKey ? { ...entry, visible } : entry))
                }
              />
              {item.visible ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
              <Button type="button" size="icon" variant="ghost" className="h-9 w-9" disabled={index === 0} onClick={() => moveSection(index, -1)} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="h-9 w-9" disabled={index === layout.length - 1} onClick={() => moveSection(index, 1)} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {message && <p className="mt-4 text-sm font-bold text-emerald-600">{message}</p>}
      </section>

      <div className="space-y-6">
        {editableSections.map((section) => (
          <section key={section.key} className="rounded-3xl border bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">{section.label}</h2>
              <Button size="sm" onClick={() => saveSection(section.key)} disabled={saving === section.key}>
                {saving === section.key ? <Loader2 className="me-1 h-3.5 w-3.5 animate-spin" /> : <Save className="me-1 h-3.5 w-3.5" />}
                {t("save")}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {section.fields.map((field) => {
                const value = forms[section.key]?.[field] || "";
                return (
                  <div key={field} className={field === "image" || field === "mobileImage" ? "md:col-span-3" : undefined}>
                    <Label className="text-xs">{getLabel(field)}</Label>
                    {field === "image" || field === "mobileImage" ? (
                      <div className="mt-2 space-y-3 rounded-2xl border bg-slate-50 p-3">
                        <Input value={value} onChange={(event) => updateField(section.key, field, event.target.value)} dir="ltr" placeholder="/images/hero.webp or https://..." />
                        <ImageUploader value={value ? [value] : []} onChange={(urls) => updateField(section.key, field, urls[0] || "")} multiple={false} folder="kidorly/homepage" />
                      </div>
                    ) : isTextarea(field) ? (
                      <Textarea value={value} onChange={(event) => updateField(section.key, field, event.target.value)} className="mt-1 text-sm" rows={3} dir={field.endsWith("Ar") ? "rtl" : "ltr"} />
                    ) : (
                      <Input value={value} onChange={(event) => updateField(section.key, field, event.target.value)} className="mt-1 text-sm" dir={field.endsWith("Ar") ? "rtl" : "ltr"} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
