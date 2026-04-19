"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

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
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-2xl font-bold text-gradient font-display">Kidorly</span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Support */}
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

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-brand-coral hover:text-white hover:border-brand-coral transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-brand-ocean hover:text-white hover:border-brand-ocean transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Kidorly. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
