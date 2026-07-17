"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";

const SLIDES = [
  { desktop: "/images/hero.webp", mobile: "/images/hero-mobile.webp", position: "object-[58%_center] md:object-[72%_center]" },
  { desktop: "/images/hero1.webp", mobile: "/images/hero1-mobile.webp", position: "object-[58%_center] md:object-[72%_center]" },
  { desktop: "/images/hero2.webp", mobile: "/images/hero2-mobile.webp", position: "object-[55%_center] md:object-[70%_center]" },
  { desktop: "/images/hero3.webp", mobile: "/images/hero3-mobile.webp", position: "object-[58%_center] md:object-[74%_center]" },
] as const;

const SLIDE_DURATION = 6500;

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timeout = window.setTimeout(next, SLIDE_DURATION);
    return () => window.clearTimeout(timeout);
  }, [current, next, paused, reduceMotion]);

  const slide = SLIDES[current];
  const trustItems = [
    { icon: Truck, label: t("trustDelivery") },
    { icon: ShieldCheck, label: t("trustQuality") },
    { icon: Headphones, label: t("trustSupport") },
  ];

  return (
    <section
      className="relative min-h-[570px] h-[82svh] max-h-[820px] overflow-hidden bg-slate-950 md:h-[88svh] md:min-h-[680px] md:max-h-[900px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const distance = touchStart - event.changedTouches[0].clientX;
        if (Math.abs(distance) > 48) {
          if (distance > 0) next();
          else previous();
        }
        setTouchStart(null);
      }}
    >
      <div key={current} className="absolute inset-0 hero-slide-enter">
        <Image
          src={slide.mobile}
          alt={t("title")}
          fill
          priority={current === 0}
          quality={82}
          sizes="(max-width: 767px) 100vw"
          className={cn("object-cover md:hidden", slide.position)}
        />
        <Image
          src={slide.desktop}
          alt=""
          fill
          priority={current === 0}
          quality={84}
          sizes="(min-width: 768px) 100vw"
          className={cn("hidden object-cover md:block", slide.position)}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,30,.15)_0%,rgba(9,16,30,.18)_36%,rgba(9,16,30,.88)_100%)] md:bg-[linear-gradient(90deg,rgba(9,16,30,.88)_0%,rgba(9,16,30,.58)_43%,rgba(9,16,30,.08)_78%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(255,107,107,.20),transparent_30%)]" />

      <span aria-hidden className="absolute end-[7%] top-[18%] hidden h-16 w-16 rotate-12 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/10 text-brand-sun backdrop-blur-md md:flex motion-safe:animate-[float_7s_ease-in-out_infinite]">
        <Sparkles className="h-7 w-7" />
      </span>

      <div className="container relative z-10 flex h-full items-end pb-20 pt-24 md:items-center md:pb-16 md:pt-24">
        <div className="max-w-[620px] text-start text-white">
          <div className="hero-copy-enter inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-white/95 shadow-lg backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-brand-sun" />
            {t("eyebrow")}
          </div>

          <h1 className="hero-copy-enter mt-4 text-[2.35rem] font-black leading-[1.02] tracking-[-.045em] drop-shadow-lg sm:text-5xl md:mt-6 md:text-6xl lg:text-[4.35rem]">
            {t("title")}
          </h1>

          <p className="hero-copy-enter mt-4 max-w-[540px] text-sm font-medium leading-6 text-white/86 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
            {t("subtitle")}
          </p>

          <div className="hero-copy-enter mt-6 flex flex-wrap gap-3 md:mt-8">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-coral px-5 py-3 text-sm font-black text-white shadow-[0_14px_38px_rgba(255,107,107,.38)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff5959] hover:shadow-[0_18px_44px_rgba(255,107,107,.48)] active:translate-y-0 active:scale-[.98] sm:min-h-14 sm:px-7 sm:text-base"
            >
              {t("cta")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>

            <Link
              href={`/${locale}/offers`}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20 active:translate-y-0 active:scale-[.98] sm:min-h-14 sm:px-7 sm:text-base"
            >
              {t("secondaryCta")}
            </Link>
          </div>

          <div className="mt-6 flex max-w-[540px] items-center gap-2 overflow-x-auto pb-1 scrollbar-hide md:mt-8 md:gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <span key={label} className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-[10px] font-bold text-white/85 backdrop-blur-sm sm:text-xs">
                <Icon className="h-3.5 w-3.5 text-brand-sun" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/15 px-2 py-1.5 backdrop-blur-md md:bottom-8">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${t("slideLabel")} ${index + 1}`}
            aria-current={index === current}
            className={cn(
              "relative h-2.5 overflow-hidden rounded-full bg-white/35 transition-[width,background-color] duration-300",
              index === current ? "w-10 bg-white/50" : "w-2.5 hover:bg-white/70",
            )}
          >
            {index === current && !reduceMotion && (
              <span key={`${current}-progress`} className="absolute inset-y-0 start-0 bg-brand-coral hero-progress" />
            )}
          </button>
        ))}
      </div>

      <button type="button" onClick={previous} aria-label={t("previousSlide")} className="absolute start-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/15 md:flex">
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
      </button>
      <button type="button" onClick={next} aria-label={t("nextSlide")} className="absolute end-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/15 md:flex">
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </button>
    </section>
  );
}
