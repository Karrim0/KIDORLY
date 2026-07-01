export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const [category, parentCategories, t] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
    }),

    prisma.category.findMany({
      where: {
        NOT: {
          id,
        },
      },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        nameDe: true,
        parentId: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    }),

    getTranslations({ locale, namespace: "admin" }),
  ]);

  if (!category) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("editCategory")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update category details, media, visibility, sorting, and SEO settings.
        </p>
      </div>

      <CategoryForm
        category={category as any}
        parentCategories={parentCategories}
      />
    </div>
  );
}