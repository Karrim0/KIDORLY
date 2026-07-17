"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Baby,
  Edit3,
  ImageIcon,
  Layers3,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  deleteAgeGroup,
  deleteCollection,
  saveAgeGroup,
  saveCollection,
} from "@/actions/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

type CollectionItem = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  image: string | null;
  banner: string | null;
  type: "MARKETING" | "SEASONAL" | "SYSTEM";
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  _count: { products: number };
};

type AgeGroupItem = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  _count: { products: number };
};

type CollectionForm = Omit<CollectionItem, "_count" | "sortOrder"> & {
  sortOrder: string;
};

type AgeGroupForm = Omit<
  AgeGroupItem,
  "_count" | "sortOrder" | "minAgeMonths" | "maxAgeMonths"
> & {
  sortOrder: string;
  minAgeMonths: string;
  maxAgeMonths: string;
};

const emptyCollection: CollectionForm = {
  id: "",
  slug: "",
  nameAr: "",
  nameEn: "",
  nameDe: "",
  descriptionAr: "",
  descriptionEn: "",
  descriptionDe: "",
  image: "",
  banner: "",
  type: "MARKETING",
  visible: true,
  featured: true,
  sortOrder: "0",
};

const emptyAgeGroup: AgeGroupForm = {
  id: "",
  slug: "",
  nameAr: "",
  nameEn: "",
  nameDe: "",
  minAgeMonths: "",
  maxAgeMonths: "",
  visible: true,
  featured: true,
  sortOrder: "0",
};

function adminCopy(locale: string) {
  if (locale === "ar") {
    return {
      eyebrow: "إدارة تجربة التسوق",
      title: "الكولكشنز والفئات العمرية",
      subtitle: "حدد اللي يظهر في الرئيسية والفلاتر، رتبه، واربطه بالمنتجات من صفحة المنتج.",
      collections: "الكولكشنز",
      collectionsHint: "الكولكشن المميز والظاهر بيتعرض تلقائيًا في الرئيسية والمتجر.",
      ages: "الفئات العمرية",
      agesHint: "استخدم المدى بالشهور عشان الفلترة تبقى دقيقة وواضحة.",
      addCollection: "إضافة كولكشن",
      addAge: "إضافة عمر",
      editCollection: "تعديل الكولكشن",
      editAge: "تعديل الفئة العمرية",
      save: "حفظ",
      deleteConfirm: "متأكد إنك عايز تحذف العنصر؟ الربط بالمنتجات هيتشال.",
      visible: "ظاهر",
      featured: "مميز في الرئيسية",
      products: "منتج",
      order: "الترتيب",
      image: "صورة الكارت",
      banner: "صورة عريضة",
      slug: "الرابط المختصر",
      minAge: "أقل عمر بالشهور",
      maxAge: "أكبر عمر بالشهور",
      edit: "تعديل",
      months: "شهر",
      generateSlug: "إنشاء الرابط تلقائيًا",
      noItems: "مفيش عناصر لسه. ابدأ بإضافة أول عنصر.",
      error: "حصل خطأ. راجع البيانات وحاول تاني.",
    };
  }

  return {
    eyebrow: "Shopping experience",
    title: "Collections and age groups",
    subtitle: "Control what appears on the home page and filters, its order, and product assignments.",
    collections: "Collections",
    collectionsHint: "Visible featured collections appear automatically on the storefront.",
    ages: "Age groups",
    agesHint: "Use month ranges for accurate, clear filtering.",
    addCollection: "Add collection",
    addAge: "Add age group",
    editCollection: "Edit collection",
    editAge: "Edit age group",
    save: "Save",
    deleteConfirm: "Delete this item? Its product assignments will also be removed.",
    visible: "Visible",
    featured: "Featured on home",
    products: "products",
    order: "Sort order",
    image: "Card image",
    banner: "Wide banner",
    slug: "Slug",
    minAge: "Minimum age in months",
    maxAge: "Maximum age in months",
    edit: "Edit",
    months: "months",
    generateSlug: "Generate slug",
    noItems: "No items yet. Add the first one to get started.",
    error: "Something went wrong. Review the data and try again.",
  };
}

