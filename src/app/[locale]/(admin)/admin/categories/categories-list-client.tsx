"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteCategory } from "@/actions/products";
import type { CategoryFull } from "@/types";

export function CategoriesListClient({ categories }: { categories: CategoryFull[] }) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteId) return;
    await deleteCategory(deleteId);
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("categories")}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/categories/new`}><Plus className="h-4 w-4 me-2" />{t("addCategory")}</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t("noCategories")}</p>
            <Button className="mt-4" asChild>
              <Link href={`/${locale}/admin/categories/new`}>{t("createFirstCategory")}</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("category")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("slug")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("products")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("discount")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {cat.image && (
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <Image src={cat.image} alt="" fill className="object-cover" sizes="40px" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{cat.nameAr || cat.nameEn}</p>
                          <p className="text-xs text-muted-foreground">{cat.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                    <td className="p-3"><Badge variant="outline">{cat._count?.products ?? 0}</Badge></td>
                    <td className="p-3">{cat.discountPercentage ? <Badge variant="coral">-{cat.discountPercentage}%</Badge> : "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/${locale}/admin/categories/${cat.id}`}><Edit className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(cat.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCategory")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteCategory")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t("cancel")}</Button>
            <Button variant="destructive" onClick={handleDelete}>{t("deleteProduct")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
