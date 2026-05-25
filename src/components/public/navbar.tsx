"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Globe, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
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
    function handleClick() {
      setLangOpen(false);
    }

    if (langOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [langOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}`, label: t("common.home") },
    { href: `/${locale}/shop`, label: t("common.shop") },
    { href: `/${locale}/brands`, label: t("common.brands") },
    { href: `/${locale}/offers`, label: t("common.offers") },
    { href: `/${locale}/contact`, label: t("common.contact") },
    { href: `/${locale}/faq`, label: t("common.faq") },
  ];

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
    setMobileOpen(false);
  }

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-500 ease-out",
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-[0_2px_20px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className="container flex h-16 md:h-[72px] items-center justify-between gap-2 md:gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Kidorly"
            width={160}
            height={56}
            priority
            className={cn(
              "h-8 sm:h-9 md:h-11 w-auto object-contain transition-all duration-300",
              isTransparent &&
                "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] brightness-110",
            )}
          />
        </Link>

        {/* Desktop Navigation */}
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
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
                )}
              >
                {link.label}

                {active && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 start-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                      isTransparent
                        ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                        : "bg-primary",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((prev) => !prev);
              }}
              className={cn(
                "h-9 px-2 sm:px-3 gap-1 rounded-xl font-medium transition-colors duration-300",
                isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Globe className="h-4 w-4" />

              <span className="hidden sm:inline text-xs">
                {localeNames[locale]}
              </span>

              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  langOpen && "rotate-180",
                )}
              />
            </Button>

            {langOpen && (
              <div className="absolute end-0 top-full mt-2 min-w-[150px] rounded-xl border bg-white p-1.5 shadow-xl z-50">
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([code, name]) => (
                    <button
                      key={code}
                      onClick={() => switchLocale(code)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-gray-50",
                        locale === code &&
                          "bg-primary/5 text-primary font-semibold",
                      )}
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link href={`/${locale}/wishlist`}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-9 w-9 md:h-10 md:w-10 rounded-xl transition-colors duration-300",
                isTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Heart className="h-5 w-5" />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-coral px-1 text-[10px] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-9 w-9 md:h-10 md:w-10 rounded-xl transition-colors duration-300",
              isTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900",
            )}
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />

            {count > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-coral px-1 text-[10px] font-bold text-white shadow-sm">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden h-9 w-9 rounded-xl transition-colors duration-300",
              isTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900",
            )}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
        <nav className="md:hidden bg-white border-t border-border/50 shadow-lg">
          <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-64px)] overflow-y-auto">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <span>{link.label}</span>

                  {active && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}