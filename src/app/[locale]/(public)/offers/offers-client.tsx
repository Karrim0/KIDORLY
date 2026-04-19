"use client";

import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/public/product-card";
import { Sparkles } from "lucide-react";
import type { ProductWithCategory } from "@/types";

export function OffersClient({ products }: { products: ProductWithCategory[] }) {
  const t = useTranslations("offers");

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">{t("noOffers")}</h3>
          <p className="text-muted-foreground">{t("noOffersSubtitle")}</p>
        </div>
      )}
    </div>
  );
}
