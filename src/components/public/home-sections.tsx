"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Headphones,
  Landmark,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

function journeyCopy(locale: string) {
  if (locale === "ar") {
    return {
      eyebrow: "من الاختيار لحد باب البيت",
      title: "رحلة شراء بسيطة وواضحة",
      subtitle: "كل خطوة قدامك من غير تعقيد أو مفاجآت.",
      steps: [
        ["اختار المنتج", "فلتر حسب القسم أو العمر وشوف التفاصيل كاملة."],
        ["ضيف للسلة", "راجع اختيارك والسعر قبل ما تكمل بياناتك."],
        ["أكد الطلب", "ابعته مرة واحدة ونأكد معاك على واتساب."],
      ],
      shop: "ابدأ التسوق",
      careEyebrow: "Kidorly care",
      paymentTitle: "توصيل ودفع بالطريقة المريحة ليك",
    };
  }

  if (locale === "de") {
    return {
      eyebrow: "Von der Auswahl bis zur Haustür",
      title: "Ein klarer und einfacher Einkauf",
      subtitle: "Jeder Schritt ist sichtbar – ohne Überraschungen.",
      steps: [
        ["Produkt wählen", "Nach Kategorie oder Alter filtern und Details ansehen."],
        ["In den Warenkorb", "Auswahl und Preis vor dem Checkout prüfen."],
        ["Bestellung bestätigen", "Einmal absenden und über WhatsApp bestätigen."],
      ],
      shop: "Einkauf starten",
      careEyebrow: "Kidorly care",
      paymentTitle: "Lieferung und Zahlung, die zu dir passen",
    };
  }

  return {
    eyebrow: "From choice to your doorstep",
    title: "A simple, clear buying journey",
    subtitle: "Every step is visible, with no complexity or surprises.",
    steps: [
      ["Choose a product", "Filter by category or age and see every detail."],
      ["Add to cart", "Review your choice and price before checkout."],
      ["Confirm once", "Submit once and we confirm with you on WhatsApp."],
    ],
    shop: "Start shopping",
    careEyebrow: "Kidorly care",
    paymentTitle: "Delivery and payment that work for you",
  };
}

export function ExperienceSection() {
  const locale = useLocale();
  const copy = journeyCopy(locale);
  const why = useTranslations("whyUs");
  const sections = useTranslations("sections");
  const delivery = useTranslations("delivery");
  const payment = useTranslations("payment");

  const steps = [ShoppingBag, PackageCheck, CheckCircle2];
  const benefits = [
    { icon: ShieldCheck, title: why("quality"), desc: why("qualityDesc"), tone: "bg-[#fff0ef] text-brand-coral" },
    { icon: Truck, title: why("delivery"), desc: why("deliveryDesc"), tone: "bg-[#eaf9f7] text-brand-ocean" },
    { icon: PackageCheck, title: delivery("safeHandling"), desc: delivery("safeHandlingDesc"), tone: "bg-[#f3efff] text-violet-600" },
    { icon: Headphones, title: why("support"), desc: why("supportDesc"), tone: "bg-[#edfaf3] text-emerald-600" },
  ];
  const paymentMethods = [
    { icon: Banknote, label: payment("cash"), tone: "bg-[#fff5e1] text-amber-700" },
    { icon: Smartphone, label: payment("vodafone"), tone: "bg-[#fff0f0] text-red-600" },
    { icon: Landmark, label: payment("instapay"), tone: "bg-[#eef3ff] text-indigo-600" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-12 sm:py-16 lg:py-24">
      <div className="home-blob home-blob-coral -start-24 top-1/3" />
      <div className="home-blob home-blob-sky -end-24 bottom-10" />

      <div className="container relative space-y-12 sm:space-y-16">
        <div>
          <Reveal>
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-brand-coral sm:text-xs">
                {copy.eyebrow}
              </p>
              <h2 className="text-2xl font-black tracking-[-.035em] text-slate-950 sm:text-3xl lg:text-[2.65rem]">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-500 sm:text-base">
                {copy.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-brand-coral/30 via-brand-sky/40 to-brand-coral/30 md:block" />
            {copy.steps.map(([title, description], index) => {
              const Icon = steps[index];
              return (
                <Reveal key={title} delay={index * 90} className="relative">
                  <article className="group flex h-full gap-4 rounded-[1.6rem] border border-white bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,.11)] md:flex-col md:items-center md:p-6 md:text-center">
                    <span className={cn(
                      "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg",
                      index === 1 ? "bg-brand-sky shadow-brand-sky/25" : "bg-brand-coral shadow-brand-coral/25",
                    )}>
                      <Icon className="h-6 w-6" />
                      <span className="absolute -end-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[9px] font-black text-white">
                        {index + 1}
                      </span>
                    </span>
                    <div>
                      <h3 className="font-black text-slate-950 sm:text-lg">{title}</h3>
                      <p className="mt-1.5 text-xs font-medium leading-5 text-slate-500 sm:text-sm sm:leading-6">
                        {description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={220}>
            <div className="mt-6 text-center">
              <Link href={`/${locale}/shop`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-coral px-6 text-sm font-black text-white shadow-[0_14px_36px_rgba(255,107,107,.28)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(255,107,107,.36)]">
                {copy.shop}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <div className="mb-7 flex items-end justify-between gap-4 md:mb-9">
              <div className="max-w-xl">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-brand-ocean sm:text-xs">
                  {copy.careEyebrow}
                </p>
                <h2 className="text-2xl font-black tracking-[-.035em] text-slate-950 sm:text-3xl lg:text-[2.4rem]">
                  {sections("whyChooseUs")}
                </h2>
              </div>
              <Link href={`/${locale}/faq`} className="hidden h-11 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm transition hover:text-brand-coral sm:inline-flex">
                {sections("faqPreview")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {benefits.map((item, index) => (
              <Reveal key={item.title} delay={(index % 4) * 65} className="h-full">
                <article className="h-full rounded-[1.5rem] border border-white bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,.1)] sm:p-5">
                  <span className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12", item.tone)}>
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <h3 className="text-sm font-black leading-tight text-slate-950 sm:text-base">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[11px] font-medium leading-5 text-slate-500 sm:text-sm sm:leading-6">{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-5 overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-[#fff3f0] via-white to-[#eaf9f7] p-5 shadow-[0_16px_44px_rgba(15,23,42,.08)] sm:p-7 md:mt-8 md:flex md:items-center md:justify-between md:gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-coral shadow-md">
                    <Truck className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-black text-slate-950 sm:text-lg">{copy.paymentTitle}</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:text-sm">{delivery("subtitle")}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs font-extrabold text-brand-ocean">{delivery("note")}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mt-0 md:min-w-[390px]">
                {paymentMethods.map(({ icon: Icon, label, tone }) => (
                  <span key={label} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-center text-[11px] font-black shadow-sm sm:text-xs", tone)}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
