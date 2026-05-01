import prisma from "@/lib/prisma";
import { BrandsClient } from "./brands-client";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ featured: "desc" }, { nameEn: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return <BrandsClient brands={brands as any} />;
}