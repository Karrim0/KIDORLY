"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildWhatsAppLink, formatPrice } from "@/lib/utils";
import { SETTING_KEYS } from "@/lib/settings";
import type { OrderWithItems } from "@/types";

interface Props {
  order: OrderWithItems;
  settings: Record<string, string>;
}

export function OrderSuccessClient({ order, settings }: Props) {
  const t = useTranslations("orderSuccess");
  const locale = useLocale();
  const whatsappNumber = settings[SETTING_KEYS.WHATSAPP_NUMBER] || "";

  // Build WhatsApp message
  const itemsList = order.items
    .map((item) => `• ${item.productName} ×${item.quantity} — ${formatPrice(item.price * item.quantity, locale)}`)
    .join("\n");

  const whatsappMessage = `🛒 *New Order — Kidorly*
Order: *${order.orderNumber}*
Name: ${order.customerName}
City: ${order.city}
Delivery: ${order.deliveryType}${order.deliveryType === "HOTEL" ? `\nHotel: ${order.hotelName}\nRoom: ${order.roomNumber}` : `\nAddress: ${order.address}`}
Payment: ${order.paymentMethod.replace(/_/g, " ")}

*Items:*
${itemsList}

Subtotal: ${formatPrice(order.subtotal, locale)}
Shipping: ${formatPrice(order.shippingCost, locale)}
*Total: ${formatPrice(order.total, locale)}*`;

  const whatsappLink = buildWhatsAppLink(whatsappNumber, whatsappMessage);

  // Payment instructions
  const instructionsKey = `payment_instructions_${locale}`;
  const instructions = settings[instructionsKey] || settings[SETTING_KEYS.PAYMENT_INSTRUCTIONS_EN] || "";
  const showInstructions = order.paymentMethod !== "CASH_ON_DELIVERY" && instructions;

  return (
    <div className="container py-16 max-w-2xl">
      <div className="text-center mb-10">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Order Number */}
      <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8">
        <p className="text-sm text-muted-foreground">{t("orderNumber")}</p>
        <p className="text-2xl font-bold font-mono mt-1">{order.orderNumber}</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">{t("summary")}</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.productName} ×{item.quantity}
                {(item.color || item.size) && (
                  <span className="text-muted-foreground"> ({[item.color, item.size].filter(Boolean).join("/")})</span>
                )}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity, locale)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(order.subtotal, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatPrice(order.shippingCost, locale)}</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total, locale)}</span>
        </div>
      </div>

      {/* Payment Instructions */}
      {showInstructions && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-2">{t("paymentInstructions")}</h3>
          <div className="text-sm text-amber-800 whitespace-pre-line">{instructions}</div>
          {order.paymentMethod === "VODAFONE_CASH" && settings[SETTING_KEYS.VODAFONE_NUMBER] && (
            <p className="mt-3 font-semibold text-sm">Vodafone: {settings[SETTING_KEYS.VODAFONE_NUMBER]}</p>
          )}
          {order.paymentMethod === "INSTAPAY" && settings[SETTING_KEYS.INSTAPAY_ID] && (
            <p className="mt-3 font-semibold text-sm">InstaPay: {settings[SETTING_KEYS.INSTAPAY_ID]}</p>
          )}
        </div>
      )}

      {/* WhatsApp CTA */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center mb-8">
        <p className="text-sm text-muted-foreground mb-4">{t("whatsappNote")}</p>
        <Button size="xl" className="bg-emerald-500 hover:bg-emerald-600" asChild>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5 me-2" />
            {t("continueWhatsApp")}
          </a>
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" asChild>
          <Link href={`/${locale}/shop`}>
            <ArrowLeft className="h-4 w-4 me-1" />
            {t("backToShop")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
