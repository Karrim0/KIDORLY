"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/public/product-card";
import { SaleTimer } from "@/components/public/sale-timer";
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

interface Props {
  product: ProductWithCategory;
  relatedProducts: ProductWithCategory[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();

  const { addItem, addItemAndPersist } = useCart();
  const { has, toggle } = useWishlist();

  const images = useMemo(
    () => (product.images?.length ? product.images : ["/placeholder.svg"]),
    [product.images],
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0],
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const name = getTranslated(product, "name", locale);
  const description = getTranslated(product, "description", locale);
  const shortDesc = getTranslated(product, "shortDesc", locale);

  const discount = getEffectiveDiscount(
    product.discountPercentage,
    product.category?.discountPercentage,
  );

  const finalPrice =
    discount > 0 ? getDiscountedPrice(product.price, discount) : product.price;

  const isAvailable = product.availability === "AVAILABLE";
  const inWishlist = has(product.id);

  const brandName = product.brand
    ? getTranslated(product.brand, "name", locale)
    : "";

  const categoryName = product.category
    ? getTranslated(product.category, "name", locale)
    : "";

  const showTimer =
    discount > 0 &&
    product.saleEndsAt &&
    new Date(product.saleEndsAt) > new Date();

  const cartItem = useMemo(
    () => ({
      productId: product.id,
      slug: product.slug,
      name,
      price: product.price,
      finalPrice,
      image: images[0] || "/placeholder.svg",
      quantity,
      color: selectedColor,
      size: selectedSize,
    }),
    [
      product.id,
      product.slug,
      product.price,
      name,
      finalPrice,
      images,
      quantity,
      selectedColor,
      selectedSize,
    ],
  );

  function goToImage(index: number) {
    const nextIndex = (index + images.length) % images.length;
    setSelectedImage(nextIndex);
  }

  function nextImage() {
    goToImage(selectedImage + 1);
  }

  function prevImage() {
    goToImage(selectedImage - 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null || images.length <= 1) return;

    const diff = touchStart - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) nextImage();
      else prevImage();
    }

