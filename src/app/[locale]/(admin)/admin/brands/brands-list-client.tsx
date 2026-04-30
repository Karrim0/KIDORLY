"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Star, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BrandFull } from "@/types";

interface Props {
  brands: BrandFull[];
}

export function BrandsListClient({ brands }: Props) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDeleteBrand"))) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("brands")}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/brands/new`}>
            <Plus className="h-4 w-4 me-2" />
            {t("addBrand")}
          </Link>
        </Button>
      </div>

      {brands.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-semibold mb-1">{t("noBrandsYet")}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("createFirstBrand")}
          </p>
          <Button asChild>
            <Link href={`/${locale}/admin/brands/new`}>
              <Plus className="h-4 w-4 me-2" />
              {t("addBrand")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border p-4 flex items-center gap-4"
            >
              <div className="relative h-16 w-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.nameEn}
                    fill
                    className="object-contain p-2"
                    sizes="64px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">
                    {brand.nameAr || brand.nameEn}
                  </h3>
                  {brand.featured && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {brand._count?.products || 0} {t("productsCount")}
                </p>
              </div>

              <div className="flex gap-1.5">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/${locale}/admin/brands/${brand.id}`}>
                    <Edit className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(brand.id)}
                  disabled={deleting === brand.id}
                  className="text-destructive hover:bg-destructive/10"
                >
                  {deleting === brand.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
