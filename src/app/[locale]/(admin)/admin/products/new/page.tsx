export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [categories, brands, collections, tags, ageGroups, t] =
    await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.brand.findMany({
        orderBy: { nameEn: "asc" },
      }),

      prisma.collection.findMany({
        orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.tag.findMany({
        orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      }),

      prisma.ageGroup.findMany({
        orderBy: [{ sortOrder: "asc" }, { minAgeMonths: "asc" }],
      }),

      getTranslations({ locale, namespace: "admin" }),
    ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("newProduct")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a product with category, brand, collections, tags, age groups,
          pricing, media, and SEO.
        </p>
      </div>

      <ProductForm
        categories={categories}
        brands={brands}
        collections={collections}
        tags={tags}
        ageGroups={ageGroups}
      />
    </div>
  );
}