"use client";

import { useTranslations } from "next-intl";
import { Shield, Truck, MessageCircle, CreditCard, MapPin, Building2, Home } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

export function WhyChooseUs() {
  const t = useTranslations("whyUs");
  const st = useTranslations("sections");

  const items = [
    { icon: Shield, title: t("quality"), desc: t("qualityDesc"), gradient: "from-brand-coral/10 to-brand-coral/5", iconBg: "bg-brand-coral/15 text-brand-coral" },
    { icon: Truck, title: t("delivery"), desc: t("deliveryDesc"), gradient: "from-brand-sky/10 to-brand-sky/5", iconBg: "bg-brand-sky/15 text-brand-sky" },
    { icon: MessageCircle, title: t("support"), desc: t("supportDesc"), gradient: "from-emerald-100/80 to-emerald-50/50", iconBg: "bg-emerald-100 text-emerald-600" },
    { icon: CreditCard, title: t("trust"), desc: t("trustDesc"), gradient: "from-brand-sun/10 to-brand-sun/5", iconBg: "bg-amber-100 text-amber-600" },
  ];

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">{st("whyChooseUs")}</h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className={`text-center p-8 rounded-2xl bg-gradient-to-br ${item.gradient} card-hover border border-white/50`}>
                <div className={`h-14 w-14 rounded-2xl ${item.iconBg} flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CityHighlight() {
  const t = useTranslations("delivery");
  const st = useTranslations("sections");

  const cities = [
    { name: t("hurghada"), icon: Building2, subtitle: t("hotelDelivery"), gradient: "from-brand-coral to-brand-coral/80", shadow: "shadow-brand-coral/20" },
    { name: t("cairo"), icon: Home, subtitle: t("homeDelivery"), gradient: "from-brand-sky to-brand-sky/80", shadow: "shadow-brand-sky/20" },
    { name: t("alexandria"), icon: MapPin, subtitle: t("homeDelivery"), gradient: "from-brand-ocean to-brand-ocean/80", shadow: "shadow-brand-ocean/20" },
  ];

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="container">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{st("cityHighlight")}</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">{t("subtitle")}</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {cities.map((city, i) => (
            <Reveal key={city.name} delay={i * 120}>
              <div className="bg-white rounded-2xl p-8 text-center card-hover border">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${city.gradient} flex items-center justify-center mx-auto mb-4`}>
                  <city.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                <p className="text-sm text-muted-foreground">{city.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <p className="text-center mt-10 text-sm text-brand-coral font-semibold">
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
    { label: t("cash"), desc: t("cashDesc"), icon: "💵" },
    { label: t("vodafone"), desc: t("vodafoneDesc"), icon: "📱" },
    { label: t("instapay"), desc: t("instapayDesc"), icon: "🏦" },
  ];

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">{st("paymentMethods")}</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {methods.map((m, i) => (
            <Reveal key={m.label} delay={i * 100}>
              <div className="bg-white rounded-2xl border p-6 text-center card-hover">
                <span className="text-4xl mb-4 block">{m.icon}</span>
                <h3 className="font-semibold mb-1">{m.label}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}