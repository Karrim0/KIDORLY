"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Banknote,
  ChevronRight,
  Headphones,
  Landmark,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const locale = useLocale();
  const why = useTranslations("whyUs");
  const sections = useTranslations("sections");
  const delivery = useTranslations("delivery");
  const payment = useTranslations("payment");

  const benefits = [
    { icon: ShieldCheck, title: why("quality"), desc: why("qualityDesc"), tone: "bg-brand-coral/10 text-brand-coral" },
    { icon: Truck, title: why("delivery"), desc: why("deliveryDesc"), tone: "bg-brand-sky/12 text-brand-ocean" },
    { icon: PackageCheck, title: delivery("safeHandling"), desc: delivery("safeHandlingDesc"), tone: "bg-violet-100 text-violet-600" },
    { icon: Headphones, title: why("support"), desc: why("supportDesc"), tone: "bg-emerald-100 text-emerald-600" },
  ];

  const paymentMethods = [
    { icon: Banknote, label: payment("cash") },
    { icon: Smartphone, label: payment("vodafone") },
    { icon: Landmark, label: payment("instapay") },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7fafc] py-12 sm:py-16 md:py-20">
      <div className="pointer-events-none absolute -start-28 top-8 h-72 w-72 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-28 bottom-0 h-72 w-72 rounded-full bg-brand-sky/12 blur-3xl" />

      <div className="container relative">
        <Reveal>
          <div className="mb-7 flex items-end justify-between gap-4 md:mb-10">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[.16em] text-brand-coral">Kidorly care</p>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-4xl">{sections("whyChooseUs")}</h2>
            </div>
            <Link href={`/${locale}/faq`} className="hidden min-h-11 items-center gap-1 rounded-full bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-brand-coral sm:inline-flex">
              {sections("faqPreview")}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </Reveal>

        <div className="category-scroll-snap scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
          {benefits.map((item, index) => (
            <Reveal key={item.title} delay={index * 70} className="w-[74vw] max-w-[285px] shrink-0 snap-center md:w-auto md:max-w-none">
              <article className="h-full rounded-[1.6rem] border border-white bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-900/[.03] transition duration-300 md:hover:-translate-y-1 md:hover:shadow-[0_18px_42px_rgba(15,23,42,.11)]">
                <span className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl", item.tone)}>
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-5 overflow-hidden rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,.16)] sm:p-7 md:mt-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-coral text-white">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-black sm:text-lg">{sections("deliveryAcrossEgypt")}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-white/65 sm:text-sm">{delivery("subtitle")}</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-brand-sun">{delivery("note")}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 md:mt-0 md:max-w-[380px] md:justify-end">
              {paymentMethods.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 text-xs font-extrabold text-white/90">
                  <Icon className="h-4 w-4 text-brand-sun" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
