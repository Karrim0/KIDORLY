import type { Locale } from "@/lib/i18n";

// ─── Product types ───────────────────────────────────────────────────────────

export interface ProductWithCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  shortDescAr: string | null;
  shortDescEn: string | null;
  shortDescDe: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercentage: number | null;
  availability: "AVAILABLE" | "UNAVAILABLE";
  featured: boolean;
  images: string[];
  colors: string[];
  sizes: string[];
  seoTitleAr: string | null;
  seoTitleEn: string | null;
  seoTitleDe: string | null;
  seoDescAr: string | null;
  seoDescEn: string | null;
  seoDescDe: string | null;
  categoryId: string | null;
  category: CategoryBasic | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  image: string | null;
  discountPercentage: number | null;
}

export interface CategoryFull extends CategoryBasic {
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  seoTitleAr: string | null;
  seoTitleEn: string | null;
  seoTitleDe: string | null;
  seoDescAr: string | null;
  seoDescEn: string | null;
  seoDescDe: string | null;
  _count?: { products: number };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Cart types ──────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  finalPrice: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}

// ─── Order types ─────────────────────────────────────────────────────────────

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsappNumber: string;
  city: "HURGHADA" | "CAIRO" | "ALEXANDRIA";
  deliveryType: "HOME" | "HOTEL";
  address: string | null;
  hotelName: string | null;
  guestName: string | null;
  roomNumber: string | null;
  notes: string | null;
  paymentMethod: "CASH_ON_DELIVERY" | "VODAFONE_CASH" | "INSTAPAY";
  paymentStatus: "UNPAID" | "PAID";
  deliveryStatus: "NOT_DELIVERED" | "DELIVERED";
  subtotal: number;
  shippingCost: number;
  total: number;
  locale: string;
  items: OrderItemData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemData {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
  image: string | null;
}

// ─── Homepage section types ──────────────────────────────────────────────────

export interface HeroData {
  titleAr: string;
  titleEn: string;
  titleDe: string;
  subtitleAr: string;
  subtitleEn: string;
  subtitleDe: string;
  ctaAr: string;
  ctaEn: string;
  ctaDe: string;
  image: string;
}

export interface AnnouncementData {
  textAr: string;
  textEn: string;
  textDe: string;
  visible: boolean;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export type LocaleParams = { params: { locale: Locale } };
