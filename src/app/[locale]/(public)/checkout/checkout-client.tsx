"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShoppingBag,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Home,
  Hotel,
  Banknote,
  Smartphone,
  Landmark,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

const EGYPT_LOCATIONS = [
  {
    value: "red-sea",
    labelEn: "Red Sea",
    labelAr: "البحر الأحمر",
    cities: [
      { value: "hurghada", labelEn: "Hurghada", labelAr: "الغردقة" },
      { value: "el-gouna", labelEn: "El Gouna", labelAr: "الجونة" },
      { value: "safaga", labelEn: "Safaga", labelAr: "سفاجا" },
      { value: "marsa-alam", labelEn: "Marsa Alam", labelAr: "مرسى علم" },
    ],
  },
  {
    value: "cairo",
    labelEn: "Cairo",
    labelAr: "القاهرة",
    cities: [
      { value: "nasr-city", labelEn: "Nasr City", labelAr: "مدينة نصر" },
      { value: "heliopolis", labelEn: "Heliopolis", labelAr: "مصر الجديدة" },
      { value: "new-cairo", labelEn: "New Cairo", labelAr: "القاهرة الجديدة" },
      { value: "maadi", labelEn: "Maadi", labelAr: "المعادي" },
      { value: "shorouk", labelEn: "El Shorouk", labelAr: "الشروق" },
      { value: "obour", labelEn: "El Obour", labelAr: "العبور" },
    ],
  },
  {
    value: "giza",
    labelEn: "Giza",
    labelAr: "الجيزة",
    cities: [
      { value: "dokki", labelEn: "Dokki", labelAr: "الدقي" },
      { value: "mohandessin", labelEn: "Mohandessin", labelAr: "المهندسين" },
      { value: "6-october", labelEn: "6th of October", labelAr: "6 أكتوبر" },
      { value: "sheikh-zayed", labelEn: "Sheikh Zayed", labelAr: "الشيخ زايد" },
      { value: "haram", labelEn: "Haram", labelAr: "الهرم" },
      { value: "faisal", labelEn: "Faisal", labelAr: "فيصل" },
    ],
  },
  {
    value: "alexandria",
    labelEn: "Alexandria",
    labelAr: "الإسكندرية",
    cities: [
      { value: "sidi-gaber", labelEn: "Sidi Gaber", labelAr: "سيدي جابر" },
      { value: "smouha", labelEn: "Smouha", labelAr: "سموحة" },
      { value: "miami", labelEn: "Miami", labelAr: "ميامي" },
      { value: "mandara", labelEn: "Mandara", labelAr: "المندرة" },
      { value: "agami", labelEn: "Agami", labelAr: "العجمي" },
    ],
  },
  {
    value: "dakahlia",
    labelEn: "Dakahlia",
    labelAr: "الدقهلية",
    cities: [
      { value: "mansoura", labelEn: "Mansoura", labelAr: "المنصورة" },
      { value: "talkha", labelEn: "Talkha", labelAr: "طلخا" },
      { value: "mit-ghamr", labelEn: "Mit Ghamr", labelAr: "ميت غمر" },
    ],
  },
  {
    value: "sharqia",
    labelEn: "Sharqia",
    labelAr: "الشرقية",
    cities: [
      { value: "zagazig", labelEn: "Zagazig", labelAr: "الزقازيق" },
      { value: "10th-ramadan", labelEn: "10th of Ramadan", labelAr: "العاشر من رمضان" },
      { value: "bilbeis", labelEn: "Bilbeis", labelAr: "بلبيس" },
    ],
  },
  {
    value: "gharbia",
    labelEn: "Gharbia",
    labelAr: "الغربية",
    cities: [
      { value: "tanta", labelEn: "Tanta", labelAr: "طنطا" },
      { value: "mahalla", labelEn: "El Mahalla", labelAr: "المحلة الكبرى" },
    ],
  },
  {
    value: "menoufia",
    labelEn: "Menoufia",
    labelAr: "المنوفية",
    cities: [
      { value: "shebin", labelEn: "Shebin El Kom", labelAr: "شبين الكوم" },
      { value: "menouf", labelEn: "Menouf", labelAr: "منوف" },
      { value: "ashmoun", labelEn: "Ashmoun", labelAr: "أشمون" },
    ],
  },
  {
    value: "qalyubia",
    labelEn: "Qalyubia",
    labelAr: "القليوبية",
    cities: [
      { value: "banha", labelEn: "Banha", labelAr: "بنها" },
      { value: "shubra", labelEn: "Shubra El Kheima", labelAr: "شبرا الخيمة" },
      { value: "qalyub", labelEn: "Qalyub", labelAr: "قليوب" },
    ],
  },
  {
    value: "beheira",
    labelEn: "Beheira",
    labelAr: "البحيرة",
    cities: [
      { value: "damanhur", labelEn: "Damanhur", labelAr: "دمنهور" },
      { value: "kafr-el-dawar", labelEn: "Kafr El Dawar", labelAr: "كفر الدوار" },
    ],
  },
  {
    value: "kafr-el-sheikh",
    labelEn: "Kafr El Sheikh",
    labelAr: "كفر الشيخ",
    cities: [
      { value: "kafr-el-sheikh-city", labelEn: "Kafr El Sheikh", labelAr: "كفر الشيخ" },
      { value: "desouk", labelEn: "Desouk", labelAr: "دسوق" },
    ],
  },
  {
    value: "damietta",
    labelEn: "Damietta",
    labelAr: "دمياط",
    cities: [
      { value: "damietta-city", labelEn: "Damietta", labelAr: "دمياط" },
      { value: "new-damietta", labelEn: "New Damietta", labelAr: "دمياط الجديدة" },
      { value: "ras-el-bar", labelEn: "Ras El Bar", labelAr: "رأس البر" },
    ],
  },
  {
    value: "port-said",
    labelEn: "Port Said",
    labelAr: "بورسعيد",
    cities: [{ value: "port-said-city", labelEn: "Port Said", labelAr: "بورسعيد" }],
  },
  {
    value: "ismailia",
    labelEn: "Ismailia",
    labelAr: "الإسماعيلية",
    cities: [{ value: "ismailia-city", labelEn: "Ismailia", labelAr: "الإسماعيلية" }],
  },
  {
    value: "suez",
    labelEn: "Suez",
    labelAr: "السويس",
    cities: [{ value: "suez-city", labelEn: "Suez", labelAr: "السويس" }],
  },
  {
    value: "fayoum",
    labelEn: "Fayoum",
    labelAr: "الفيوم",
    cities: [{ value: "fayoum-city", labelEn: "Fayoum", labelAr: "الفيوم" }],
  },
  {
    value: "beni-suef",
    labelEn: "Beni Suef",
    labelAr: "بني سويف",
    cities: [{ value: "beni-suef-city", labelEn: "Beni Suef", labelAr: "بني سويف" }],
  },
  {
    value: "minya",
    labelEn: "Minya",
    labelAr: "المنيا",
    cities: [{ value: "minya-city", labelEn: "Minya", labelAr: "المنيا" }],
  },
  {
    value: "assiut",
    labelEn: "Assiut",
    labelAr: "أسيوط",
    cities: [{ value: "assiut-city", labelEn: "Assiut", labelAr: "أسيوط" }],
  },
  {
    value: "sohag",
    labelEn: "Sohag",
    labelAr: "سوهاج",
    cities: [{ value: "sohag-city", labelEn: "Sohag", labelAr: "سوهاج" }],
  },
  {
    value: "qena",
    labelEn: "Qena",
    labelAr: "قنا",
    cities: [{ value: "qena-city", labelEn: "Qena", labelAr: "قنا" }],
  },
  {
    value: "luxor",
    labelEn: "Luxor",
    labelAr: "الأقصر",
    cities: [{ value: "luxor-city", labelEn: "Luxor", labelAr: "الأقصر" }],
  },
  {
    value: "aswan",
    labelEn: "Aswan",
    labelAr: "أسوان",
    cities: [{ value: "aswan-city", labelEn: "Aswan", labelAr: "أسوان" }],
  },
  {
    value: "south-sinai",
    labelEn: "South Sinai",
    labelAr: "جنوب سيناء",
    cities: [
      { value: "sharm-el-sheikh", labelEn: "Sharm El Sheikh", labelAr: "شرم الشيخ" },
      { value: "dahab", labelEn: "Dahab", labelAr: "دهب" },
      { value: "nuweiba", labelEn: "Nuweiba", labelAr: "نويبع" },
    ],
  },
  {
    value: "north-sinai",
    labelEn: "North Sinai",
    labelAr: "شمال سيناء",
    cities: [{ value: "arish", labelEn: "Arish", labelAr: "العريش" }],
  },
  {
    value: "matrouh",
    labelEn: "Matrouh",
    labelAr: "مطروح",
    cities: [
      { value: "marsa-matrouh", labelEn: "Marsa Matrouh", labelAr: "مرسى مطروح" },
      { value: "north-coast", labelEn: "North Coast", labelAr: "الساحل الشمالي" },
      { value: "siwa", labelEn: "Siwa", labelAr: "سيوة" },
    ],
  },
  {
    value: "new-valley",
    labelEn: "New Valley",
    labelAr: "الوادي الجديد",
    cities: [{ value: "kharga", labelEn: "Kharga", labelAr: "الخارجة" }],
  },
];