export function CatalogManager({
  collections,
  ageGroups,
}: {
  collections: CollectionItem[];
  ageGroups: AgeGroupItem[];
}) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const router = useRouter();
  const [collectionForm, setCollectionForm] = useState<CollectionForm>(emptyCollection);
  const [ageForm, setAgeForm] = useState<AgeGroupForm>(emptyAgeGroup);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function editCollection(item?: CollectionItem) {
    setError("");
    setCollectionForm(
      item
        ? {
            ...item,
            descriptionAr: item.descriptionAr || "",
            descriptionEn: item.descriptionEn || "",
            descriptionDe: item.descriptionDe || "",
            image: item.image || "",
            banner: item.banner || "",
            sortOrder: String(item.sortOrder),
          }
        : { ...emptyCollection },
    );
    setCollectionOpen(true);
  }

  function editAge(item?: AgeGroupItem) {
    setError("");
    setAgeForm(
      item
        ? {
            ...item,
            minAgeMonths: item.minAgeMonths == null ? "" : String(item.minAgeMonths),
            maxAgeMonths: item.maxAgeMonths == null ? "" : String(item.maxAgeMonths),
            sortOrder: String(item.sortOrder),
          }
        : { ...emptyAgeGroup },
    );
    setAgeOpen(true);
  }

  async function submitCollection() {
    setSaving(true);
    setError("");
    try {
      await saveCollection(collectionForm.id || null, {
        ...collectionForm,
        sortOrder: Number(collectionForm.sortOrder) || 0,
      });
      setCollectionOpen(false);
      router.refresh();
    } catch (cause) {
      console.error(cause);
      setError(copy.error);
    } finally {
      setSaving(false);
    }
  }

  async function submitAge() {
    setSaving(true);
    setError("");
    try {
      await saveAgeGroup(ageForm.id || null, {
        ...ageForm,
        minAgeMonths: ageForm.minAgeMonths === "" ? null : Number(ageForm.minAgeMonths),
        maxAgeMonths: ageForm.maxAgeMonths === "" ? null : Number(ageForm.maxAgeMonths),
        sortOrder: Number(ageForm.sortOrder) || 0,
      });
      setAgeOpen(false);
      router.refresh();
    } catch (cause) {
      console.error(cause);
      setError(copy.error);
    } finally {
      setSaving(false);
    }
  }

  async function remove(kind: "collection" | "age", id: string) {
    if (!window.confirm(copy.deleteConfirm)) return;
    setSaving(true);
    setError("");
    try {
      if (kind === "collection") await deleteCollection(id);
      else await deleteAgeGroup(id);
      router.refresh();
    } catch (cause) {
      console.error(cause);
      setError(copy.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[.16em] text-brand-coral">{copy.eyebrow}</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{copy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{copy.subtitle}</p>
      </div>

      <CatalogSection
        title={copy.collections}
        description={copy.collectionsHint}
        icon={Layers3}
        actionLabel={copy.addCollection}
        onAdd={() => editCollection()}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="relative h-36 bg-gradient-to-br from-brand-coral/15 to-brand-sky/20">
                {item.image || item.banner ? (
                  <Image src={item.image || item.banner || ""} alt={item.nameEn} fill className="object-cover" sizes="400px" />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-slate-300" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <h3 className="absolute bottom-3 start-4 text-lg font-black text-white">
                  {locale === "ar" ? item.nameAr : locale === "de" ? item.nameDe : item.nameEn}
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  {item.visible && <Badge variant="success">{copy.visible}</Badge>}
                  {item.featured && <Badge className="bg-brand-coral">{copy.featured}</Badge>}
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">{item._count.products} {copy.products} · {copy.order}: {item.sortOrder}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => editCollection(item)}><Edit3 className="me-1 h-3.5 w-3.5" />{copy.edit}</Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-red-600" onClick={() => remove("collection", item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </article>
          ))}
          {collections.length === 0 && <EmptyState copy={copy.noItems} />}
        </div>
      </CatalogSection>

      <CatalogSection
        title={copy.ages}
        description={copy.agesHint}
        icon={Baby}
        actionLabel={copy.addAge}
        onAdd={() => editAge()}
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {ageGroups.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sky/12 text-brand-ocean"><Baby className="h-5 w-5" /></span>
                {item.featured && <Sparkles className="h-4 w-4 text-brand-coral" />}
              </div>
              <h3 className="mt-4 font-black text-slate-950">{locale === "ar" ? item.nameAr : locale === "de" ? item.nameDe : item.nameEn}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.minAgeMonths ?? "—"}–{item.maxAgeMonths ?? "—"} {copy.months}</p>
              <p className="mt-2 text-[11px] text-slate-400">{item._count.products} {copy.products} · #{item.sortOrder}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => editAge(item)}><Edit3 className="me-1 h-3.5 w-3.5" />{copy.edit}</Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 text-red-600" onClick={() => remove("age", item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </article>
          ))}
          {ageGroups.length === 0 && <EmptyState copy={copy.noItems} />}
        </div>
      </CatalogSection>

      <Dialog open={collectionOpen} onOpenChange={setCollectionOpen}>
        <DialogContent className="max-h-[90svh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{collectionForm.id ? copy.editCollection : copy.addCollection}</DialogTitle>
            <DialogDescription>{copy.collectionsHint}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["En", "Ar", "De"] as const).map((suffix) => (
              <div key={suffix}>
                <Label>Name {suffix}</Label>
                <Input value={collectionForm[`name${suffix}`]} dir={suffix === "Ar" ? "rtl" : "ltr"} onChange={(event) => setCollectionForm((current) => ({ ...current, [`name${suffix}`]: event.target.value }))} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_170px_120px]">
            <div><Label>{copy.slug}</Label><Input value={collectionForm.slug} onChange={(event) => setCollectionForm((current) => ({ ...current, slug: event.target.value }))} /></div>
            <div><Label>Type</Label><Select value={collectionForm.type} onValueChange={(type: CollectionForm["type"]) => setCollectionForm((current) => ({ ...current, type }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MARKETING">MARKETING</SelectItem><SelectItem value="SEASONAL">SEASONAL</SelectItem><SelectItem value="SYSTEM">SYSTEM</SelectItem></SelectContent></Select></div>
            <div><Label>{copy.order}</Label><Input type="number" min="0" value={collectionForm.sortOrder} onChange={(event) => setCollectionForm((current) => ({ ...current, sortOrder: event.target.value }))} /></div>
          </div>
          <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => setCollectionForm((current) => ({ ...current, slug: slugify(current.nameEn) }))}>{copy.generateSlug}</Button>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["En", "Ar", "De"] as const).map((suffix) => (
              <div key={suffix}><Label>Description {suffix}</Label><Textarea rows={3} value={collectionForm[`description${suffix}`] || ""} dir={suffix === "Ar" ? "rtl" : "ltr"} onChange={(event) => setCollectionForm((current) => ({ ...current, [`description${suffix}`]: event.target.value }))} /></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><Label>{copy.image}</Label><Input value={collectionForm.image || ""} onChange={(event) => setCollectionForm((current) => ({ ...current, image: event.target.value }))} /></div>
            <div><Label>{copy.banner}</Label><Input value={collectionForm.banner || ""} onChange={(event) => setCollectionForm((current) => ({ ...current, banner: event.target.value }))} /></div>
          </div>
          <VisibilityControls visible={collectionForm.visible} featured={collectionForm.featured} copy={copy} setVisible={(visible) => setCollectionForm((current) => ({ ...current, visible }))} setFeatured={(featured) => setCollectionForm((current) => ({ ...current, featured }))} />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <DialogFooter><Button onClick={submitCollection} disabled={saving}>{saving && <Loader2 className="me-2 h-4 w-4 animate-spin" />}{copy.save}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ageOpen} onOpenChange={setAgeOpen}>
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{ageForm.id ? copy.editAge : copy.addAge}</DialogTitle><DialogDescription>{copy.agesHint}</DialogDescription></DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["En", "Ar", "De"] as const).map((suffix) => (
              <div key={suffix}><Label>Name {suffix}</Label><Input value={ageForm[`name${suffix}`]} dir={suffix === "Ar" ? "rtl" : "ltr"} onChange={(event) => setAgeForm((current) => ({ ...current, [`name${suffix}`]: event.target.value }))} /></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><Label>{copy.slug}</Label><Input value={ageForm.slug} onChange={(event) => setAgeForm((current) => ({ ...current, slug: event.target.value }))} /></div>
            <div><Label>{copy.order}</Label><Input type="number" min="0" value={ageForm.sortOrder} onChange={(event) => setAgeForm((current) => ({ ...current, sortOrder: event.target.value }))} /></div>
          </div>
          <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => setAgeForm((current) => ({ ...current, slug: slugify(current.nameEn) }))}>{copy.generateSlug}</Button>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{copy.minAge}</Label><Input type="number" min="0" value={ageForm.minAgeMonths} onChange={(event) => setAgeForm((current) => ({ ...current, minAgeMonths: event.target.value }))} /></div>
            <div><Label>{copy.maxAge}</Label><Input type="number" min="0" value={ageForm.maxAgeMonths} onChange={(event) => setAgeForm((current) => ({ ...current, maxAgeMonths: event.target.value }))} /></div>
          </div>
          <VisibilityControls visible={ageForm.visible} featured={ageForm.featured} copy={copy} setVisible={(visible) => setAgeForm((current) => ({ ...current, visible }))} setFeatured={(featured) => setAgeForm((current) => ({ ...current, featured }))} />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <DialogFooter><Button onClick={submitAge} disabled={saving}>{saving && <Loader2 className="me-2 h-4 w-4 animate-spin" />}{copy.save}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CatalogSection({ title, description, icon: Icon, actionLabel, onAdd, children }: { title: string; description: string; icon: typeof Layers3; actionLabel: string; onAdd: () => void; children: React.ReactNode }) {
  return <section className="rounded-3xl border bg-slate-50/70 p-4 sm:p-6"><div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-coral shadow-sm"><Icon className="h-5 w-5" /></span><div><h2 className="text-xl font-black text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div></div><Button onClick={onAdd}><Plus className="me-1 h-4 w-4" />{actionLabel}</Button></div>{children}</section>;
}

function VisibilityControls({ visible, featured, copy, setVisible, setFeatured }: { visible: boolean; featured: boolean; copy: ReturnType<typeof adminCopy>; setVisible: (value: boolean) => void; setFeatured: (value: boolean) => void }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="flex items-center justify-between rounded-2xl border p-3 text-sm font-bold"><span>{copy.visible}</span><Switch checked={visible} onCheckedChange={setVisible} /></label><label className="flex items-center justify-between rounded-2xl border p-3 text-sm font-bold"><span>{copy.featured}</span><Switch checked={featured} onCheckedChange={setFeatured} /></label></div>;
}

function EmptyState({ copy }: { copy: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed bg-white px-5 py-10 text-center text-sm font-semibold text-slate-400">
      {copy}
    </div>
  );
}
