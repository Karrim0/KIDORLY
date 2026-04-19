export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage({ params: { locale } }: { params: { locale: string } }) {
  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  const t = await getTranslations({ locale, namespace: "admin" });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("newProduct")}</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