const COUNTRY_CODES = [
  { value: "+20", labelEn: "Egypt", labelAr: "مصر", flag: "🇪🇬" },
  { value: "+966", labelEn: "Saudi Arabia", labelAr: "السعودية", flag: "🇸🇦" },
  { value: "+971", labelEn: "UAE", labelAr: "الإمارات", flag: "🇦🇪" },
  { value: "+965", labelEn: "Kuwait", labelAr: "الكويت", flag: "🇰🇼" },
  { value: "+974", labelEn: "Qatar", labelAr: "قطر", flag: "🇶🇦" },
  { value: "+973", labelEn: "Bahrain", labelAr: "البحرين", flag: "🇧🇭" },
  { value: "+968", labelEn: "Oman", labelAr: "عمان", flag: "🇴🇲" },
  { value: "+962", labelEn: "Jordan", labelAr: "الأردن", flag: "🇯🇴" },
  { value: "+961", labelEn: "Lebanon", labelAr: "لبنان", flag: "🇱🇧" },
  { value: "+1", labelEn: "USA / Canada", labelAr: "أمريكا / كندا", flag: "🇺🇸" },
  { value: "+44", labelEn: "United Kingdom", labelAr: "بريطانيا", flag: "🇬🇧" },
  { value: "+49", labelEn: "Germany", labelAr: "ألمانيا", flag: "🇩🇪" },
];

