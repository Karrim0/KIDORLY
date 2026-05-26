import { z } from "zod";

export const checkoutSchema = z
  .object({
    customerName: z.string().min(2),
    countryCode: z.string().optional(),
    whatsappNumber: z.string().min(8),

    // بدل enum المدن القديمة
    governorate: z.string().optional(),
    city: z.string().min(1),

    // دول جايين من الفرونت عشان الشحن لو حبيت تستخدمهم
    governorateKey: z.string().optional(),
    locationKey: z.string().optional(),

    deliveryType: z.enum(["HOME", "HOTEL"]),

    address: z.string().optional(),
    hotelName: z.string().optional(),
    guestName: z.string().optional(),
    roomNumber: z.string().optional(),
    notes: z.string().optional(),

    paymentMethod: z.enum(["CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"]),

    items: z
      .array(
        z.object({
          productId: z.string().optional().nullable(),
          productName: z.string(),
          price: z.number(),
          quantity: z.number().min(1),
          color: z.string().optional().nullable(),
          size: z.string().optional().nullable(),
          image: z.string().optional().nullable(),
        }),
      )
      .min(1),

    locale: z.string().default("en"),
  })
  .refine(
    (data) => {
      if (data.deliveryType === "HOME") return !!data.address?.trim();
      return true;
    },
    {
      path: ["address"],
      message: "Address is required for home delivery",
    },
  )
  .refine(
    (data) => {
      if (data.deliveryType === "HOTEL") return !!data.hotelName?.trim();
      return true;
    },
    {
      path: ["hotelName"],
      message: "Hotel name is required for hotel delivery",
    },
  )
  .refine(
    (data) => {
      if (data.deliveryType === "HOTEL") return !!data.guestName?.trim();
      return true;
    },
    {
      path: ["guestName"],
      message: "Guest name is required for hotel delivery",
    },
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;