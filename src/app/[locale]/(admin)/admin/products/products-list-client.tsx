"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteProduct } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

export function ProductsListClient({ products }: { products: ProductWithCategory[] }) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("products")}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/products/new`}><Plus className="h-4 w-4 me-2" />{t("addProduct")}</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t("noProducts")}</p>
            <Button className="mt-4" asChild>
              <Link href={`/${locale}/admin/products/new`}>{t("createFirst")}</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("product")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("category")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("price")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("discount")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("availability")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("featured")}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.nameAr || product.nameEn}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{product.category?.nameAr || product.category?.nameEn || "—"}</td>
                    <td className="p-3 font-semibold">{formatPrice(product.price)}</td>
                    <td className="p-3">
                      {product.discountPercentage ? <Badge variant="coral">-{product.discountPercentage}%</Badge> : "—"}
                    </td>
                    <td className="p-3">
                      <Badge variant={product.availability === "AVAILABLE" ? "success" : "warning"}>
                        {product.availability === "AVAILABLE" ? t("available") : t("unavailable")}
                      </Badge>
                    </td>
                    <td className="p-3">{product.featured ? <Badge variant="secondary">{t("featured")}</Badge> : "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/${locale}/admin/products/${product.id}`}><Edit className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(product.id)}>
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
            <DialogTitle>{t("deleteProduct")}</DialogTitle>
            <DialogDescription>{t("confirmDelete")}</DialogDescription>
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
