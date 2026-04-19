import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { OffersClient } from "./offers-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: "offers" });
  return { title: `${t("title")} — Kidorly` };
}

export default async function OffersPage() {
  // Products with any form of discount
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { discountPercentage: { gt: 0 } },
        { category: { discountPercentage: { gt: 0 } } },
      ],
      availability: "AVAILABLE",
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return <OffersClient products={products} />;
}
