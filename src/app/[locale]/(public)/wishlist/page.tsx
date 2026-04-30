import prisma from "@/lib/prisma";
import { WishlistClient } from "./wishlist-client";

export default async function WishlistPage() {
  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return <WishlistClient allProducts={products as any} />;
}
