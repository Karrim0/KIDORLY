import type { Locale } from "@/lib/i18n";

// ─── Brand types ─────────────────────────────────────────────────────────────

export interface BrandBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  logo: string | null;
}

export interface BrandFull extends BrandBasic {
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  banner: string | null;
  featured: boolean;
  _count?: { products: number };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Category types ──────────────────────────────────────────────────────────

export interface CategoryBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  image: string | null;
  icon: string | null;
  banner: string | null;
  discountPercentage: number | null;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  parentId: string | null;
}

export interface CategoryFull extends CategoryBasic {
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;

  parent?: CategoryBasic | null;
  children?: CategoryBasic[];
  relatedTo?: CategoryBasic[];
  relatedFrom?: CategoryBasic[];

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

// ─── Collections / Tags / Age Groups ─────────────────────────────────────────

export interface CollectionBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  image: string | null;
  banner: string | null;
  type: "MARKETING" | "SEASONAL" | "SYSTEM";
  visible: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface CollectionFull extends CollectionBasic {
  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;
  _count?: { products: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface TagBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface AgeGroupBasic {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  nameDe: string;
  minAgeMonths: number | null;
  maxAgeMonths: number | null;
  visible: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface ProductCollectionData {
  collection: CollectionBasic;
}

export interface ProductTagData {
  tag: TagBasic;
}

export interface ProductAgeGroupData {
  ageGroup: AgeGroupBasic;
}

// ─── Product types ───────────────────────────────────────────────────────────

export interface ProductWithCategory {
  id: string;
  slug: string;

  nameAr: string;
  nameEn: string;
  nameDe: string;

  brandId: string | null;
  brand: BrandBasic | null;

  shortDescAr: string | null;
  shortDescEn: string | null;
  shortDescDe: string | null;

  descriptionAr: string | null;
  descriptionEn: string | null;
  descriptionDe: string | null;

  price: number;
  compareAtPrice: number | null;
  discountPercentage: number | null;
  saleEndsAt: Date | null;

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

  collections?: ProductCollectionData[];
  tags?: ProductTagData[];
  ageGroups?: ProductAgeGroupData[];

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
  city: string;
  governorate?: string | null;
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