import prisma from "@/lib/prisma";
import { CategoriesListClient } from "./categories-list-client";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return <CategoriesListClient categories={categories} />;
}
