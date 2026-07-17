import { z } from "zod";

const emptyToNull = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

const nullableText = z.preprocess(
  emptyToNull,
  z.string().trim().nullable().optional()
);

const nullableNumber = z.preprocess(
  emptyToNull,
  z.coerce.number().nullable().optional()
);

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160, "Slug is too long"),

  nameEn: z.string().trim().min(1, "English name is required"),
  nameAr: z.string().trim().min(1, "Arabic name is required"),
  nameDe: z.string().trim().min(1, "German name is required"),

  descriptionEn: nullableText,
  descriptionAr: nullableText,
  descriptionDe: nullableText,

  image: nullableText,
  icon: nullableText,
  banner: nullableText,

  parentId: nullableText,

  visible: z.boolean().default(true),
  featured: z.boolean().default(false),

  sortOrder: z.coerce.number().int().min(0).default(0),

  discountPercentage: nullableNumber.refine(
    (value) => value == null || (value >= 0 && value <= 100),
    "Discount must be between 0 and 100"
  ),

  seoTitleEn: nullableText,
  seoTitleAr: nullableText,
  seoTitleDe: nullableText,

  seoDescEn: nullableText,
  seoDescAr: nullableText,
  seoDescDe: nullableText,
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

export const checkoutSchema = z
  .object({
    customerName: z.string().min(2),
    countryCode: z.string().optional(),
    whatsappNumber: z.string().min(8),

    governorate: z.string().optional(),
    city: z.string().min(1),

    governorateKey: z.string().optional(),
    locationKey: z.string().optional(),

    deliveryType: z.enum(["HOME", "HOTEL"]),

    address: z.string().optional(),
    hotelName: z.string().optional(),
    guestName: z.string().optional(),
    roomNumber: z.string().optional(),
    notes: z.string().optional(),

    paymentMethod: z.enum([
      "CASH_ON_DELIVERY",
      "VODAFONE_CASH",
      "INSTAPAY",
    ]),

    items: z
      .array(
        z.object({
          productId: z.string().trim().min(1),
          quantity: z.coerce.number().int().min(1).max(10),
          color: z.string().trim().max(80).optional().nullable(),
          size: z.string().trim().max(80).optional().nullable(),
        })
      )
      .min(1)
      .max(20),

    locale: z.enum(["ar", "en", "de"]).default("en"),
  })
  .refine(
    (data) => {
      if (data.deliveryType === "HOME") return !!data.address?.trim();
      return true;
    },
    {
      path: ["address"],
      message: "Address is required for home delivery",
    }
  )
  .refine(
    (data) => {
      if (data.deliveryType === "HOTEL") return !!data.hotelName?.trim();
      return true;
    },
    {
      path: ["hotelName"],
      message: "Hotel name is required for hotel delivery",
    }
  )
  .refine(
    (data) => {
      if (data.deliveryType === "HOTEL") return !!data.guestName?.trim();
      return true;
    },
    {
      path: ["guestName"],
      message: "Guest name is required for hotel delivery",
    }
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;
