"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { KidorlyMascot } from "@/components/public/kidorly-mascot";
import { sanitizeHeroCopy } from "@/lib/hero-copy";
import { cn } from "@/lib/utils";

export interface HeroContent {
  titleAr?: string;
  titleEn?: string;
  titleDe?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleDe?: string;
  ctaAr?: string;
  ctaEn?: string;
  ctaDe?: string;
  image?: string;
  mobileImage?: string;
}

interface HeroSlide {
  desktop: string;
  mobile: string;
  position: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    desktop: "/images/hero.webp",
    mobile: "/images/hero-mobile.webp",
    position: "object-[54%_center] md:object-[57%_center]",
  },
  {
    desktop: "/images/hero1.webp",
    mobile: "/images/hero1-mobile.webp",
    position: "object-[54%_center] md:object-[58%_center]",
  },
  {
    desktop: "/images/hero2.webp",
    mobile: "/images/hero2-mobile.webp",
    position: "object-[52%_center] md:object-[55%_center]",
  },
];

const SLIDE_DURATION = 6200;

function localizedValue(
  content: HeroContent | undefined,
  field: "title" | "subtitle" | "cta",
  locale: string,
  fallback: string,
) {
  const suffix = locale === "ar" ? "Ar" : locale === "de" ? "De" : "En";
  const value = content?.[`${field}${suffix}` as keyof HeroContent];

  return sanitizeHeroCopy(value, field, fallback);
}

function validImage(value?: string) {
  const image = value?.trim();
  if (!image) return null;
  return image.startsWith("/") || /^https?:\/\//i.test(image) ? image : null;
}

export function HeroSection({ content }: { content?: HeroContent }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 24 });
  const mediaX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const mediaY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const orbX = useTransform(smoothX, [-1, 1], [14, -14]);
  const orbY = useTransform(smoothY, [-1, 1], [10, -10]);

  const slides = useMemo(() => {
    const desktop = validImage(content?.image);
    if (!desktop) return DEFAULT_SLIDES;

    return [
      {
        desktop,
        mobile: validImage(content?.mobileImage) || desktop,
        position: "object-center",
      },
      ...DEFAULT_SLIDES.slice(0, 2),
    ];
  }, [content?.image, content?.mobileImage]);

  const title = localizedValue(content, "title", locale, t("title"));
  const subtitle = localizedValue(content, "subtitle", locale, t("subtitle"));
  const cta = localizedValue(content, "cta", locale, t("cta"));
  const slide = slides[current] || slides[0];

  const next = useCallback(() => {
    setCurrent((index) => (index + 1) % slides.length);
  }, [slides.length]);

  const previous = useCallback(() => {
    setCurrent((index) => (index - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(next, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [current, next, paused, reduceMotion]);

  return (
    <section
      aria-label={title}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#fffaf4]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        pointerX.set(0);
        pointerY.set(0);
      }}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const distance = touchStart - (event.changedTouches[0]?.clientX ?? touchStart);
        if (Math.abs(distance) > 52) {
          if (distance > 0) next();
          else previous();
        }
        setTouchStart(null);
      }}
    >
      <motion.div
        aria-hidden
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute -start-24 bottom-[12%] h-72 w-72 rounded-full bg-brand-coral/15 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ x: mediaX, y: mediaY }}
        className="pointer-events-none absolute start-[34%] top-[7%] h-64 w-64 rounded-full bg-brand-sky/18 blur-3xl"
      />

      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1680px] grid-rows-[48svh_auto] md:grid-cols-[minmax(390px,.84fr)_minmax(0,1.16fr)] md:grid-rows-1 md:gap-5 md:p-5">
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="relative z-10 order-2 flex items-center px-5 pb-28 pt-8 sm:px-8 md:order-1 md:px-[clamp(2.5rem,6vw,7rem)] md:pb-10 md:pt-28"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[640px]"
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-coral/15 bg-white/80 px-3 py-2 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur sm:text-xs">
              <KidorlyMascot className="h-7 w-7" />
              <span className="truncate">{t("eyebrow")}</span>
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-coral" />
            </div>

            <h1 className="mt-4 max-w-[620px] text-[clamp(2.2rem,9.8vw,4.8rem)] font-black leading-[.98] tracking-[-.055em] text-slate-950 text-balance md:mt-7">
              {title}
            </h1>

            <p className="mt-4 max-w-[570px] text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7 md:mt-6 md:text-lg md:leading-8">
              {subtitle}
            </p>

            <div className="mt-6 flex items-center gap-4 md:mt-8">
              <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${locale}/shop`}
                  className="hero-primary-cta group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-coral px-6 text-sm font-black text-white shadow-[0_18px_42px_rgba(255,107,107,.3)] transition-colors hover:bg-[#ff5757] sm:px-8 sm:text-base"
                >
                  {cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </Link>
              </motion.div>

              <Link
                href={`/${locale}/offers`}
                className="group inline-flex min-h-12 items-center gap-1.5 text-sm font-black text-slate-700 transition hover:text-brand-coral sm:text-base"
              >
                {t("secondaryCta")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative order-1 overflow-hidden bg-slate-200 md:order-2 md:rounded-[2.5rem]">
          <AnimatePresence initial={false}>
            <motion.div
              key={`${current}-${slide.desktop}`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={reduceMotion ? undefined : { x: mediaX, y: mediaY }}
              className="absolute -inset-3"
            >
              <Image
                src={slide.mobile}
                alt={title}
                fill
                priority={current === 0}
                quality={75}
                sizes="(max-width: 767px) 100vw"
                className={cn("object-cover md:hidden", slide.position)}
              />
              <Image
                src={slide.desktop}
                alt=""
                fill
                priority={current === 0}
                quality={75}
                sizes="(min-width: 768px) 62vw"
                className={cn("hidden object-cover md:block", slide.position)}
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-black/5" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/45 to-transparent" />

          <div dir="ltr" className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between md:inset-x-6 md:bottom-6">
            <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/15 p-1.5 shadow-lg backdrop-blur-xl">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`${t("slideLabel")} ${index + 1}`}
                  aria-current={current === index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === index ? "w-9 bg-white" : "w-2 bg-white/55 hover:bg-white",
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={previous}
                aria-label={t("previousSlide")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white shadow-lg backdrop-blur-xl transition hover:bg-white hover:text-slate-950 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("nextSlide")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white shadow-lg backdrop-blur-xl transition hover:bg-white hover:text-slate-950 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
