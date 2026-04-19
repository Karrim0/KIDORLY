export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params: { id, locale } }: { params: { id: string; locale: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);
  if (!product) notFound();
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("editProduct")}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
