"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Baby,
  ChevronDown,
  Globe,
  Grid3X3,
  Heart,
  Menu,
  ShoppingBag,
  Sparkles,
  Tags,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { localeNames, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type CatalogItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameDe: string;
  image?: string | null;
  icon?: string | null;
  logo?: string | null;
  featured?: boolean;
  sortOrder?: number;
  minAgeMonths?: number | null;
  maxAgeMonths?: number | null;
  children?: CatalogItem[];
  _count?: {
    products?: number;
  };
};

type CatalogMenuData = {
  categories: CatalogItem[];
  collections: CatalogItem[];
  ageGroups: CatalogItem[];
  brands: CatalogItem[];
};

const emptyCatalogData: CatalogMenuData = {
  categories: [],
  collections: [],
  ageGroups: [],
  brands: [],
};

function getLocalizedName(item: CatalogItem, locale: Locale) {
  if (locale === "ar") return item.nameAr || item.nameEn;
  if (locale === "de") return item.nameDe || item.nameEn;

  return item.nameEn;
}

function getProductsCountLabel(count: number, locale: Locale) {
  if (locale === "ar") {
    if (count === 1) return "منتج واحد";
    if (count === 2) return "منتجان";
    return `${count} منتجات`;
  }

  if (locale === "de") {
    return count === 1 ? "1 Produkt" : `${count} Produkte`;
  }

  return count === 1 ? "1 product" : `${count} products`;
}

function getCountBadge(count: number) {
  return count > 99 ? "99+" : String(count);
}

function getShopDescription(locale: Locale) {
  if (locale === "ar") {
    return "كل احتياجات الأطفال في مكان واحد: عربيات، سكوترات، هوفربوردز، كراسي، وأكتر.";
  }

  if (locale === "de") {
    return "Alles für Kinder an einem Ort: Kinderwagen, Scooter, Hoverboards und mehr.";
  }

  return "Everything kids need in one place: strollers, scooters, hoverboards, chairs, and more.";
}

