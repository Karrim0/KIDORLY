"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right",
          locale === "ar" ? "left-0" : "right-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-bold text-lg">{t("title")}</h2>
            {count > 0 && (
              <span className="text-sm text-muted-foreground">
                ({count} {count === 1 ? t("item") : t("items")})
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="font-semibold mb-1">{t("empty")}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("emptySubtitle")}</p>
              <Button onClick={() => setIsOpen(false)} asChild>
                <Link href={`/${locale}/shop`}>{t("shopNow")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/product/${item.slug}`}
                      className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {(item.color || item.size) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                          className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                          className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{formatPrice(item.finalPrice * item.quantity, locale)}</span>
                        <button
                          onClick={() => removeItem(item.productId, item.color, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t("total")}</span>
              <span className="text-xl font-bold">{formatPrice(total, locale)}</span>
            </div>
            <Button size="lg" className="w-full" asChild onClick={() => setIsOpen(false)}>
              <Link href={`/${locale}/checkout`}>{t("checkout")}</Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setIsOpen(false)}>
              {t("continueShopping")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
