import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  whatsappNumber: z.string().min(8),
  city: z.enum(["HURGHADA", "CAIRO", "ALEXANDRIA"]),
  deliveryType: z.enum(["HOME", "HOTEL"]),
  address: z.string().optional(),
  hotelName: z.string().optional(),
  guestName: z.string().optional(),
  roomNumber: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"]),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    color: z.string().optional(),
    size: z.string().optional(),
    image: z.string().optional(),
  })).min(1),
  locale: z.string().default("en"),
}).refine(
  (data) => {
    if (data.deliveryType === "HOME") return !!data.address;
    return true;
  },
  { path: ["address"], message: "Address is required for home delivery" }
).refine(
  (data) => {
    if (data.deliveryType === "HOTEL") return !!data.hotelName;
    return true;
  },
  { path: ["hotelName"], message: "Hotel name is required for hotel delivery" }
);

export type CheckoutInput = z.infer<typeof checkoutSchema>;
