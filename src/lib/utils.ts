import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./i18n";

/** Merge Tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in EGP */
export function formatPrice(amount: number, locale: string = "en"): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : locale === "de" ? "de-DE" : "en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  
  if (locale === "ar") return `${formatted} ج.م`;
  return `EGP ${formatted}`;
}

/**
 * Calculate effective discount for a product.
 * Priority: product discount > category discount > global discount.
 */
export function getEffectiveDiscount(
  productDiscount?: number | null,
  categoryDiscount?: number | null,
  globalDiscount?: number | null
): number {
  if (productDiscount && productDiscount > 0) return productDiscount;
  if (categoryDiscount && categoryDiscount > 0) return categoryDiscount;
  if (globalDiscount && globalDiscount > 0) return globalDiscount;
  return 0;
}

/** Calculate discounted price */
export function getDiscountedPrice(price: number, discountPercentage: number): number {
  if (discountPercentage <= 0) return price;
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
}

/** Get translated field based on locale */
export function getTranslated<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  const key = `${field}${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof T;
  return (obj[key] as string) || (obj[`${field}En` as keyof T] as string) || "";
}

/** Generate order number: KDR-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KDR-${dateStr}-${rand}`;
}

/** Build WhatsApp link with pre-filled message */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/** Generate a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