const formSchema = z
  .object({
    customerName: z.string().min(2, "Required"),
    countryCode: z.string().min(1, "Required"),
    whatsappNumber: z.string().min(8, "Invalid number"),
    governorate: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    deliveryType: z.enum(["HOME", "HOTEL"]),
    address: z.string().optional(),
    hotelName: z.string().optional(),
    guestName: z.string().optional(),
    roomNumber: z.string().optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"]),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "HOME" && !data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Required",
      });
    }

    if (data.deliveryType === "HOTEL") {
      if (!data.hotelName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hotelName"],
          message: "Required",
        });
      }

      if (!data.guestName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guestName"],
          message: "Required",
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

interface CheckoutClientProps {
  shippingFees: Record<string, number>;
}

export function CheckoutClient({ shippingFees }: CheckoutClientProps) {
  const t = useTranslations("checkout");
  const pt = useTranslations("payment");
  const locale = useLocale();
  const router = useRouter();

  const { items, total, clearCart, isHydrated } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const idempotencyKeyRef = useRef("");

  const isAr = locale === "ar";

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
      paymentMethod: "CASH_ON_DELIVERY",
      governorate: "",
      city: "",
      countryCode: "+20",
      whatsappNumber: "",
    },
  });

  const governorate = watch("governorate");
  const city = watch("city");
  const countryCode = watch("countryCode");
  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");

  const selectedGovernorate = useMemo(
    () => EGYPT_LOCATIONS.find((item) => item.value === governorate),
    [governorate],
  );

  const cityOptions = selectedGovernorate?.cities || [];

  const shipping = shippingFees["ALL_EGYPT"] ?? shippingFees["DEFAULT"] ?? 200;

  const grandTotal = total + shipping;

  const deliveryOptions = [
    {
      value: "HOME" as const,
      title: t("homeDelivery"),
      icon: Home,
    },
    {
      value: "HOTEL" as const,
      title: t("hotelDelivery"),
      icon: Hotel,
    },
  ];

  const paymentOptions = [
    {
      value: "CASH_ON_DELIVERY" as const,
      title: pt("cash"),
      icon: Banknote,
    },
    {
      value: "VODAFONE_CASH" as const,
      title: pt("vodafone"),
      icon: Smartphone,
    },
    {
      value: "INSTAPAY" as const,
      title: pt("instapay"),
      icon: Landmark,
    },
  ];

  function getLocationLabel(item: { labelEn: string; labelAr: string }) {
    return isAr ? item.labelAr : item.labelEn;
  }

  function getCountryLabel(item: {
    value: string;
    labelEn: string;
    labelAr: string;
    flag: string;
  }) {
    return `${item.flag} ${item.value}`;
  }

  async function onSubmit(data: FormData) {
    if (items.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const governorateItem = EGYPT_LOCATIONS.find(
        (item) => item.value === data.governorate,
      );

      const cityItem = governorateItem?.cities.find(
        (item) => item.value === data.city,
      );

      const governorateLabel = governorateItem
        ? getLocationLabel(governorateItem)
        : data.governorate;

      const cityLabel = cityItem ? getLocationLabel(cityItem) : data.city;

      const cleanLocalNumber = data.whatsappNumber
        .replace(/[^\d]/g, "")
        .replace(/^0+/, "");

      const fullWhatsappNumber = `${data.countryCode}${cleanLocalNumber}`;

      const orderPayload = {
        ...data,
        whatsappNumber: fullWhatsappNumber,
        governorate: governorateLabel,
        city: cityLabel,
        locationKey: data.city,
        governorateKey: data.governorate,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        locale,
      };

      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = globalThis.crypto?.randomUUID?.().replace(/-/g, "") ||
          `${Date.now()}${Math.random().toString(36).slice(2)}`;
      }

      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (result.success && result.order?.accessToken) {
        clearCart();
        router.push(`/${locale}/order-success/${result.order.accessToken}`);
      } else {
        console.error("Checkout error:", result);
        setError(t("orderError"));
      }
    } catch (err) {
      console.error(err);
      setError(t("networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <main className="page-safe-top">
        <div className="container flex min-h-[45vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-safe-top bg-gradient-to-b from-white via-gray-50/60 to-white">
        <div className="container pb-14">
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-14 text-center shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-muted-foreground">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <h2 className="mb-2 text-2xl font-extrabold text-gray-950">
              {t("title")}
            </h2>

            <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
              {t("emptyCart")}
            </p>

            <Button asChild className="rounded-2xl font-bold">
              <Link href={`/${locale}/shop`}>{t("continueShopping")}</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />

      <div className="container relative page-safe-top pb-28 md:pb-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl px-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={`/${locale}/shop`}>
              <ChevronLeft className="me-1 h-4 w-4 rtl:rotate-180" />
              {t("backToShop")}
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
            {/* Summary first on mobile, right on desktop */}
            <aside className="order-1 lg:order-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03] sm:p-5 lg:sticky lg:top-24">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl lg:text-xl">
                      {t("title")}
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("orderSummary")}
                    </p>
                  </div>

                  <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-xs font-bold text-brand-coral">
                    {t("itemCount", { count: items.length })}
                  </span>
                </div>

                <div className="max-h-[230px] space-y-2 overflow-y-auto pr-1 sm:max-h-[280px] lg:max-h-[360px]">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex gap-3 rounded-2xl bg-gray-50/80 p-2"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white sm:h-16 sm:w-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-bold text-gray-950">
                          {item.name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
                          <span>×{item.quantity}</span>
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span>{item.size}</span>}
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-extrabold text-gray-950 sm:text-sm">
                        {formatPrice(item.finalPrice * item.quantity, locale)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t("subtotal")}
                    </span>
                    <span className="font-bold text-gray-950">
                      {formatPrice(total, locale)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t("shipping")}
                    </span>
                    <span className="font-bold text-gray-950">
                      {shipping === 0
                        ? t("freeShipping")
                        : formatPrice(shipping, locale)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-extrabold text-gray-950">
                    {t("total")}
                  </span>
                  <span className="text-xl font-extrabold text-brand-coral">
                    {formatPrice(grandTotal, locale)}
                  </span>
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm font-semibold text-destructive">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-5 hidden h-12 w-full rounded-2xl text-sm font-extrabold shadow-lg shadow-brand-coral/25 md:flex"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("placeOrder")
                  )}
                </Button>

                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  {t("checkoutNote")}
                </p>
              </div>
            </aside>

            {/* Data form */}
            <section className="order-2 lg:order-1">
              <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03] sm:p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-gray-950 sm:text-2xl">
                    {t("customerInfo")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Contact */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-bold">{t("fullName")}</Label>
                      <div className="relative mt-1.5">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...register("customerName")}
                          autoComplete="name"
                          className="h-11 rounded-2xl border-gray-200 bg-gray-50/70 pl-10 shadow-none focus-visible:ring-brand-coral/30"
                        />
                      </div>
                      {errors.customerName && (
                        <p className="mt-1.5 text-xs font-semibold text-destructive">
                          {t("required")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="font-bold">{t("whatsapp")}</Label>

                      <div className="mt-1.5 grid grid-cols-[122px_1fr] gap-2">
                        <Select
                          value={countryCode}
                          onValueChange={(value) =>
                            setValue("countryCode", value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="h-11 rounded-2xl border-gray-200 bg-gray-50/70 px-3 shadow-none focus:ring-brand-coral/30">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent className="max-h-[280px]">
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {getCountryLabel(country)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            {...register("whatsappNumber")}
                            placeholder="1000000000"
                            inputMode="tel"
                            autoComplete="tel"
                            className="h-11 rounded-2xl border-gray-200 bg-gray-50/70 pl-10 shadow-none focus-visible:ring-brand-coral/30"
                          />
                        </div>
                      </div>

                      {errors.whatsappNumber && (
                        <p className="mt-1.5 text-xs font-semibold text-destructive">
                          {t("invalidWhatsapp")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-bold">{t("governorate")}</Label>
                      <Select
                        value={governorate}
                        onValueChange={(value) => {
                          setValue("governorate", value, {
                            shouldValidate: true,
                          });
                          setValue("city", "", { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus:ring-brand-coral/30">
                          <SelectValue placeholder={t("selectGovernorate")} />
                        </SelectTrigger>

                        <SelectContent className="max-h-[300px]">
                          {EGYPT_LOCATIONS.map((gov) => (
                            <SelectItem key={gov.value} value={gov.value}>
                              {getLocationLabel(gov)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {errors.governorate && (
                        <p className="mt-1.5 text-xs font-semibold text-destructive">
                          {t("required")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="font-bold">{t("city")}</Label>
                      <Select
                        value={city}
                        disabled={!selectedGovernorate}
                        onValueChange={(value) =>
                          setValue("city", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus:ring-brand-coral/30 disabled:opacity-60">
                          <SelectValue placeholder={t("selectCity")} />
                        </SelectTrigger>

                        <SelectContent className="max-h-[300px]">
                          {cityOptions.map((cityItem) => (
                            <SelectItem
                              key={cityItem.value}
                              value={cityItem.value}
                            >
                              {getLocationLabel(cityItem)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {errors.city && (
                        <p className="mt-1.5 text-xs font-semibold text-destructive">
                          {t("required")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery + Payment compact */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="font-bold">{t("deliveryType")}</Label>
                      <Select
                        value={deliveryType}
                        onValueChange={(value) =>
                          setValue(
                            "deliveryType",
                            value as FormData["deliveryType"],
                          )
                        }
                      >
                        <SelectTrigger className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus:ring-brand-coral/30">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {deliveryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                {option.title}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-bold">{t("paymentMethod")}</Label>
                      <Select
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setValue(
                            "paymentMethod",
                            value as FormData["paymentMethod"],
                          )
                        }
                      >
                        <SelectTrigger className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus:ring-brand-coral/30">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {paymentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                {option.title}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {deliveryType === "HOME" && (
                    <div>
                      <Label className="font-bold">{t("address")}</Label>
                      <Textarea
                        {...register("address")}
                        placeholder={t("addressPlaceholder")}
                        className="mt-1.5 min-h-[96px] rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus-visible:ring-brand-coral/30"
                      />
                      {errors.address && (
                        <p className="mt-1.5 text-xs font-semibold text-destructive">
                          {t("required")}
                        </p>
                      )}
                    </div>
                  )}

                  {deliveryType === "HOTEL" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <Label className="font-bold">{t("hotelName")}</Label>
                        <Input
                          {...register("hotelName")}
                          className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus-visible:ring-brand-coral/30"
                        />
                        {errors.hotelName && (
                          <p className="mt-1.5 text-xs font-semibold text-destructive">
                            {t("required")}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="font-bold">{t("guestName")}</Label>
                        <Input
                          {...register("guestName")}
                          className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus-visible:ring-brand-coral/30"
                        />
                        {errors.guestName && (
                          <p className="mt-1.5 text-xs font-semibold text-destructive">
                            {t("required")}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="font-bold">{t("roomNumber")}</Label>
                        <Input
                          {...register("roomNumber")}
                          className="mt-1.5 h-11 rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus-visible:ring-brand-coral/30"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="font-bold">{t("notes")}</Label>
                    <Textarea
                      {...register("notes")}
                      placeholder={t("notesPlaceholder")}
                      className="mt-1.5 min-h-[86px] rounded-2xl border-gray-200 bg-gray-50/70 shadow-none focus-visible:ring-brand-coral/30"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Mobile Sticky Bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("total")}
                </p>
                <p className="truncate text-lg font-extrabold text-brand-coral">
                  {formatPrice(grandTotal, locale)}
                </p>
              </div>

              <Button
                type="submit"
                className="h-12 min-w-[155px] rounded-2xl text-sm font-extrabold shadow-lg shadow-brand-coral/25"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t("placeOrder")
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
