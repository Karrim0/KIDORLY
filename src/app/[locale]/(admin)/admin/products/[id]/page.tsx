export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const [product, categories, brands, collections, tags, ageGroups, t] =
    await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          collections: {
            include: {
              collection: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          ageGroups: {
            include: {
              ageGroup: true,
            },
          },
        },
      }),

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

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("editProduct")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update product details, classification, pricing, media, and SEO.
        </p>
      </div>

      <ProductForm
        product={product as any}
        categories={categories}
        brands={brands}
        collections={collections}
        tags={tags}
        ageGroups={ageGroups}
      />
    </div>
  );
}