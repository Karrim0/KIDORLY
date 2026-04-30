"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
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

  // Get the right template based on current locale
  const whatsappTemplate =
    settings[`whatsapp_template_${locale}`] || "Hello, I need help";

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
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <span className="text-2xl font-bold text-gradient font-display">
              {settings["brand_name"] || "Kidorly"}
            </span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex gap-3">
              {instagram && (
                 <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-brand-coral hover:text-white hover:border-brand-coral transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {facebook && (
                  <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-brand-ocean hover:text-white hover:border-brand-ocean transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}

              {whatsappNumber && (
                  <a
                  href={buildWhatsAppUrl(whatsappNumber, whatsappTemplate)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {settings["brand_name"] || "Kidorly"}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}