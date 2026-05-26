"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Globe, ChevronDown, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { localeNames, type Locale } from "@/lib/i18n";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const { count, setIsOpen } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const navLinks = [
    { href: `/${locale}`, label: t("common.home") },
    { href: `/${locale}/shop`, label: t("common.shop") },
    { href: `/${locale}/brands`, label: t("common.brands") },
    { href: `/${locale}/offers`, label: t("common.offers") },
    { href: `/${locale}/contact`, label: t("common.contact") },
    { href: `/${locale}/faq`, label: t("common.faq") },
  ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 32);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!langRef.current) return;

      if (!langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }

    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setLangOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;

    router.push(segments.join("/"));

    setLangOpen(false);
    setMobileOpen(false);
  }

  function openCart() {
    setMobileOpen(false);
    setIsOpen(true);
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "transition-all duration-500 ease-out",
        isTransparent
          ? "border-b border-white/10 bg-black/10 backdrop-blur-[2px]"
          : "border-b border-border/50 bg-white/95 shadow-[0_2px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl",
      )}
    >
      <div className="container flex h-14 items-center justify-between gap-2 px-4 sm:h-16 md:h-[72px] md:gap-4 md:px-6">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          aria-label="Kidorly home"
          className="flex shrink-0 items-center"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="Kidorly"
            width={160}
            height={56}
            priority
            className={cn(
              "h-8 w-auto object-contain transition-all duration-300 sm:h-9 md:h-12",
              isTransparent &&
                "brightness-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]",
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                  isTransparent
                    ? active
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950",
                )}
              >
                {link.label}

                {active && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full",
                      isTransparent
                        ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                        : "bg-primary",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 md:gap-2">
          {/* Language */}
          <div ref={langRef} className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Change language"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((prev) => !prev)}
              className={cn(
                "h-8 rounded-xl px-2 text-xs font-semibold transition-colors duration-300 sm:h-9 sm:px-3",
                "gap-1",
                isTransparent
                  ? "text-white/95 hover:bg-white/10 hover:text-white"
                  : "text-gray-600 hover:text-gray-950",
              )}
            >
              <Globe className="h-4 w-4" />

              <span className="hidden sm:inline">{localeNames[locale]}</span>

              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  langOpen && "rotate-180",
                )}
              />
            </Button>

            {langOpen && (
              <div
                className={cn(
                  "absolute end-0 top-full z-50 mt-2 min-w-[150px]",
                  "rounded-2xl border border-border/70 bg-white p-1.5 shadow-xl",
                  "animate-in fade-in slide-in-from-top-1 duration-150",
                )}
              >
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([code, name]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => switchLocale(code)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-sm transition-colors",
                        locale === code
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-950",
                      )}
                    >
                      <span>{name}</span>

                      {locale === code && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link href={`/${locale}/wishlist`} aria-label="Wishlist">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-8 w-8 rounded-xl transition-colors duration-300 sm:h-9 sm:w-9 md:h-10 md:w-10",
                isTransparent
                  ? "text-white/95 hover:bg-white/10 hover:text-white"
                  : "text-gray-600 hover:text-gray-950",
              )}
            >
              <Heart className="h-4.5 w-4.5 md:h-5 md:w-5" />

              {wishlistCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-brand-coral px-1 text-[9px] font-bold leading-none text-white shadow-sm sm:h-5 sm:min-w-5 sm:text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            onClick={openCart}
            className={cn(
              "relative h-8 w-8 rounded-xl transition-colors duration-300 sm:h-9 sm:w-9 md:h-10 md:w-10",
              isTransparent
                ? "text-white/95 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:text-gray-950",
            )}
          >
            <ShoppingBag className="h-4.5 w-4.5 md:h-5 md:w-5" />

            {count > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-brand-coral px-1 text-[9px] font-bold leading-none text-white shadow-sm sm:h-5 sm:min-w-5 sm:text-[10px]">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              "h-8 w-8 rounded-xl transition-colors duration-300 sm:h-9 sm:w-9 md:hidden",
              isTransparent
                ? "text-white/95 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:text-gray-950",
            )}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-14 z-[-1] bg-black/20 backdrop-blur-[1px] sm:top-16"
            onClick={() => setMobileOpen(false)}
          />

          <nav
            className={cn(
              "border-t border-border/50 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]",
              "animate-in fade-in slide-in-from-top-2 duration-200",
            )}
          >
            <div className="max-h-[calc(100svh-56px)] overflow-y-auto px-4 py-3 sm:max-h-[calc(100svh-64px)]">
              <div className="space-y-1 rounded-2xl bg-gray-50/80 p-1.5">
                {navLinks.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                        active
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-700 hover:bg-white hover:text-gray-950",
                      )}
                    >
                      <span>{link.label}</span>

                      <span
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors",
                          active ? "bg-primary" : "bg-transparent",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/${locale}/wishlist`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:text-primary"
                >
                  <Heart className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={openCart}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-white px-3 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:text-primary"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t("common.cart")}</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
