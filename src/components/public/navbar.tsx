"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/lib/i18n";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { count, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClick() { setLangOpen(false); }
    if (langOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [langOpen]);

  const navLinks = [
    { href: `/${locale}`, label: t("common.home") },
    { href: `/${locale}/shop`, label: t("common.shop") },
    { href: `/${locale}/offers`, label: t("common.offers") },
    { href: `/${locale}/contact`, label: t("common.contact") },
    { href: `/${locale}/faq`, label: t("common.faq") },
  ];

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  /* On homepage + not scrolled + mobile menu closed = transparent */
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        /* ── Always fixed on top, full width ── */
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-500 ease-out",
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
      )}
    >
      <div className="container flex items-center justify-between h-[72px] gap-4">

        {/* ── Logo ── */}
        <Link href={`/${locale}`} className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Kidorly"
            width={160}
            height={56}
            priority
            className={cn(
              "h-10 md:h-11 w-auto object-contain transition-all duration-300",
              /* On transparent: add glow so logo pops on any image */
              isTransparent && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] brightness-110"
            )}
          />
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  isTransparent
                    ? active
                      ? "text-white bg-white/20 backdrop-blur-sm"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                    : active
                      ? "text-primary bg-primary/8"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                )}
              >
                {link.label}
                {active && (
                  <span className={cn(
                    "absolute -bottom-0.5 start-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                    isTransparent ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]" : "bg-primary"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">

          {/* Language */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
              className={cn(
                "gap-1.5 rounded-xl font-medium transition-colors duration-300",
                isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{localeNames[locale]}</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", langOpen && "rotate-180")} />
            </Button>
            {langOpen && (
              <div className="absolute end-0 top-full mt-2 bg-white rounded-xl shadow-xl border p-1.5 min-w-[150px] z-50">
                {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={cn(
                      "w-full text-start px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-50",
                      locale === code && "bg-primary/5 text-primary font-semibold"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative rounded-xl transition-colors duration-300",
              isTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900"
            )}
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -end-1 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-brand-coral text-white border-2 border-white shadow-sm">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden rounded-xl transition-colors duration-300",
              isTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t pb-4 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-6 py-3.5 text-sm font-medium transition-colors hover:bg-gray-50",
                pathname === link.href && "bg-primary/5 text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}