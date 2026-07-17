"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Instagram,
  Facebook,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type FooterProps = {
  settings?: Record<string, string>;
};

export function Footer({ settings = {} }: FooterProps) {
  const t = useTranslations();
  const locale = useLocale();

  const instagram = settings["social_instagram"];
  const facebook = settings["social_facebook"];
  const whatsappNumber = settings["whatsapp_number"];

  const brandName = settings["brand_name"] || "Kidorly";

  const whatsappTemplate =
    settings[`whatsapp_template_${locale}`] || t("footer.whatsappTemplate");

  const quickLinks = [
    { href: `/${locale}/shop`, label: t("common.shop") },
    { href: `/${locale}/offers`, label: t("common.offers") },
    { href: `/${locale}/faq`, label: t("common.faq") },
    { href: `/${locale}/contact`, label: t("common.contact") },
  ];

  const supportLinks = [
    { href: `/${locale}/policies`, label: t("common.policies") },
    { href: `/${locale}/faq`, label: t("common.faq") },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-gradient-to-b from-white via-gray-50/80 to-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link
              href={`/${locale}`}
              aria-label={`${brandName} home`}
              className="inline-flex items-center"
            >
              <Image
                src="/images/logo.webp"
                alt={brandName}
                width={170}
                height={60}
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-gray-950">
              {t("footer.quickLinks")}
            </h4>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-gray-950">
              {t("footer.support")}
            </h4>

            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-3 lg:col-span-4">
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-gray-950">
              {t("footer.followUs")}
            </h4>

            <p className="mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.socialDesc")}
            </p>

            <div className="flex flex-wrap gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-coral hover:bg-brand-coral hover:text-white hover:shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-ocean hover:bg-brand-ocean hover:text-white hover:shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={buildWhatsAppUrl(whatsappNumber, whatsappTemplate)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-md"
                  aria-label="WhatsApp"
                >
                  <svg
  viewBox="0 0 32 32"
  className="h-5 w-5"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M16.01 3.2C9.02 3.2 3.34 8.83 3.34 15.75c0 2.25.6 4.45 1.75 6.38L3.2 28.8l6.85-1.8a12.7 12.7 0 0 0 5.96 1.5c6.99 0 12.67-5.63 12.67-12.55S23 3.2 16.01 3.2Zm0 23.17c-1.9 0-3.75-.5-5.37-1.45l-.38-.22-4.06 1.07 1.08-3.93-.25-.4a10.4 10.4 0 0 1-1.6-5.5c0-5.75 4.74-10.42 10.58-10.42S26.6 10.2 26.6 15.95 21.85 26.37 16.01 26.37Zm5.8-7.8c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.7.16-.21.31-.8 1.03-.98 1.24-.18.2-.36.23-.68.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.58-1.86-1.76-2.17-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.21 0-.54.08-.82.39-.29.31-1.08 1.05-1.08 2.56s1.1 2.97 1.26 3.18c.16.21 2.16 3.28 5.23 4.6.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.88-.76 2.14-1.5.27-.73.27-1.36.19-1.5-.08-.13-.29-.21-.61-.36Z" />
</svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-5 sm:mt-12">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-start">
            <p>
              &copy; {new Date().getFullYear()} {brandName}.{" "}
              {t("footer.rights")}
            </p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
              <span>{t("footer.tagline")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
