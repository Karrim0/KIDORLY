export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({ params: { id, locale } }: { params: { id: string; locale: string } }) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("editCategory")}</h1>
      <CategoryForm category={category as any} />
    </div>
  );
}
