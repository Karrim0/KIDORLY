export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { DiscountsClient } from "./discounts-client";

export default async function AdminDiscountsPage() {
  const globalDiscount = await getSetting(SETTING_KEYS.GLOBAL_DISCOUNT);
  const categories = await prisma.category.findMany({
    select: { id: true, nameEn: true, nameAr: true, slug: true, discountPercentage: true },
    orderBy: { nameEn: "asc" },
  });
  const productsWithDiscount = await prisma.product.findMany({
    where: { discountPercentage: { gt: 0 } },
    select: { id: true, nameEn: true, nameAr: true, slug: true, discountPercentage: true },
    orderBy: { nameEn: "asc" },
  });

  return (
    <DiscountsClient
      globalDiscount={globalDiscount || "0"}
      categories={categories}
      productsWithDiscount={productsWithDiscount}
    />
  );
}
