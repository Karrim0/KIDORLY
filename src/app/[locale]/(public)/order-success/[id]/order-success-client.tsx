"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  CheckCircle,
  ArrowLeft,
  Copy,
  Check,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildWhatsAppLink, cn, formatPrice } from "@/lib/utils";
import { SETTING_KEYS } from "@/lib/settings";
import type { OrderWithItems } from "@/types";

interface Props {
  order: OrderWithItems;
  settings: Record<string, string>;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.01 3.2C9.02 3.2 3.34 8.83 3.34 15.75c0 2.25.6 4.45 1.75 6.38L3.2 28.8l6.85-1.8a12.7 12.7 0 0 0 5.96 1.5c6.99 0 12.67-5.63 12.67-12.55S23 3.2 16.01 3.2Zm0 23.17c-1.9 0-3.75-.5-5.37-1.45l-.38-.22-4.06 1.07 1.08-3.93-.25-.4a10.4 10.4 0 0 1-1.6-5.5c0-5.75 4.74-10.42 10.58-10.42S26.6 10.2 26.6 15.95 21.85 26.37 16.01 26.37Zm5.8-7.8c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.7.16-.21.31-.8 1.03-.98 1.24-.18.2-.36.23-.68.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.58-1.86-1.76-2.17-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.21 0-.54.08-.82.39-.29.31-1.08 1.05-1.08 2.56s1.1 2.97 1.26 3.18c.16.21 2.16 3.28 5.23 4.6.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.88-.76 2.14-1.5.27-.73.27-1.36.19-1.5-.08-.13-.29-.21-.61-.36Z" />
    </svg>
  );
}

export function OrderSuccessClient({ order, settings }: Props) {
  const t = useTranslations("orderSuccess");
  const ct = useTranslations("checkout");
  const pt = useTranslations("payment");
  const locale = useLocale();

  const [copied, setCopied] = useState(false);

  const whatsappNumber = settings[SETTING_KEYS.WHATSAPP_NUMBER] || "";

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.productName} ×${item.quantity} — ${formatPrice(
          item.price * item.quantity,
          locale,
        )}`,
    )
    .join("\n");

  const deliveryInfo =
    order.deliveryType === "HOTEL"
      ? `${ct("hotelName")}: ${order.hotelName || "-"}\n${ct("roomNumber")}: ${order.roomNumber || "-"}`
      : `${ct("address")}: ${order.address || "-"}`;

  const paymentLabel =
    order.paymentMethod === "VODAFONE_CASH"
      ? pt("vodafone")
      : order.paymentMethod === "INSTAPAY"
        ? pt("instapay")
        : pt("cash");

  const deliveryLabel =
    order.deliveryType === "HOTEL"
      ? ct("hotelDelivery")
      : ct("homeDelivery");

  const whatsappMessage = `🛒 *Kidorly — ${t("summary")}*

${t("orderNumber")}: *${order.orderNumber}*
${ct("fullName")}: ${order.customerName}
${ct("city")}: ${order.city}
${ct("deliveryType")}: ${deliveryLabel}
${deliveryInfo}
${ct("paymentMethod")}: ${paymentLabel}

*${ct("orderSummary")}:*
${itemsList}

${ct("subtotal")}: ${formatPrice(order.subtotal, locale)}
${ct("shipping")}: ${formatPrice(order.shippingCost, locale)}
*${ct("total")}: ${formatPrice(order.total, locale)}*`;

  const whatsappLink = buildWhatsAppLink(whatsappNumber, whatsappMessage);
  const hasWhatsAppNumber = Boolean(whatsappNumber?.replace(/[^\d]/g, ""));
  const instructionsKey = `payment_instructions_${locale}`;
  const instructions =
    settings[instructionsKey] ||
    settings[SETTING_KEYS.PAYMENT_INSTRUCTIONS_EN] ||
    "";

  const showInstructions =
    order.paymentMethod !== "CASH_ON_DELIVERY" && Boolean(instructions);

  async function copyOrderNumber() {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);

      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/70 to-white">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-brand-coral/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14">
        <div className="mx-auto max-w-3xl">
          {/* Success Hero */}
          <section className="mb-5 overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-[0_14px_44px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:p-8">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle className="h-11 w-11" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-3xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("orderNumber")}
              </p>

              <div className="mt-2 flex items-center justify-center gap-2">
                <p className="font-mono text-2xl font-extrabold tracking-tight text-gray-950">
                  {order.orderNumber}
                </p>

                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                    copied
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-white text-muted-foreground hover:text-brand-coral",
                  )}
                  aria-label={t("copyOrderNumber")}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* WhatsApp CTA */}
          <section className="mb-5 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)] sm:p-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <WhatsAppIcon className="h-6 w-6" />
            </div>

            <p className="mx-auto mb-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("whatsappNote")}
            </p>

            <Button
  size="lg"
  className="h-12 rounded-2xl bg-emerald-500 px-6 font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-60"
  disabled={!hasWhatsAppNumber}
  asChild={hasWhatsAppNumber}
>
  {hasWhatsAppNumber ? (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon className="me-2 h-5 w-5" />
      {t("continueWhatsApp")}
    </a>
  ) : (
    <span>
      <WhatsAppIcon className="me-2 h-5 w-5" />
      {t("continueWhatsApp")}
    </span>
  )}
</Button>
          </section>

          {/* Payment Instructions */}
          {showInstructions && (
            <section className="mb-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.07)] sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </span>

                <h2 className="text-lg font-extrabold text-gray-950">
                  {t("paymentInstructions")}
                </h2>
              </div>

              <div className="whitespace-pre-line text-sm leading-relaxed text-amber-900">
                {instructions}
              </div>

              {order.paymentMethod === "VODAFONE_CASH" &&
                settings[SETTING_KEYS.VODAFONE_NUMBER] && (
                  <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-gray-950">
                    Vodafone Cash: {settings[SETTING_KEYS.VODAFONE_NUMBER]}
                  </p>
                )}

              {order.paymentMethod === "INSTAPAY" &&
                settings[SETTING_KEYS.INSTAPAY_ID] && (
                  <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-gray-950">
                    InstaPay: {settings[SETTING_KEYS.INSTAPAY_ID]}
                  </p>
                )}
            </section>
          )}

          {/* Summary */}
          <section className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_14px_44px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral">
                <ReceiptText className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-lg font-extrabold text-gray-950">
                  {t("summary")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {ct("itemCount", { count: order.items.length })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-gray-50/80 p-3"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-bold text-gray-950">
                      {item.productName} ×{item.quantity}
                    </p>

                    {(item.color || item.size) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-sm font-extrabold text-gray-950">
                    {formatPrice(item.price * item.quantity, locale)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-5" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{ct("subtotal")}</span>
                <span className="font-bold text-gray-950">
                  {formatPrice(order.subtotal, locale)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{ct("shipping")}</span>
                <span className="font-bold text-gray-950">
                  {formatPrice(order.shippingCost, locale)}
                </span>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-extrabold text-gray-950">
                {ct("total")}
              </span>

              <span className="text-2xl font-extrabold text-brand-coral">
                {formatPrice(order.total, locale)}
              </span>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 w-full rounded-2xl font-bold sm:w-auto"
              asChild
            >
              <Link href={`/${locale}/shop`}>
                <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />
                {t("backToShop")}
              </Link>
            </Button>

            <Button
              className="h-11 w-full rounded-2xl font-bold shadow-lg shadow-brand-coral/20 sm:w-auto"
              asChild
            >
              <Link href={`/${locale}`}>
                <ShoppingBag className="me-2 h-4 w-4" />
                {ct("continueShopping")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
