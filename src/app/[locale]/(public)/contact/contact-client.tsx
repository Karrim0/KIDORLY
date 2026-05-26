"use client";

import { useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SETTING_KEYS } from "@/lib/settings";

function normalizeWhatsAppNumber(phone?: string | null) {
  if (!phone) return "";
  return phone.replace(/[^\d]/g, "");
}

function buildWhatsAppUrl(phone?: string | null, message = "") {
  const cleanPhone = normalizeWhatsAppNumber(phone);

  if (!cleanPhone) return "#";

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}${
    encodedMessage ? `?text=${encodedMessage}` : ""
  }`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.01 3.2C9.02 3.2 3.34 8.83 3.34 15.75c0 2.25.6 4.45 1.75 6.38L3.2 28.8l6.85-1.8a12.7 12.7 0 0 0 5.96 1.5c6.99 0 12.67-5.63 12.67-12.55S23 3.2 16.01 3.2Zm0 23.17c-1.9 0-3.75-.5-5.37-1.45l-.38-.22-4.06 1.07 1.08-3.93-.25-.4a10.4 10.4 0 0 1-1.6-5.5c0-5.75 4.74-10.42 10.58-10.42S26.6 10.2 26.6 15.95 21.85 26.37 16.01 26.37Zm5.8-7.8c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.7.16-.21.31-.8 1.03-.98 1.24-.18.2-.36.23-.68.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.58-1.86-1.76-2.17-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.21 0-.54.08-.82.39-.29.31-1.08 1.05-1.08 2.56s1.1 2.97 1.26 3.18c.16.21 2.16 3.28 5.23 4.6.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.88-.76 2.14-1.5.27-.73.27-1.36.19-1.5-.08-.13-.29-.21-.61-.36Z" />
    </svg>
  );
}

export function ContactClient({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const t = useTranslations("contact");

  const whatsapp = settings[SETTING_KEYS.WHATSAPP_NUMBER];
  const email = settings[SETTING_KEYS.CONTACT_EMAIL];
  const phone = settings[SETTING_KEYS.CONTACT_PHONE];
  const instagram = settings[SETTING_KEYS.INSTAGRAM];
  const facebook = settings[SETTING_KEYS.FACEBOOK];

  const whatsappMessage = t("whatsappMessage");

  const channels = [
    whatsapp && {
      icon: WhatsAppIcon,
      label: t("whatsapp"),
      value: whatsapp,
      href: buildWhatsAppUrl(whatsapp, whatsappMessage),
      external: true,
      color: "border-emerald-200 bg-emerald-50 text-emerald-600",
      iconBg: "bg-white text-emerald-600",
    },
    email && {
      icon: Mail,
      label: t("email"),
      value: email,
      href: `mailto:${email}`,
      external: false,
      color: "border-blue-200 bg-blue-50 text-blue-600",
      iconBg: "bg-white text-blue-600",
    },
    phone && {
      icon: Phone,
      label: t("phone"),
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
      external: false,
      color: "border-purple-200 bg-purple-50 text-purple-600",
      iconBg: "bg-white text-purple-600",
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    value: string;
    href: string;
    external: boolean;
    color: string;
    iconBg: string;
  }[];

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14 sm:pb-16">
        <section className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-white/85 p-6 text-center shadow-[0_14px_44px_rgba(15,23,42,0.09)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-coral/10 text-brand-coral">
              <Headphones className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          {/* Channels */}
          {channels.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className={`group flex items-center gap-4 rounded-3xl border p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)] sm:p-5 ${channel.color}`}
                >
                  <div
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-14 sm:w-14 ${channel.iconBg}`}
                  >
                    <channel.icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold sm:text-base">
                      {channel.label}
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold opacity-80">
                      {channel.value}
                    </p>
                  </div>

                  <ArrowUpRight className="h-5 w-5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-bold text-gray-950">{t("noChannels")}</p>
            </div>
          )}

          {/* Social */}
          {(instagram || facebook) && (
            <div className="mt-8 rounded-[2rem] border border-gray-100 bg-white p-5 text-center shadow-[0_12px_34px_rgba(15,23,42,0.07)] sm:p-6">
              <h3 className="mb-4 text-base font-extrabold text-gray-950">
                {t("followUs")}
              </h3>

              <div className="flex justify-center gap-3">
                {instagram && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full border-gray-200 bg-white shadow-sm hover:border-brand-coral hover:bg-brand-coral hover:text-white"
                    asChild
                  >
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                )}

                {facebook && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full border-gray-200 bg-white shadow-sm hover:border-brand-ocean hover:bg-brand-ocean hover:text-white"
                    asChild
                  >
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}