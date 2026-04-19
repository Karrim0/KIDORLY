import { formatPrice } from "./utils";
import type { OrderWithItems } from "@/types";

/**
 * Build a WhatsApp message for an order confirmation.
 * Supports localized templates with {{placeholder}} syntax.
 */
export function buildOrderWhatsAppMessage(
  order: OrderWithItems,
  template?: string | null
): string {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.productName} ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  // Default message if no template is set
  const defaultMessage = `🛒 *New Order — Kidorly*

Order: *${order.orderNumber}*
Name: ${order.customerName}
City: ${order.city}
Delivery: ${order.deliveryType === "HOME" ? "Home Delivery" : "Hotel Delivery"}${
    order.deliveryType === "HOTEL"
      ? `\nHotel: ${order.hotelName || "—"}\nGuest: ${order.guestName || "—"}\nRoom: ${order.roomNumber || "—"}`
      : `\nAddress: ${order.address || "—"}`
  }
Payment: ${formatPaymentMethod(order.paymentMethod)}

*Items:*
${itemsList}

Subtotal: ${formatPrice(order.subtotal)}
Shipping: ${formatPrice(order.shippingCost)}
*Total: ${formatPrice(order.total)}*`;

  if (!template) return defaultMessage;

  // Replace template placeholders
  return template
    .replace(/\{\{orderNumber\}\}/g, order.orderNumber)
    .replace(/\{\{customerName\}\}/g, order.customerName)
    .replace(/\{\{city\}\}/g, order.city)
    .replace(/\{\{total\}\}/g, formatPrice(order.total))
    .replace(/\{\{items\}\}/g, itemsList)
    .replace(/\{\{paymentMethod\}\}/g, formatPaymentMethod(order.paymentMethod));
}

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "CASH_ON_DELIVERY":
      return "Cash on Delivery";
    case "VODAFONE_CASH":
      return "Vodafone Cash";
    case "INSTAPAY":
      return "InstaPay";
    default:
      return method;
  }
}

/**
 * Format city name for display.
 */
export function formatCity(city: string, locale: string = "en"): string {
  const cityNames: Record<string, Record<string, string>> = {
    HURGHADA: { en: "Hurghada", ar: "الغردقة", de: "Hurghada" },
    CAIRO: { en: "Cairo", ar: "القاهرة", de: "Kairo" },
    ALEXANDRIA: { en: "Alexandria", ar: "الإسكندرية", de: "Alexandria" },
  };
  return cityNames[city]?.[locale] || city;
}

/**
 * Format delivery type for display.
 */
export function formatDeliveryType(type: string, locale: string = "en"): string {
  const types: Record<string, Record<string, string>> = {
    HOME: { en: "Home Delivery", ar: "توصيل منزلي", de: "Hauslieferung" },
    HOTEL: { en: "Hotel Delivery", ar: "توصيل للفندق", de: "Hotellieferung" },
  };
  return types[type]?.[locale] || type;
}
