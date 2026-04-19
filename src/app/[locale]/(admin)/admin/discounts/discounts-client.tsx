"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateSetting } from "@/actions/settings";
import { SETTING_KEYS } from "@/lib/settings";
import { Save, Loader2, Info } from "lucide-react";

interface Props {
  globalDiscount: string;
  categories: { id: string; nameEn: string; nameAr: string; slug: string; discountPercentage: number | null }[];
  productsWithDiscount: { id: string; nameEn: string; nameAr: string; slug: string; discountPercentage: number | null }[];
}

export function DiscountsClient({ globalDiscount, categories, productsWithDiscount }: Props) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [global, setGlobal] = useState(globalDiscount);
  const [saving, setSaving] = useState(false);

  async function saveGlobal() {
    setSaving(true);
    await updateSetting(SETTING_KEYS.GLOBAL_DISCOUNT, global);
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("discountManagement")}</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">{t("discountPriority")}</p>
          <p>{t("discountPriorityDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">{t("globalDiscount")}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t("globalDiscountDesc")}</p>
        <div className="flex items-end gap-3">
          <div>
            <Label>{t("discountPercentage")}</Label>
            <Input type="number" value={global} onChange={(e) => setGlobal(e.target.value)} className="mt-1.5 w-[200px]" min="0" max="100" placeholder="0" />
          </div>
          <Button onClick={saveGlobal} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
            {t("save")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">{t("categoryDiscounts")}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t("categoryDiscountsDesc")}</p>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noCategories")}</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{cat.nameAr || cat.nameEn}</span>
                {cat.discountPercentage ? <Badge variant="coral">-{cat.discountPercentage}%</Badge> : <span className="text-sm text-muted-foreground">{t("noDiscount")}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-lg mb-4">{t("productsWithDiscounts")}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t("productsWithDiscountsDesc")}</p>
        {productsWithDiscount.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noProductsWithDiscount")}</p>
        ) : (
          <div className="space-y-2">
            {productsWithDiscount.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{p.nameAr || p.nameEn}</span>
                <Badge variant="coral">-{p.discountPercentage}%</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
