"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ProductWithCategory } from "@/types";

interface WishlistClientProps {
  allProducts: ProductWithCategory[];
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { items, isHydrated, clear, count } = useWishlist();

  const wishlistProducts = allProducts.filter((p) => items.includes(p.id));

  if (!isHydrated) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Heart className="h-7 w-7 md:h-8 md:w-8 text-brand-coral fill-brand-coral" />
            {t("wishlist.title")}
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {count > 0 ? t("wishlist.itemCount", { count }) : t("wishlist.empty")}
          </p>
        </div>

        {count > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm(t("wishlist.confirmClear"))) clear();
            }}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 me-2" />
            {t("wishlist.clearAll")}
          </Button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/60 rounded-3xl">
          <Heart className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">{t("wishlist.emptyTitle")}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("wishlist.emptyDesc")}
          </p>
          <Button size="lg" asChild>
            <Link href={`/${locale}/shop`}>
              <ShoppingBag className="h-4 w-4 me-2" />
              {t("wishlist.startShopping")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}