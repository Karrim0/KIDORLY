export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { CategoriesListClient } from "./categories-list-client";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameDe: true,
        },
      },
      children: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return <CategoriesListClient categories={categories} />;
}