"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Mail, Phone, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SETTING_KEYS } from "@/lib/settings";

export function ContactClient({ settings }: { settings: Record<string, string> }) {
  const t = useTranslations("contact");
  const whatsapp = settings[SETTING_KEYS.WHATSAPP_NUMBER];
  const email = settings[SETTING_KEYS.CONTACT_EMAIL];
  const phone = settings[SETTING_KEYS.CONTACT_PHONE];

  const channels = [
    whatsapp && {
      icon: MessageCircle,
      label: t("whatsapp"),
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    email && {
      icon: Mail,
      label: t("email"),
      value: email,
      href: `mailto:${email}`,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    phone && {
      icon: Phone,
      label: t("phone"),
      value: phone,
      href: `tel:${phone}`,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ].filter(Boolean);

  return (
    <div className="container py-16 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        {channels.map((ch) => ch && (
          <a
            key={ch.label}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-5 rounded-2xl border ${ch.color} hover:shadow-md transition-shadow`}
          >
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <ch.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{ch.label}</p>
              <p className="text-sm opacity-80">{ch.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Social */}
      <div className="mt-12 text-center">
        <h3 className="font-semibold mb-4">{t("followUs")}</h3>
        <div className="flex justify-center gap-3">
          {settings[SETTING_KEYS.INSTAGRAM] && (
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href={settings[SETTING_KEYS.INSTAGRAM]} target="_blank" rel="noopener"><Instagram className="h-5 w-5" /></a>
            </Button>
          )}
          {settings[SETTING_KEYS.FACEBOOK] && (
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href={settings[SETTING_KEYS.FACEBOOK]} target="_blank" rel="noopener"><Facebook className="h-5 w-5" /></a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
