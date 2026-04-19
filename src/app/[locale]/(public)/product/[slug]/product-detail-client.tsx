"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingBag, Minus, Plus, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/public/product-card";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice, getTranslated, getEffectiveDiscount, getDiscountedPrice } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface Props {
  product: ProductWithCategory;
  relatedProducts: ProductWithCategory[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

const name = getTranslated(product as unknown as Record<string, unknown>, "name", locale);

const description = getTranslated(product as unknown as Record<string, unknown>, "description", locale);

const shortDesc = getTranslated(product as unknown as Record<string, unknown>, "shortDesc", locale);
  const discount = getEffectiveDiscount(product.discountPercentage, product.category?.discountPercentage);
  const finalPrice = discount > 0 ? getDiscountedPrice(product.price, discount) : product.price;
  const isAvailable = product.availability === "AVAILABLE";

  function handleAddToCart() {
    if (!isAvailable) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name,
      price: product.price,
      finalPrice,
      image: product.images[0] || "/placeholder.svg",
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href={`/${locale}/shop`}>
          <ChevronLeft className="h-4 w-4 me-1" />
          {t("common.back")}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <Badge variant="coral" className="absolute top-4 start-4 text-sm px-3 py-1">
                -{discount}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border-2 transition-colors",
                    selectedImage === i ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <Link
              href={`/${locale}/category/${product.category.slug}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {getTranslated(product.category as unknown as Record<string, unknown>, "name", locale)}
            </Link>
          )}
          <h1 className="text-3xl font-bold mt-2 mb-4">{name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={cn("text-3xl font-bold", discount > 0 ? "text-brand-coral" : "")}>
              {formatPrice(finalPrice, locale)}
            </span>
            {discount > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price, locale)}
              </span>
            )}
            {product.compareAtPrice && !discount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, locale)}
              </span>
            )}
          </div>

          {shortDesc && <p className="text-muted-foreground mb-6 leading-relaxed">{shortDesc}</p>}

          <Separator className="my-6" />

          {/* Color Variants */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">{t("product.color")}</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-10 px-4 rounded-full border-2 text-sm font-medium transition-all",
                      selectedColor === color
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {selectedColor === color && <Check className="h-3 w-3 inline me-1" />}
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">{t("product.size")}</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-10 min-w-[44px] px-4 rounded-xl border-2 text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label className="text-sm font-medium mb-3 block">{t("product.quantity")}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-11 w-11 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-11 w-11 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button size="xl" className="flex-1" onClick={handleAddToCart} disabled={!isAvailable}>
              <ShoppingBag className="h-5 w-5 me-2" />
              {isAvailable ? t("product.addToCart") : t("common.outOfStock")}
            </Button>
          </div>

          {/* Description */}
          {description && (
            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-4">{t("product.description")}</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                {description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">{t("product.relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
