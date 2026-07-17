"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Home, ShoppingBag, Store } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function MobileDock() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();
  const { count, setIsOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    function updateVisibility() {
      const hero = document.getElementById("home-hero");
      const threshold = hero
        ? Math.max(260, hero.offsetHeight * 0.72)
        : Math.min(window.innerHeight * 0.58, 460);
      setPastHero(window.scrollY > threshold);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [isHome]);

  const hidden = ["/checkout", "/order-success/", "/product/", "/admin", "/login"].some((segment) =>
    pathname.includes(segment),
  );

  if (hidden) return null;

  const links = [
    { href: `/${locale}`, label: t("common.home"), icon: Home, active: pathname === `/${locale}` || pathname === `/${locale}/` },
    {
      href: `/${locale}/shop`,
      label: t("common.shop"),
      icon: Store,
      active: ["/shop", "/category/", "/product/", "/brand/"].some((segment) => pathname.includes(segment)),
    },
    {
      href: `/${locale}/wishlist`,
      label: t("wishlist.title"),
      icon: Heart,
      active: pathname.includes("/wishlist"),
      count: wishlistCount,
    },
  ];

  return (
    <>
      <div className="h-24 lg:hidden" aria-hidden />
      <nav
        aria-label="Mobile quick navigation"
        className={cn(
          "fixed inset-x-3 bottom-[max(.65rem,env(safe-area-inset-bottom))] z-40 grid h-16 grid-cols-4 items-center rounded-[1.5rem] border border-white/80 bg-white/[.92] px-2 shadow-[0_16px_48px_rgba(15,23,42,.18)] backdrop-blur-2xl transition-all duration-500 lg:hidden",
          isHome && !pastHero && "pointer-events-none translate-y-[calc(100%+2rem)] opacity-0",
        )}
      >
        {links.map(({ href, label, icon: Icon, active, count: badge }) => (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold transition-all", active ? "bg-brand-coral/10 text-brand-coral" : "text-slate-500 active:bg-slate-100")}>
            <span className="relative">
              <Icon className={cn("h-5 w-5", active && "stroke-[2.6]")} />
              {!!badge && <span className="absolute -end-3 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-brand-coral px-1 text-[8px] font-black text-white">{badge > 99 ? "99+" : badge}</span>}
            </span>
            <span className="max-w-[74px] truncate">{label}</span>
          </Link>
        ))}

        <button type="button" onClick={() => setIsOpen(true)} aria-label={t("common.cart")} className="relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold text-slate-500 transition active:bg-slate-100">
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -end-3 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-brand-coral px-1 text-[8px] font-black text-white">{count > 99 ? "99+" : count}</span>}
          </span>
          <span>{t("common.cart")}</span>
        </button>
      </nav>
    </>
  );
}
