"use client";

import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Truck,
  Headphones,
  WalletCards,
  MapPinned,
  PackageCheck,
  Home,
  Banknote,
  Smartphone,
  Landmark,
} from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function WhyChooseUs() {
  const t = useTranslations("whyUs");
  const st = useTranslations("sections");

  const items = [
    {
      icon: ShieldCheck,
      title: t("quality"),
      desc: t("qualityDesc"),
      iconWrap: "bg-brand-coral/12 text-brand-coral",
      card: "from-brand-coral/10 via-white to-white",
    },
    {
      icon: Truck,
      title: t("delivery"),
      desc: t("deliveryDesc"),
      iconWrap: "bg-brand-sky/12 text-brand-sky",
      card: "from-brand-sky/10 via-white to-white",
    },
    {
      icon: Headphones,
      title: t("support"),
      desc: t("supportDesc"),
      iconWrap: "bg-emerald-100 text-emerald-600",
      card: "from-emerald-100/80 via-white to-white",
    },
    {
      icon: WalletCards,
      title: t("trust"),
      desc: t("trustDesc"),
      iconWrap: "bg-amber-100 text-amber-600",
      card: "from-amber-100/80 via-white to-white",
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 md:py-18 lg:py-20">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative">
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
              {st("whyChooseUs")}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br p-5 text-center",
                  item.card,
                  "shadow-[0_12px_34px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03]",
                  "transition-all duration-300 ease-out",
                  "md:p-6 md:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                  "md:hover:-translate-y-1 md:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
                )}
              >
                <div
                  className={cn(
                    "mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl shadow-sm sm:h-14 sm:w-14",
                    item.iconWrap,
                  )}
                >
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <h3 className="mb-2 text-base font-extrabold text-gray-950">
                  {item.title}
                </h3>

                <p className="mx-auto max-w-[250px] text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/*
  الاسم CityHighlight فضل زي ما هو عشان لو home-client مستدعيه بنفس الاسم الكود مايكسرش.
  لكن المحتوى بقى Delivery Across Egypt بشكل عام ومفيهوش أي مدن محددة.
*/
export function CityHighlight() {
  const t = useTranslations("delivery");
  const st = useTranslations("sections");

  const deliveryItems = [
    {
      icon: MapPinned,
      title: t("nationwide"),
      desc: t("nationwideDesc"),
      gradient: "from-brand-coral to-brand-coral/80",
      card: "from-brand-coral/10 via-white to-white",
      shadow: "shadow-brand-coral/20",
    },
    {
      icon: Home,
      title: t("doorstep"),
      desc: t("doorstepDesc"),
      gradient: "from-brand-sky to-brand-sky/80",
      card: "from-brand-sky/10 via-white to-white",
      shadow: "shadow-brand-sky/20",
    },
    {
      icon: PackageCheck,
      title: t("safeHandling"),
      desc: t("safeHandlingDesc"),
      gradient: "from-brand-ocean to-brand-ocean/80",
      card: "from-brand-ocean/10 via-white to-white",
      shadow: "shadow-brand-ocean/20",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/90 via-white to-white py-12 sm:py-14 md:py-18 lg:py-20">
      <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-coral/10 blur-3xl" />

      <div className="container relative">
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
              {st("deliveryAcrossEgypt")}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
          {deliveryItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br p-5 text-center",
                  item.card,
                  "shadow-[0_12px_34px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03]",
                  "transition-all duration-300 ease-out",
                  "md:p-7 md:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                  "md:hover:-translate-y-1 md:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
                )}
              >
                <div
                  className={cn(
                    "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                    item.gradient,
                    item.shadow,
                  )}
                >
                  <item.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="mb-1 text-base font-extrabold text-gray-950 sm:text-lg">
                  {item.title}
                </h3>

                <p className="mx-auto max-w-[240px] text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="mx-auto mt-7 max-w-xl text-center text-xs font-semibold leading-relaxed text-brand-coral sm:mt-8 sm:text-sm">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function PaymentMethodsSection() {
  const t = useTranslations("payment");
  const st = useTranslations("sections");

  const methods = [
    {
      label: t("cash"),
      desc: t("cashDesc"),
      icon: Banknote,
      card: "from-emerald-100/80 via-white to-white",
      iconWrap: "bg-emerald-100 text-emerald-600",
    },
    {
      label: t("vodafone"),
      desc: t("vodafoneDesc"),
      icon: Smartphone,
      card: "from-brand-coral/10 via-white to-white",
      iconWrap: "bg-brand-coral/12 text-brand-coral",
    },
    {
      label: t("instapay"),
      desc: t("instapayDesc"),
      icon: Landmark,
      card: "from-brand-sky/10 via-white to-white",
      iconWrap: "bg-brand-sky/12 text-brand-sky",
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 md:py-18 lg:py-20">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-sun/10 blur-3xl" />

      <div className="container relative">
        <Reveal>
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
              {st("paymentMethods")}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
          {methods.map((method, i) => (
            <Reveal key={method.label} delay={i * 90}>
              <article
                className={cn(
                  "group h-full rounded-3xl border border-gray-100 bg-gradient-to-br p-5 text-center",
                  method.card,
                  "shadow-[0_12px_34px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.03]",
                  "transition-all duration-300 ease-out",
                  "md:p-7 md:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                  "md:hover:-translate-y-1 md:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
                )}
              >
                <span
                  className={cn(
                    "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 md:group-hover:scale-110",
                    method.iconWrap,
                  )}
                >
                  <method.icon className="h-7 w-7" />
                </span>

                <h3 className="mb-1 text-base font-extrabold text-gray-950 sm:text-lg">
                  {method.label}
                </h3>

                <p className="mx-auto max-w-[230px] text-sm leading-relaxed text-muted-foreground">
                  {method.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}