    setTouchStart(null);
  }

  function handleAddToCart() {
    if (!isAvailable) return;
    addItem(cartItem);
  }

  function handleBuyNow() {
    if (!isAvailable) return;

    // مهم: مش بنستخدم addItem هنا عشان مايفتحش الكارت.
    addItemAndPersist(cartItem);
    router.push(`/${locale}/checkout`);
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[520px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-28 sm:pb-14 md:pb-16">
        {/* Back */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl px-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={`/${locale}/shop`}>
              <ChevronLeft className="me-1 h-4 w-4 rtl:rotate-180" />
              {t("common.back")}
            </Link>
          </Button>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
          {/* Image Gallery */}
          <div className="min-w-0">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-gray-100 bg-white",
                "shadow-[0_14px_40px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03]",
              )}
            >
              <div
                className="relative aspect-[1/1.05] overflow-hidden bg-gray-50 sm:aspect-square"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="select-none object-cover transition-transform duration-700 ease-out md:hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  draggable={false}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                {discount > 0 && (
                  <Badge className="absolute left-3 top-3 z-10 border-0 bg-brand-coral px-2.5 py-1 text-xs font-bold text-white shadow-lg sm:left-4 sm:top-4 sm:text-sm">
                    -{discount}%
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() => toggle(product.id)}
                  aria-label={
                    inWishlist
                      ? t("wishlist.removeFromWishlist")
                      : t("wishlist.addToWishlist")
                  }
                  className={cn(
                    "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full sm:right-4 sm:top-4 sm:h-11 sm:w-11",
                    "bg-white/95 text-gray-600 shadow-lg backdrop-blur-sm",
                    "transition-all duration-200 hover:scale-110 hover:text-brand-coral active:scale-95",
                  )}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      inWishlist && "fill-brand-coral text-brand-coral",
                    )}
                  />
                </button>

                {!isAvailable && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-white/90 px-4 py-2 text-sm font-bold shadow-sm"
                    >
                      {t("common.outOfStock")}
                    </Badge>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white md:flex"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white md:flex"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1.5 backdrop-blur-sm md:hidden">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => goToImage(i)}
                          aria-label={`Image ${i + 1}`}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            selectedImage === i
                              ? "w-5 bg-white"
                              : "w-1.5 bg-white/55",
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="-mx-4 mt-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                <div className="flex min-w-max gap-2.5 sm:gap-3">
                  {images.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      onClick={() => goToImage(i)}
                      className={cn(
                        "relative h-17 w-17 shrink-0 overflow-hidden rounded-2xl border-2 bg-gray-50 shadow-sm transition-all duration-200 sm:h-20 sm:w-20",
                        selectedImage === i
                          ? "border-brand-coral ring-2 ring-brand-coral/15"
                          : "border-white hover:border-gray-200",
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="min-w-0">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] sm:p-6 lg:sticky lg:top-24">
              {/* Brand + Category */}
              {(brandName || categoryName) && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  {product.brand && brandName && (
                    <Link
                      href={`/${locale}/brand/${product.brand.slug}`}
                      className="rounded-full bg-brand-coral/10 px-3 py-1 font-bold uppercase tracking-wide text-brand-coral transition-colors hover:bg-brand-coral/15"
                    >
                      {brandName}
                    </Link>
                  )}

                  {product.category && categoryName && (
                    <Link
                      href={`/${locale}/category/${product.category.slug}`}
                      className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      {categoryName}
                    </Link>
                  )}
                </div>
              )}

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
                {name}
              </h1>

              {shortDesc && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {shortDesc}
                </p>
              )}

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={cn(
                    "text-3xl font-extrabold leading-none sm:text-4xl",
                    discount > 0 ? "text-brand-coral" : "text-gray-950",
                  )}
                >
                  {formatPrice(finalPrice, locale)}
                </span>

                {discount > 0 && (
                  <span className="text-base font-semibold text-muted-foreground line-through sm:text-lg">
                    {formatPrice(product.price, locale)}
                  </span>
                )}

                {product.compareAtPrice && !discount && (
                  <span className="text-base font-semibold text-muted-foreground line-through sm:text-lg">
                    {formatPrice(product.compareAtPrice, locale)}
                  </span>
                )}
              </div>

              {showTimer && (
                <div className="mt-5">
                  <SaleTimer endsAt={product.saleEndsAt!} />
                </div>
              )}

              <Separator className="my-6" />

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-extrabold text-gray-950">
                    {t("product.color")}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "h-10 rounded-full border px-4 text-sm font-bold transition-all",
                          selectedColor === color
                            ? "border-brand-coral bg-brand-coral/10 text-brand-coral shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                        )}
                      >
                        {selectedColor === color && (
                          <Check className="me-1 inline h-3.5 w-3.5" />
                        )}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-5">
                  <label className="mb-3 block text-sm font-extrabold text-gray-950">
                    {t("product.size")}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "h-10 min-w-[46px] rounded-xl border px-4 text-sm font-bold transition-all",
                          selectedSize === size
                            ? "border-brand-coral bg-brand-coral/10 text-brand-coral shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-extrabold text-gray-950">
                  {t("product.quantity")}
                </label>

                <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm transition-colors hover:text-brand-coral"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-12 text-center text-lg font-extrabold text-gray-950">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm transition-colors hover:text-brand-coral"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-[1fr_52px] gap-2 sm:grid-cols-2 sm:gap-3">
                <Button
                  size="lg"
                  className={cn(
                    "h-12 rounded-2xl bg-brand-coral text-sm font-extrabold text-white shadow-lg shadow-brand-coral/25 hover:bg-brand-coral/90 sm:h-14 sm:text-base",
                    "press-effect",
                  )}
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                >
                  <Zap className="me-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">
                    {isAvailable ? t("product.buyNow") : t("common.outOfStock")}
                  </span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "h-12 rounded-2xl border-gray-200 bg-white px-0 font-extrabold text-gray-700 hover:border-brand-coral/40 hover:bg-brand-coral/5 hover:text-brand-coral sm:h-14 sm:px-4",
                    "press-effect",
                  )}
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  aria-label={t("product.addToCart")}
                  title={t("product.addToCart")}
                >
                  <ShoppingBag className="h-5 w-5 sm:me-2" />
                  <span className="hidden sm:inline">{t("product.addToCart")}</span>
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <Truck className="h-4 w-4 text-brand-sky" />
                  <span>{t("whyUs.delivery")}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-brand-coral" />
                  <span>{t("whyUs.quality")}</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <RotateCcw className="h-4 w-4 text-emerald-600" />
                  <span>{t("whyUs.support")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {description && (
          <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:p-6 md:mt-10 md:p-8">
            <h2 className="mb-4 text-xl font-extrabold text-gray-950 sm:text-2xl">
              {t("product.description")}
            </h2>

            <div className="whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-base">
              {description}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                {t("product.relatedProducts")}
              </h2>

              <Button
                variant="outline"
                size="sm"
                className="hidden rounded-xl font-bold sm:inline-flex"
                asChild
              >
                <Link href={`/${locale}/shop`}>{t("common.viewAll")}</Link>
              </Button>
            </div>

            <div className="category-scroll-snap scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[78vw] max-w-[310px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-40 flex min-h-[68px] items-center gap-3 rounded-[1.5rem] border border-white/80 bg-white/94 p-2.5 shadow-[0_18px_55px_rgba(15,23,42,.22)] backdrop-blur-xl sm:hidden">
        <div className="min-w-0 flex-1 ps-2">
          <p className="text-[10px] font-bold text-slate-500">{t("product.mobileTotal")}</p>
          <p className="truncate text-lg font-black text-brand-coral">{formatPrice(finalPrice * quantity, locale)}</p>
        </div>
        <Button onClick={handleBuyNow} disabled={!isAvailable} className="h-12 min-w-[150px] rounded-2xl px-5 text-sm font-black shadow-lg shadow-brand-coral/25">
          <Zap className="me-1.5 h-4 w-4" />
          {isAvailable ? t("product.buyNow") : t("common.outOfStock")}
        </Button>
      </div>
    </main>
  );
}
