"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  cn,
  formatPrice,
  getTranslated,
  getEffectiveDiscount,
  getDiscountedPrice,
} from "@/lib/utils";
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
  const { has, toggle } = useWishlist();

  const name = getTranslated(product, "name", locale);
  const shortDesc = getTranslated(product, "shortDesc", locale);

  const discount = getEffectiveDiscount(
    product.discountPercentage,
    product.category?.discountPercentage,
    globalDiscount,
  );

  const finalPrice =
    discount > 0 ? getDiscountedPrice(product.price, discount) : product.price;

  const mainImage = product.images?.[0] || "/placeholder.svg";
  const isAvailable = product.availability === "AVAILABLE";
  const inWishlist = has(product.id);

  const brandName = product.brand
    ? getTranslated(product.brand, "name", locale)
    : "";

  const categoryName = product.category
    ? getTranslated(product.category, "name", locale)
    : "";

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

    /*
      مهم:
      مش بنستخدم addItem هنا عشان غالبًا هو اللي بيفتح الكارت.
      بنستخدم persist بس، وبعدها نروح checkout مباشرة.
    */
    addItemAndPersist(cartItem);
    router.push(`/${locale}/checkout`);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    toggle(product.id);
  }

  return (
    <article
      className={cn(
  "group relative flex h-full min-w-0 flex-col overflow-hidden bg-white",
  "rounded-2xl sm:rounded-3xl",
  "border border-gray-200/80 md:border-gray-100",
  "shadow-[0_12px_34px_rgba(15,23,42,0.12)] md:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
  "ring-1 ring-black/[0.03] md:ring-0",
  "transition-all duration-300 ease-out",
  "md:hover:-translate-y-1 md:hover:border-brand-coral/20 md:hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]",
  "active:scale-[0.99]",
)}
    >
      {/* Image */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className={cn(
          "relative block overflow-hidden bg-gray-50",
          "aspect-[1/1.08] sm:aspect-square",
        )}
        aria-label={name}
      >
        <Image
          src={mainImage}
          alt={name}
          fill
          className={cn(
            "object-cover",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-105",
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex max-w-[72%] flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {discount > 0 && (
            <Badge className="border-0 bg-brand-coral px-1.5 py-0.5 text-[9px] font-bold leading-none text-white shadow-md sm:px-2 sm:text-[11px]">
              -{discount}%
            </Badge>
          )}

          {product.featured && (
            <Badge
              variant="secondary"
              className=" bg-[#4ACFC1] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white shadow-md backdrop-blur-sm sm:px-2 sm:text-[11px]"
            >
              {t("common.featured")}
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            inWishlist
              ? t("wishlist.removeFromWishlist")
              : t("wishlist.addToWishlist")
          }
          className={cn(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full",
            "bg-white/95 text-gray-600 shadow-md backdrop-blur-sm",
            "transition-all duration-200 hover:scale-110 hover:text-brand-coral active:scale-95",
            "sm:right-3 sm:top-3 sm:h-9 sm:w-9 ",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              inWishlist && "fill-brand-coral text-brand-coral",
            )}
          />
        </button>

        {!isAvailable && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
            <Badge
              variant="outline"
              className="border-gray-200 bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm"
            >
              {t("common.outOfStock")}
            </Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {/* Brand + Category */}
        {(brandName || categoryName) && (
          <div className="mb-1 flex min-h-[16px] items-center gap-1 overflow-hidden sm:mb-1.5 sm:gap-1.5">
            {product.brand && brandName && (
              <Link
                href={`/${locale}/brand/${product.brand.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate text-[9px] font-bold uppercase tracking-wide text-brand-coral hover:underline sm:text-[11px]"
              >
                {brandName}
              </Link>
            )}

            {brandName && categoryName && (
              <span className="shrink-0 text-[9px] text-muted-foreground sm:text-[10px]">
                •
              </span>
            )}

            {categoryName && (
              <span className="truncate text-[9px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                {categoryName}
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <Link href={`/${locale}/product/${product.slug}`} className="block">
          <h3
            className={cn(
              "line-clamp-2 min-h-[34px] text-[12px] font-bold leading-snug text-gray-900",
              "transition-colors duration-200 group-hover:text-primary",
              "sm:min-h-[42px] sm:text-sm md:text-[15px]",
            )}
          >
            {name}
          </h3>
        </Link>

        {shortDesc && (
          <p className="mt-1 hidden min-h-[18px] text-xs leading-relaxed text-muted-foreground line-clamp-1 md:block">
            {shortDesc}
          </p>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="mt-2 flex min-h-[24px] flex-wrap items-baseline gap-x-1.5 gap-y-1 sm:mt-3 sm:gap-x-2">
          <span
            className={cn(
              "text-[13px] font-extrabold leading-none sm:text-base",
              discount > 0 ? "text-brand-coral" : "text-foreground",
            )}
          >
            {formatPrice(finalPrice, locale)}
          </span>

          {discount > 0 && (
            <span className="text-[10px] font-medium leading-none text-muted-foreground line-through sm:text-xs">
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2.5 sm:mt-3">
          {isAvailable ? (
            <div className="grid grid-cols-[1fr_40px] gap-2 sm:grid-cols-[1fr_44px]">
              <Button
                size="sm"
                className={cn(
                  "h-9 rounded-xl px-2 text-[11px] font-extrabold leading-none sm:h-10 sm:text-sm",
                  "bg-brand-coral text-white hover:bg-brand-coral/90",
                  "shadow-md shadow-brand-coral/20 hover:shadow-lg hover:shadow-brand-coral/30",
                  "press-effect",
                )}
                onClick={handleBuyNow}
              >
                <Zap className="mr-1 h-3.5 w-3.5 shrink-0 sm:mr-1.5" />
                <span className="truncate">{t("product.buyNow")}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-9 w-10 rounded-xl p-0 sm:h-10 sm:w-11",
                  "border-gray-200 bg-white text-gray-700",
                  "hover:border-brand-coral/40 hover:bg-brand-coral/5 hover:text-brand-coral",
                  "press-effect",
                )}
                onClick={handleAddToCart}
                title={t("product.addToCart")}
                aria-label={t("product.addToCart")}
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-full rounded-xl text-xs font-bold sm:h-10 sm:text-sm"
              disabled
            >
              {t("common.outOfStock")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
