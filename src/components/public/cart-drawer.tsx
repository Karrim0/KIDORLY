"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();

  const {
    items,
    total,
    count,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
  } = useCart();

  if (!isOpen) return null;

  const isAr = locale === "ar";

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 h-[92svh] rounded-t-[2rem]",
          "sm:inset-y-0 sm:h-full sm:w-full sm:max-w-md sm:rounded-none",
          "animate-in duration-300",
          isAr
            ? "sm:left-0 sm:slide-in-from-left"
            : "sm:right-0 sm:slide-in-from-right",
          "slide-in-from-bottom sm:slide-in-from-bottom-0",
        )}
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral">
                <ShoppingBag className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-gray-950">
                  {t("title")}
                </h2>

                {count > 0 && (
                  <p className="text-xs font-medium text-muted-foreground">
                    {count} {count === 1 ? t("item") : t("items")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={closeDrawer}
            className="h-10 w-10 shrink-0 rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-950"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-muted-foreground">
                <ShoppingBag className="h-10 w-10" />
              </div>

              <h3 className="mb-2 text-xl font-extrabold text-gray-950">
                {t("empty")}
              </h3>

              <p className="mb-7 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t("emptySubtitle")}
              </p>

              <Button
                asChild
                className="h-11 rounded-2xl px-6 font-bold shadow-lg shadow-brand-coral/20"
                onClick={closeDrawer}
              >
                <Link href={`/${locale}/shop`}>{t("shopNow")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const itemKey = `${item.productId}-${item.color}-${item.size}`;

                return (
                  <article
                    key={itemKey}
                    className="rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.02]"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/${locale}/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50 sm:h-22 sm:w-22"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="88px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <Link
                            href={`/${locale}/product/${item.slug}`}
                            className="line-clamp-2 flex-1 text-sm font-extrabold leading-snug text-gray-950 transition-colors hover:text-primary"
                            onClick={closeDrawer}
                          >
                            {item.name}
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.productId, item.color, item.size)
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label={t("remove")}
                            title={t("remove")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {(item.color || item.size) && (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {item.color && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                {item.color}
                              </span>
                            )}

                            {item.size && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                {item.size}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.color,
                                  item.size,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm transition-colors hover:text-brand-coral"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="w-9 text-center text-sm font-extrabold text-gray-950">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.color,
                                  item.size,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm transition-colors hover:text-brand-coral"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="shrink-0 text-sm font-extrabold text-brand-coral">
                            {formatPrice(item.finalPrice * item.quantity, locale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-gray-100 bg-white/95 px-4 py-4 shadow-[0_-10px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6">
            <div className="mb-4 rounded-3xl bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  {t("total")}
                </span>

                <span className="text-xl font-extrabold text-brand-coral">
                  {formatPrice(total, locale)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                size="lg"
                className="h-12 rounded-2xl text-base font-extrabold shadow-lg shadow-brand-coral/25"
                asChild
                onClick={closeDrawer}
              >
                <Link href={`/${locale}/checkout`}>
                  {t("checkout")}
                  <ArrowRight
                    className={cn(
                      "ms-2 h-4 w-4",
                      isAr && "rotate-180",
                    )}
                  />
                </Link>
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-2xl font-bold text-muted-foreground hover:text-gray-950"
                onClick={closeDrawer}
              >
                {t("continueShopping")}
              </Button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}