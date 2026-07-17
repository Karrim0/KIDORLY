export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { CatalogManager } from "./catalog-manager";

export default async function CatalogManagementPage() {
  const [collections, ageGroups] = await Promise.all([
    prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.ageGroup.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { minAgeMonths: "asc" }],
    }),
  ]);

  return <CatalogManager collections={collections} ageGroups={ageGroups} />;
}
