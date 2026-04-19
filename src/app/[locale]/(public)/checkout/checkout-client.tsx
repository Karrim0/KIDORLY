"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  customerName: z.string().min(2, "Required"),
  whatsappNumber: z.string().min(8, "Invalid number"),
  city: z.enum(["HURGHADA", "CAIRO", "ALEXANDRIA"]),
  deliveryType: z.enum(["HOME", "HOTEL"]),
  address: z.string().optional(),
  hotelName: z.string().optional(),
  guestName: z.string().optional(),
  roomNumber: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"]),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutClientProps {
  shippingFees: Record<string, number>;
}

export function CheckoutClient({ shippingFees }: CheckoutClientProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, total, clearCart, isHydrated } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryType: "HOME",
      city: "HURGHADA",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });

  const city = watch("city");
  const deliveryType = watch("deliveryType");
  const shipping = city ? (shippingFees[city] || 0) : 0;
  const grandTotal = total + shipping;

  async function onSubmit(data: FormData) {
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const orderPayload = {
        ...data,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          price: item.finalPrice,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image: item.image,
        })),
        locale,
      };

      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (result.success && result.order) {
        clearCart();
        router.push(`/${locale}/order-success/${result.order.id}`);
      } else {
        setError(result.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Loading state: cart hasn't loaded from localStorage yet ── */
  if (!isHydrated) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground mb-6">Your cart is empty</p>
        <Button asChild>
          <Link href={`/${locale}/shop`}>Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border p-6 space-y-5">
              <h2 className="font-semibold text-lg">{t("customerInfo")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("fullName")}</Label>
                  <Input {...register("customerName")} className="mt-1.5" />
                  {errors.customerName && <p className="text-destructive text-xs mt-1">{t("required")}</p>}
                </div>
                <div>
                  <Label>{t("whatsapp")}</Label>
                  <Input {...register("whatsappNumber")} placeholder="+20..." className="mt-1.5" />
                  {errors.whatsappNumber && <p className="text-destructive text-xs mt-1">{t("invalidWhatsapp")}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("city")}</Label>
                  <Select value={city} onValueChange={(v) => setValue("city", v as FormData["city"])}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("selectCity")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HURGHADA">Hurghada / الغردقة</SelectItem>
                      <SelectItem value="CAIRO">Cairo / القاهرة</SelectItem>
                      <SelectItem value="ALEXANDRIA">Alexandria / الإسكندرية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("deliveryType")}</Label>
                  <Select value={deliveryType} onValueChange={(v) => setValue("deliveryType", v as FormData["deliveryType"])}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOME">{t("homeDelivery")}</SelectItem>
                      <SelectItem value="HOTEL">{t("hotelDelivery")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {deliveryType === "HOME" && (
                <div>
                  <Label>{t("address")}</Label>
                  <Textarea {...register("address")} placeholder={t("addressPlaceholder")} className="mt-1.5" />
                </div>
              )}

              {deliveryType === "HOTEL" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t("hotelName")}</Label>
                    <Input {...register("hotelName")} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>{t("guestName")}</Label>
                    <Input {...register("guestName")} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>{t("roomNumber")}</Label>
                    <Input {...register("roomNumber")} className="mt-1.5" />
                  </div>
                </div>
              )}

              <div>
                <Label>{t("notes")}</Label>
                <Textarea {...register("notes")} placeholder={t("notesPlaceholder")} className="mt-1.5" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border p-6 space-y-4">
              <h2 className="font-semibold text-lg">{t("paymentMethod")}</h2>
              <Select value={watch("paymentMethod")} onValueChange={(v) => setValue("paymentMethod", v as FormData["paymentMethod"])}>
                <SelectTrigger><SelectValue placeholder={t("selectPayment")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH_ON_DELIVERY">💵 Cash on Delivery</SelectItem>
                  <SelectItem value="VODAFONE_CASH">📱 Vodafone Cash</SelectItem>
                  <SelectItem value="INSTAPAY">🏦 InstaPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">{t("orderSummary")}</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium shrink-0">
                      {formatPrice(item.finalPrice * item.quantity, locale)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatPrice(total, locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>{shipping === 0 ? t("freeShipping") : formatPrice(shipping, locale)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>{t("total")}</span>
                <span>{formatPrice(grandTotal, locale)}</span>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" size="xl" className="w-full mt-6" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin me-2" />{t("processing")}</>
                ) : (
                  t("placeOrder")
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}