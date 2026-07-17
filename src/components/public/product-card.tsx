"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Check, Heart, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  cn,
  formatPrice,
  getDiscountedPrice,
  getEffectiveDiscount,
  getTranslated,
} from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  globalDiscount?: number;
}

export function ProductCard({
  product,
  globalDiscount = 0,
}: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const [justAdded, setJustAdded] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);
  const addedTimer = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (addedTimer.current) {
        window.clearTimeout(addedTimer.current);
      }
    },
    [],
  );

  const name = getTranslated(product, "name", locale);

  const brandName = product.brand
    ? getTranslated(product.brand, "name", locale)
    : "";

  const categoryName = product.category
    ? getTranslated(product.category, "name", locale)
    : "";

  const discount = getEffectiveDiscount(
    product.discountPercentage,
    product.category?.discountPercentage,
    globalDiscount,
  );

  const finalPrice =
    discount > 0
      ? getDiscountedPrice(product.price, discount)
      : product.price;

  const rawImage = product.images?.[0]?.trim();

  const validImage =
    rawImage &&
    (rawImage.startsWith("/") || /^https?:\/\//i.test(rawImage))
      ? rawImage
      : null;

  const mainImage =
    imageFailed || !validImage ? "/placeholder.svg" : validImage;

  const isAvailable = product.availability === "AVAILABLE";
  const inWishlist = has(product.id);

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name,
    price: product.price,
    finalPrice,
    image: mainImage,
    quantity: 1,
  };

  function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAvailable) return;

    addItem(cartItem);
    setJustAdded(true);

    if (addedTimer.current) {
      window.clearTimeout(addedTimer.current);
    }

    addedTimer.current = window.setTimeout(() => {
      setJustAdded(false);
    }, 1300);
  }

  function handleToggleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(product.id);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden",
        "rounded-xl border border-slate-200/80 bg-white",
        "shadow-[0_6px_20px_rgba(15,23,42,.07)]",
        "transition duration-300 ease-out",
        "sm:rounded-2xl sm:shadow-[0_8px_26px_rgba(15,23,42,.07)]",
        "md:hover:-translate-y-1",
        "md:hover:border-brand-coral/25",
        "md:hover:shadow-[0_16px_38px_rgba(15,23,42,.11)]",
      )}
    >
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
          "absolute end-2 top-2 z-40",
          "flex h-10 w-10 items-center justify-center rounded-full",
          "border border-white/80 bg-white/[.94] text-slate-600",
          "shadow-[0_6px_18px_rgba(15,23,42,.13)] backdrop-blur-md",
          "transition duration-200",
          "hover:scale-105 hover:text-brand-coral active:scale-95",
          "sm:end-2.5 sm:top-2.5 sm:h-11 sm:w-11",
        )}
      >
        <Heart
          className={cn(
            "h-[18px] w-[18px] transition duration-200",
            inWishlist &&
              "scale-110 fill-brand-coral text-brand-coral",
          )}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link
          href={`/${locale}/product/${product.slug}`}
          aria-label={name}
          className="absolute inset-0"
        >
          <Image
            src={mainImage}
            alt={name}
            fill
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute start-2 top-2 z-10 flex max-w-[62%] flex-col items-start gap-1 sm:start-2.5 sm:top-2.5">
            {discount > 0 && (
              <Badge className="border-0 bg-brand-coral px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-md sm:px-2 sm:text-[10px]">
                -{discount}%
              </Badge>
            )}

            {product.featured && (
              <Badge className="border-0 bg-brand-sky px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-md sm:px-2 sm:text-[10px]">
                {t("common.featured")}
              </Badge>
            )}
          </div>

          {!isAvailable && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
              <Badge
                variant="outline"
                className="border-slate-200 bg-white/95 px-3 py-1 text-xs font-bold shadow-sm"
              >
                {t("common.outOfStock")}
              </Badge>
            </div>
          )}
        </Link>

        {/* Add to cart */}
        {isAvailable && (
          <button
            type="button"
            onClick={handleAddToCart}
            title={t("product.addToCart")}
            aria-label={t("product.addToCart")}
            className={cn(
              "absolute bottom-2 end-2 z-30",
              "flex h-11 w-11 items-center justify-center rounded-full",
              "border text-white",
              "shadow-[0_10px_26px_rgba(15,23,42,.22)]",
              "transition duration-200 active:scale-90",
              "sm:bottom-2.5 sm:end-2.5 sm:h-12 sm:w-12",
              justAdded
                ? "border-emerald-400 bg-emerald-500"
                : "border-white/30 bg-brand-coral hover:scale-105 hover:bg-[#ff5757]",
            )}
          >
            {justAdded ? (
              <Check className="h-5 w-5 stroke-[3]" />
            ) : (
              <ShoppingBag className="h-5 w-5" />
            )}

            {justAdded && (
              <span className="cart-spark-burst" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Product information */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5 sm:pt-3">
        {(brandName || categoryName) && (
          <div className="mb-1 flex min-h-3.5 items-center gap-1 overflow-hidden">
            {brandName && product.brand && (
              <Link
                href={`/${locale}/brand/${product.brand.slug}`}
                className="truncate text-[8px] font-black uppercase tracking-wide text-brand-coral hover:underline sm:text-[10px]"
              >
                {brandName}
              </Link>
            )}

            {brandName && categoryName && (
              <span className="text-[8px] text-slate-300">
                •
              </span>
            )}

            {categoryName && (
              <span className="truncate text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                {categoryName}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/${locale}/product/${product.slug}`}
          className="block"
        >
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[1.45] text-slate-900 transition-colors group-hover:text-brand-coral sm:min-h-[42px] sm:text-[15px]">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto flex min-h-7 flex-wrap items-end gap-x-1.5 gap-y-1 pt-2 sm:gap-x-2">
          <span
            className={cn(
              "text-[14px] font-black leading-none sm:text-base",
              discount > 0
                ? "text-brand-coral"
                : "text-slate-950",
            )}
          >
            {formatPrice(finalPrice, locale)}
          </span>

          {discount > 0 && (
            <span className="text-[9px] font-semibold leading-none text-slate-400 line-through sm:text-[11px]">
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}