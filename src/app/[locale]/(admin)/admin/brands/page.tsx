import prisma from "@/lib/prisma";
import { BrandsListClient } from "./brands-list-client";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { products: true } } },
  });

  return <BrandsListClient brands={brands as any} />;
}   