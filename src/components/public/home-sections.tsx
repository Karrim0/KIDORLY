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
import { motion, useReducedMotion } from "motion/react";

import { KidorlyMascot } from "@/components/public/kidorly-mascot";
import { cn } from "@/lib/utils";

function journeyCopy(locale: string) {
  if (locale === "ar") {
    return {
      eyebrow: "من الاختيار لحد باب البيت",
      title: "رحلة شراء واضحة من أول ضغطة",
      subtitle: "كل خطوة قدامك من غير تعقيد أو مفاجآت.",
      steps: [
        ["اختار المنتج", "فلتر حسب القسم أو العمر وشوف التفاصيل."],
        ["راجع طلبك", "السعر والكمية والتوصيل واضحين قبل التأكيد."],
        ["استلم براحتك", "نتابع معاك على واتساب لحد وصول الطلب."],
      ],
      shop: "ابدأ التسوق",
      careEyebrow: "Kidorly care",
      paymentTitle: "توصيل ودفع بالطريقة المريحة ليك",
    };
  }

  if (locale === "de") {
    return {
      eyebrow: "Von der Auswahl bis zur Haustür",
      title: "Ein klarer Einkauf ab dem ersten Klick",
      subtitle: "Jeder Schritt ist sichtbar – ohne Überraschungen.",
      steps: [
        ["Produkt wählen", "Nach Kategorie oder Alter filtern und Details ansehen."],
        ["Bestellung prüfen", "Preis, Menge und Lieferung sind vorab klar."],
        ["Entspannt empfangen", "Wir begleiten dich per WhatsApp bis zur Lieferung."],
      ],
      shop: "Einkauf starten",
      careEyebrow: "Kidorly care",
      paymentTitle: "Lieferung und Zahlung, die zu dir passen",
    };
  }

  return {
    eyebrow: "From choice to your doorstep",
    title: "A clear journey from the first tap",
    subtitle: "Every step is visible, with no complexity or surprises.",
    steps: [
      ["Choose a product", "Filter by category or age and see the details."],
      ["Review your order", "Price, quantity and delivery are clear before confirmation."],
      ["Receive with ease", "We follow up on WhatsApp until your order arrives."],
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
  const reduceMotion = useReducedMotion();

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

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-70px" },
        transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#f7fbff_100%)] py-14 sm:py-20 lg:py-28">
      <div className="home-blob home-blob-coral -start-24 top-1/3" />
      <div className="home-blob home-blob-sky -end-24 bottom-10" />
      <div className="container relative space-y-14 sm:space-y-20">
        <div>
          <motion.div {...reveal} className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand-coral sm:text-xs">{copy.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.045em] text-slate-950 sm:text-4xl lg:text-5xl">{copy.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-500 sm:text-base">{copy.subtitle}</p>
            </div>
            <Link href={`/${locale}/shop`} className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-brand-coral px-6 text-sm font-black text-white shadow-[0_14px_36px_rgba(255,107,107,.26)] transition hover:-translate-y-1">
              {copy.shop}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </motion.div>

          <motion.div {...reveal} className="relative overflow-hidden rounded-[2.2rem] border border-white bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,.08)] backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="absolute -end-8 -top-8 opacity-20"><KidorlyMascot className="h-32 w-32" /></div>
            <div className="relative grid gap-3 md:grid-cols-3 md:gap-4">
              {copy.steps.map(([title, description], index) => {
                const Icon = steps[index];
                return (
                  <article key={title} className="relative flex items-start gap-4 rounded-[1.5rem] bg-slate-50/85 p-4 sm:p-5">
                    <span className={cn("relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg", index === 1 ? "bg-brand-sky" : "bg-brand-coral")}>
                      <Icon className="h-5 w-5" />
                      <span className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[8px] font-black">{index + 1}</span>
                    </span>
                    <div>
                      <h3 className="font-black text-slate-950">{title}</h3>
                      <p className="mt-1.5 text-xs font-medium leading-5 text-slate-500 sm:text-sm sm:leading-6">{description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div {...reveal} className="mb-8 max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand-ocean sm:text-xs">{copy.careEyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-.045em] text-slate-950 sm:text-4xl">{sections("whyChooseUs")}</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {benefits.map((item) => (
              <motion.article key={item.title} {...reveal} whileHover={reduceMotion ? undefined : { y: -5 }} className="h-full rounded-[1.6rem] border border-white bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,.06)] sm:p-5">
                <span className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12", item.tone)}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="text-sm font-black leading-tight text-slate-950 sm:text-base">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-[11px] font-medium leading-5 text-slate-500 sm:text-sm sm:leading-6">{item.desc}</p>
              </motion.article>
            ))}
          </div>

          <motion.div {...reveal} className="mt-5 overflow-hidden rounded-[2rem] border border-white bg-white/88 p-5 shadow-[0_18px_50px_rgba(15,23,42,.07)] sm:p-7 md:mt-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf9f7] text-brand-ocean"><Truck className="h-6 w-6" /></span>
                <div>
                  <h3 className="font-black text-slate-950 sm:text-lg">{copy.paymentTitle}</h3>
                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500 sm:text-sm">{delivery("subtitle")}</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-extrabold text-brand-ocean">{delivery("note")}</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 md:mt-0 md:min-w-[390px]">
              {paymentMethods.map(({ icon: Icon, label, tone }) => (
                <span key={label} className={cn("inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center text-[9px] font-black shadow-sm sm:flex-row sm:gap-2 sm:px-3 sm:text-xs", tone)}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
