export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { CategoriesListClient } from "./categories-list-client";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
  parent: true,
  children: true,
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