"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice, getTranslated, getEffectiveDiscount, getDiscountedPrice } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  globalDiscount?: number;
}

export function ProductCard({ product, globalDiscount = 0 }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { addItem, addItemAndPersist } = useCart();

  const name = getTranslated(product, "name", locale);
  const shortDesc = getTranslated(product, "shortDesc", locale);
  const discount = getEffectiveDiscount(
    product.discountPercentage,
    product.category?.discountPercentage,
    globalDiscount
  );
  const finalPrice = discount > 0 ? getDiscountedPrice(product.price, discount) : product.price;
  const mainImage = product.images[0] || "/placeholder.svg";
  const isAvailable = product.availability === "AVAILABLE";

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name,
    price: product.price,
    finalPrice,
    image: mainImage,
    quantity: 1,
  };

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    addItem(cartItem);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    // 1. Write to localStorage synchronously (backup for hard refresh)
    addItemAndPersist(cartItem);
  

    // 2. Also add to React state so it's available immediately
    

  router.push(`/${locale}/checkout`);

    // 3. Use Next.js router — client-side navigation keeps React state alive
    //    This is the key fix: router.push does NOT reload the page,
    //    so CartProvider stays mounted and items persist in memory
    router.push(`/${locale}/checkout`);
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]">

      {/* ── Product Image ─────────────────────────── */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative aspect-square bg-gray-50 overflow-hidden block"
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <Badge className="bg-brand-coral text-white border-0 text-[11px] font-bold px-2 py-0.5 shadow-md">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="secondary" className="shadow-md text-[11px]">
              {t("common.featured")}
            </Badge>
          )}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Badge variant="outline" className="text-sm px-3 py-1 bg-white/80">
              {t("common.outOfStock")}
            </Badge>
          </div>
        )}
      </Link>

      {/* ── Product Info ────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 md:p-4">

        {product.category && (
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
            {getTranslated(product.category, "name", locale)}
          </p>
        )}

        <Link href={`/${locale}/product/${product.slug}`} className="block mb-1">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
        </Link>

        {shortDesc && (
          <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block mb-1">
            {shortDesc}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className={cn(
            "font-bold text-sm md:text-base",
            discount > 0 ? "text-brand-coral" : "text-foreground"
          )}>
            {formatPrice(finalPrice, locale)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>

        {/* ── Action Buttons — always visible ─────── */}
        {isAvailable && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 text-xs md:text-sm h-9 md:h-10 btn-glow press-effect"
              onClick={handleBuyNow}
            >
              <Zap className="h-3.5 w-3.5 me-1.5" />
              {t("product.buyNow")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 md:h-10 w-9 md:w-10 p-0 shrink-0 press-effect"
              onClick={handleAddToCart}
              title={t("product.addToCart")}
            >
              <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        )}

        {!isAvailable && (
          <Button size="sm" variant="outline" className="w-full h-9 md:h-10 text-xs md:text-sm" disabled>
            {t("common.outOfStock")}
          </Button>
        )}
      </div>
    </div>
  );
}