function getEmptyLabel(locale: Locale) {
  if (locale === "ar") return "لا توجد عناصر حاليًا";
  if (locale === "de") return "Keine Elemente verfügbar";
  return "No items available";
}

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const { count, setIsOpen } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catalogData, setCatalogData] =
    useState<CatalogMenuData>(emptyCatalogData);

  const langRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const navLinks = useMemo(
    () => [
      { href: `/${locale}`, label: t("common.home") },
      { href: `/${locale}/brands`, label: t("common.brands") },
      { href: `/${locale}/offers`, label: t("common.offers") },
      { href: `/${locale}/contact`, label: t("common.contact") },
      { href: `/${locale}/faq`, label: t("common.faq") },
    ],
    [locale, t],
  );

  const isShopActive =
    pathname === `/${locale}/shop` ||
    pathname.startsWith(`/${locale}/shop/`) ||
    pathname.startsWith(`/${locale}/category/`);

  useEffect(() => {
    let mounted = true;

    async function loadCatalogMenu() {
      try {
        const response = await fetch("/api/catalog-menu", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as CatalogMenuData;

        if (mounted) {
          setCatalogData({
            categories: data.categories || [],
            collections: data.collections || [],
            ageGroups: data.ageGroups || [],
            brands: data.brands || [],
          });
        }
      } catch (error) {
        console.error("Failed to load catalog menu:", error);
      }
    }

    loadCatalogMenu();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 28);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }

      const clickedTrigger = catalogRef.current?.contains(target) ?? false;
      const clickedMenu = megaMenuRef.current?.contains(target) ?? false;

      if (!clickedTrigger && !clickedMenu) {
        setCatalogOpen(false);
      }
    }

    if (langOpen || catalogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen, catalogOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setLangOpen(false);
        setCatalogOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
    setCatalogOpen(false);
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
    setCatalogOpen(false);
    setMobileOpen(false);
  }

  function openCart() {
    setMobileOpen(false);
    setCatalogOpen(false);
    setIsOpen(true);
  }

  function closeMenus() {
    setMobileOpen(false);
    setLangOpen(false);
    setCatalogOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "transition-all duration-500 ease-out",
        isTransparent
          ? "border-b border-white/10 bg-black/15 backdrop-blur-[3px]"
          : "border-b border-border/50 bg-white/95 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl",
      )}
    >
      <div className="container relative flex h-14 items-center justify-between gap-2 px-4 sm:h-16 lg:h-[74px] lg:gap-5 lg:px-6">
        <Link
          href={`/${locale}`}
          aria-label="Kidorly home"
          className="flex shrink-0 items-center"
          onClick={closeMenus}
        >
          <Image
            src="/images/logo.webp"
            alt="Kidorly"
            width={170}
            height={60}
            priority
            className={cn(
              "h-8 w-auto object-contain transition-all duration-300 sm:h-9 lg:h-12",
              isTransparent &&
                "brightness-110 drop-shadow-[0_3px_14px_rgba(0,0,0,0.35)]",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navLinks.slice(0, 1).map((link) => {
            const active = pathname === link.href;

            return (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={active}
                isTransparent={isTransparent}
                onClick={closeMenus}
              />
            );
          })}

          <div ref={catalogRef} className="relative">
            <button
              type="button"
              aria-expanded={catalogOpen}
              onClick={() => setCatalogOpen((prev) => !prev)}
              className={cn(
                "relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition-all duration-300",
                "active:scale-[0.98]",
                isTransparent
                  ? isShopActive || catalogOpen
                    ? "bg-white text-primary shadow-xl shadow-black/10"
                    : "bg-white/15 text-white shadow-sm backdrop-blur-md hover:bg-white/25"
                  : isShopActive || catalogOpen
                    ? "bg-gradient-to-br from-primary to-[var(--brand-coral)] text-white shadow-xl shadow-primary/25"
                    : "bg-primary/10 text-primary shadow-sm hover:bg-primary/15",
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t("common.shop")}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  catalogOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {navLinks.slice(1).map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={active}
                isTransparent={isTransparent}
                onClick={closeMenus}
              />
            );
          })}
        </nav>

        {catalogOpen && (
          <div ref={megaMenuRef} className="contents">
            <DesktopMegaMenu
              locale={locale}
              data={catalogData}
              onClose={closeMenus}
            />
          </div>
        )}

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:gap-2">
          <div ref={langRef} className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Change language"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((prev) => !prev)}
              className={cn(
                "h-8 gap-1 rounded-xl px-2 text-xs font-bold transition-colors duration-300 sm:h-9 sm:px-3 lg:h-10",
                isTransparent
                  ? "text-white/95 hover:bg-white/10 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
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
                  "absolute end-0 top-full z-50 mt-2 min-w-[155px]",
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
                          ? "bg-primary/10 font-bold text-primary"
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

          <Link
            href={`/${locale}/wishlist`}
            aria-label={t("wishlist.title")}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 lg:h-11 lg:w-11",
              isTransparent
                ? "text-white/95 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
            )}
          >
            <Heart className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
            {wishlistCount > 0 && <CountBadge value={getCountBadge(wishlistCount)} />}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            onClick={openCart}
            className={cn(
              "relative h-11 w-11 rounded-xl transition-colors duration-300",
              isTransparent
                ? "text-white/95 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
            )}
          >
            <ShoppingBag className="h-[18px] w-[18px] lg:h-5 lg:w-5" />

            {count > 0 && <CountBadge value={getCountBadge(count)} />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              "h-11 w-11 rounded-xl transition-colors duration-300 lg:hidden",
              isTransparent
                ? "text-white/95 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
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

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 sm:top-16 lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />

          <nav
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={cn(
              "absolute inset-x-3 top-3 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]",
              "animate-in fade-in slide-in-from-top-2 duration-200",
            )}
          >
            <div className="max-h-[calc(100svh-86px)] overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-h-[calc(100svh-96px)]">
              <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-primary/15 via-[var(--brand-sky)]/10 to-[var(--brand-sun)]/25 p-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-white/70 blur-2xl"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-primary">
                      Kidorly Store
                    </p>
                    <h2 className="mt-1 text-lg font-black tracking-tight text-gray-950">
                      {t("common.shop")}
                    </h2>
                    <p className="mt-1 max-w-[260px] text-xs leading-5 text-gray-600">
                      {getShopDescription(locale)}
                    </p>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-md">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                </div>

                <Link
                  href={`/${locale}/shop`}
                  onClick={closeMenus}
                  className="relative mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
                >
                  {t("nav.shopAll")}
                </Link>
              </div>

              <div className="mt-3 space-y-1 rounded-[1.4rem] bg-gray-50/80 p-1.5">
                <MobileNavLink
                  href={`/${locale}`}
                  label={t("common.home")}
                  active={pathname === `/${locale}`}
                  onClick={closeMenus}
                />

                <button
                  type="button"
                  onClick={() => setMobileCatalogOpen((prev) => !prev)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black transition-all duration-200",
                    isShopActive || mobileCatalogOpen
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-700 hover:bg-white hover:text-gray-950",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                    {t("common.shop")}
                  </span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      mobileCatalogOpen && "rotate-180",
                    )}
                  />
                </button>

                {mobileCatalogOpen && (
                  <MobileCatalogMenu
                    locale={locale}
                    data={catalogData}
                    onClose={closeMenus}
                  />
                )}

                {navLinks.slice(1).map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

                  return (
                    <MobileNavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      active={active}
                      onClick={closeMenus}
                    />
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/${locale}/wishlist`}
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-white px-3 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:text-primary active:scale-[0.98]"
                >
                  <Heart className="h-4 w-4" />
                  <span>{t("wishlist.title")}</span>
                </Link>

                <button
                  type="button"
                  onClick={openCart}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-white px-3 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:text-primary active:scale-[0.98]"
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

function CountBadge({ value }: { value: string }) {
  return (
    <span className="absolute -end-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[var(--brand-coral)] px-1 text-[9px] font-black leading-none text-white shadow-sm sm:h-5 sm:min-w-5 sm:text-[10px]">
      {value}
    </span>
  );
}

function DesktopNavLink({
  href,
  label,
  active,
  isTransparent,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  isTransparent: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
        "active:scale-[0.98]",
        isTransparent
          ? active
            ? "bg-white/20 text-white shadow-sm backdrop-blur-md"
            : "text-white/90 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-950",
      )}
    >
      {label}

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
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.98]",
        active
          ? "bg-white text-primary shadow-sm"
          : "text-gray-700 hover:bg-white hover:text-gray-950",
      )}
    >
      <span>{label}</span>

      <span
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          active ? "bg-primary" : "bg-transparent",
        )}
      />
    </Link>
  );
}

function DesktopMegaMenu({
  locale,
  data,
  onClose,
}: {
  locale: Locale;
  data: CatalogMenuData;
  onClose: () => void;
}) {
  const t = useTranslations();

  const totalProducts = useMemo(() => {
    return data.categories.reduce(
      (sum, category) => sum + (category._count?.products ?? 0),
      0,
    );
  }, [data.categories]);

  const featuredCategories = data.categories.slice(0, 8);
  const featuredCollections = data.collections.slice(0, 8);
  const featuredAgeGroups = data.ageGroups.slice(0, 6);
  const featuredBrands = data.brands.slice(0, 6);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "absolute left-1/2 top-full z-50 mt-3 w-[min(1080px,calc(100vw-32px))] -translate-x-1/2",
        "overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_34px_90px_-18px_rgba(15,23,42,0.35)] ring-1 ring-black/5 backdrop-blur-xl",
        "animate-in fade-in slide-in-from-top-2 duration-200",
      )}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[var(--brand-sun)] to-[var(--brand-sky)]" />

      <div className="grid items-stretch gap-3 p-3.5 xl:grid-cols-[280px_minmax(430px,1fr)_280px]">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-primary/15 via-[var(--brand-sky)]/10 to-[var(--brand-sun)]/25 p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-10 -top-12 h-40 w-40 rounded-full bg-white/60 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -start-8 h-36 w-36 rounded-full bg-primary/15 blur-2xl"
          />

          <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-md">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <h3 className="relative text-2xl font-black tracking-tight text-gray-950">
            {t("common.shop")}
          </h3>

          <p className="relative mt-2 text-sm leading-6 text-gray-600">
            {getShopDescription(locale)}
          </p>

          {totalProducts > 0 && (
            <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {getProductsCountLabel(totalProducts, locale)}
            </div>
          )}

          <Link
            href={`/${locale}/shop`}
            onClick={onClose}
            className="relative mt-6 flex items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            {t("nav.shopAll")}
          </Link>
        </div>

        <div className="rounded-[1.6rem] bg-gray-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <MegaSectionTitle
              icon={<Grid3X3 className="h-4 w-4" />}
              title={t("common.categories")}
            />

            <Link
              href={`/${locale}/shop`}
              onClick={onClose}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
            >
              {t("nav.shopAll")}
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category) => (
                <MegaCategoryCard
                  key={category.id}
                  item={category}
                  locale={locale}
                  href={`/${locale}/category/${category.slug}`}
                  onClose={onClose}
                />
              ))
            ) : (
              <EmptyMenuMessage locale={locale} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <MegaChipPanel
            icon={<Sparkles className="h-4 w-4" />}
            title={t("shop.collections")}
          >
            {featuredCollections.length > 0 ? (
              featuredCollections.map((collection) => (
                <MegaChipLink
                  key={collection.id}
                  href={`/${locale}/shop?collection=${collection.slug}`}
                  label={getLocalizedName(collection, locale)}
                  onClose={onClose}
                />
              ))
            ) : (
              <EmptyMenuMessage locale={locale} compact />
            )}
          </MegaChipPanel>

          <MegaChipPanel
            icon={<Baby className="h-4 w-4" />}
            title={t("shop.ageGroup")}
          >
            {featuredAgeGroups.length > 0 ? (
              featuredAgeGroups.map((ageGroup) => (
                <MegaChipLink
                  key={ageGroup.id}
                  href={`/${locale}/shop?ageGroup=${ageGroup.slug}`}
                  label={getLocalizedName(ageGroup, locale)}
                  onClose={onClose}
                />
              ))
            ) : (
              <EmptyMenuMessage locale={locale} compact />
            )}
          </MegaChipPanel>

          <MegaChipPanel
            icon={<Tags className="h-4 w-4" />}
            title={t("common.brands")}
          >
            {featuredBrands.length > 0 ? (
              featuredBrands.map((brand) => (
                <MegaChipLink
                  key={brand.id}
                  href={`/${locale}/shop?brand=${brand.slug}`}
                  label={getLocalizedName(brand, locale)}
                  onClose={onClose}
                />
              ))
            ) : (
              <EmptyMenuMessage locale={locale} compact />
            )}
          </MegaChipPanel>
        </div>
      </div>
    </div>
  );
}

function MobileCatalogMenu({
  locale,
  data,
  onClose,
}: {
  locale: Locale;
  data: CatalogMenuData;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [openGroup, setOpenGroup] = useState<
    "categories" | "collections" | "age" | "brands"
  >("categories");

  return (
    <div className="space-y-2 rounded-[1.3rem] bg-white p-2 shadow-sm">
      <MobileCatalogSection
        icon={<Grid3X3 className="h-4 w-4" />}
        title={t("common.categories")}
        open={openGroup === "categories"}
        onToggle={() =>
          setOpenGroup((prev) =>
            prev === "categories" ? "collections" : "categories",
          )
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {data.categories.slice(0, 8).length > 0 ? (
            data.categories
              .slice(0, 8)
              .map((category) => (
                <MobileCategoryCard
                  key={category.id}
                  item={category}
                  locale={locale}
                  href={`/${locale}/category/${category.slug}`}
                  onClose={onClose}
                />
              ))
          ) : (
            <div className="col-span-2">
              <EmptyMenuMessage locale={locale} compact />
            </div>
          )}
        </div>
      </MobileCatalogSection>

      <MobileCatalogSection
        icon={<Sparkles className="h-4 w-4" />}
        title={t("shop.collections")}
        open={openGroup === "collections"}
        onToggle={() =>
          setOpenGroup((prev) =>
            prev === "collections" ? "categories" : "collections",
          )
        }
      >
        <div className="space-y-1">
          {data.collections.slice(0, 6).length > 0 ? (
            data.collections
              .slice(0, 6)
              .map((collection) => (
                <MobileCatalogLink
                  key={collection.id}
                  href={`/${locale}/shop?collection=${collection.slug}`}
                  label={getLocalizedName(collection, locale)}
                  locale={locale}
                  onClose={onClose}
                />
              ))
          ) : (
            <EmptyMenuMessage locale={locale} compact />
          )}
        </div>
      </MobileCatalogSection>

      <MobileCatalogSection
        icon={<Baby className="h-4 w-4" />}
        title={t("shop.ageGroup")}
        open={openGroup === "age"}
        onToggle={() =>
          setOpenGroup((prev) => (prev === "age" ? "categories" : "age"))
        }
      >
        <div className="space-y-1">
          {data.ageGroups.slice(0, 6).length > 0 ? (
            data.ageGroups
              .slice(0, 6)
              .map((ageGroup) => (
                <MobileCatalogLink
                  key={ageGroup.id}
                  href={`/${locale}/shop?ageGroup=${ageGroup.slug}`}
                  label={getLocalizedName(ageGroup, locale)}
                  locale={locale}
                  onClose={onClose}
                />
              ))
          ) : (
            <EmptyMenuMessage locale={locale} compact />
          )}
        </div>
      </MobileCatalogSection>

      <MobileCatalogSection
        icon={<Tags className="h-4 w-4" />}
        title={t("common.brands")}
        open={openGroup === "brands"}
        onToggle={() =>
          setOpenGroup((prev) => (prev === "brands" ? "categories" : "brands"))
        }
      >
        <div className="space-y-1">
          {data.brands.slice(0, 6).length > 0 ? (
            data.brands
              .slice(0, 6)
              .map((brand) => (
                <MobileCatalogLink
                  key={brand.id}
                  href={`/${locale}/shop?brand=${brand.slug}`}
                  label={getLocalizedName(brand, locale)}
                  count={brand._count?.products}
                  locale={locale}
                  onClose={onClose}
                />
              ))
          ) : (
            <EmptyMenuMessage locale={locale} compact />
          )}
        </div>
      </MobileCatalogSection>
    </div>
  );
}

function MegaSectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-black text-gray-950">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
        {icon}
      </span>
      <span>{title}</span>
    </div>
  );
}

function MegaCategoryCard({
  item,
  locale,
  href,
  onClose,
}: {
  item: CatalogItem;
  locale: Locale;
  href: string;
  onClose: () => void;
}) {
  const image = item.image || item.icon || item.logo;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex min-w-0 items-center gap-3 rounded-[1.25rem] bg-white p-2.5 shadow-sm ring-1 ring-black/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20"
    >
      <SafeThumb
        src={image}
        alt={getLocalizedName(item, locale)}
        fallback={<Grid3X3 className="h-4 w-4" />}
        className="h-12 w-12 rounded-2xl"
        sizes="48px"
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-gray-900 transition-colors group-hover:text-primary">
          {getLocalizedName(item, locale)}
        </span>

        {typeof item._count?.products === "number" && (
          <span className="mt-0.5 block truncate text-[11px] font-semibold text-gray-400">
            {getProductsCountLabel(item._count.products, locale)}
          </span>
        )}
      </span>
    </Link>
  );
}

function MobileCategoryCard({
  item,
  locale,
  href,
  onClose,
}: {
  item: CatalogItem;
  locale: Locale;
  href: string;
  onClose: () => void;
}) {
  const image = item.image || item.icon || item.logo;

  return (
    <Link
      href={href}
      onClick={onClose}
      className="group rounded-2xl bg-gray-50 p-2 text-center transition-all active:scale-[0.98]"
    >
      <SafeThumb
        src={image}
        alt={getLocalizedName(item, locale)}
        fallback={<Grid3X3 className="h-4 w-4" />}
        className="mx-auto h-14 w-full rounded-xl"
        sizes="120px"
      />

      <span className="mt-2 block truncate text-xs font-black text-gray-800 group-hover:text-primary">
        {getLocalizedName(item, locale)}
      </span>

      {typeof item._count?.products === "number" && (
        <span className="mt-0.5 block truncate text-[10px] font-bold text-gray-400">
          {getProductsCountLabel(item._count.products, locale)}
        </span>
      )}
    </Link>
  );
}

function SafeThumb({
  src,
  alt,
  fallback,
  className,
  sizes = "44px",
}: {
  src?: string | null;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary",
        className || "h-11 w-11",
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        fallback
      )}
    </span>
  );
}

function MegaChipPanel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] bg-gray-50/80 p-4">
      <MegaSectionTitle icon={icon} title={title} />
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MegaChipLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="max-w-full truncate rounded-full bg-white px-3 py-2 text-xs font-black text-gray-600 shadow-sm ring-1 ring-black/[0.03] transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-md"
    >
      {label}
    </Link>
  );
}

function MobileCatalogSection({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-sm font-black text-gray-900"
      >
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
          {title}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            open && "rotate-180 text-primary",
          )}
        />
      </button>

      {open && <div className="border-t border-border/50 p-2">{children}</div>}
    </div>
  );
}

function MobileCatalogLink({
  href,
  label,
  count,
  locale,
  onClose,
}: {
  href: string;
  label: string;
  count?: number;
  locale: Locale;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
    >
      <span className="truncate">{label}</span>

      {typeof count === "number" && (
        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-gray-400 shadow-sm">
          {getProductsCountLabel(count, locale)}
        </span>
      )}
    </Link>
  );
}

function EmptyMenuMessage({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-white text-center text-xs font-bold text-gray-400",
        compact ? "px-3 py-2" : "col-span-2 px-4 py-6",
      )}
    >
      {getEmptyLabel(locale)}
    </div>
  );
}
