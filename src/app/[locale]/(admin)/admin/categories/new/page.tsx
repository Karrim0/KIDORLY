export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, parentCategories] = await Promise.all([
    getTranslations({ locale, namespace: "admin" }),
    prisma.category.findMany({
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
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("newCategory")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a professional category with media, visibility, SEO, and homepage settings.
        </p>
      </div>

      <CategoryForm parentCategories={parentCategories} />
    </div>
  );
}
