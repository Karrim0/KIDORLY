export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { ProductsListClient } from "./products-list-client";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return <ProductsListClient products={products} />;
}
