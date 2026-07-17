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
    desktop: "/images/hero1.webp",
    mobile: "/images/hero1-mobile.webp",
    position: "object-center",
  },
  {
    desktop: "/images/hero2.webp",
    mobile: "/images/hero2-mobile.webp",
    position: "object-center",
  },
  {
    desktop: "/images/hero3.webp",
    mobile: "/images/hero3-mobile.webp",
    position: "object-center",
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
  const mediaX = useTransform(smoothX, [-1, 1], [-7, 7]);
  const mediaY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const orbX = useTransform(smoothX, [-1, 1], [12, -12]);
  const orbY = useTransform(smoothY, [-1, 1], [9, -9]);

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
      id="home-hero"
      aria-label={title}
      className="relative isolate overflow-hidden bg-[#fff9f3] pt-[74px] sm:pt-[84px] lg:min-h-[100svh] lg:pt-[82px]"
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
        const distance =
          touchStart - (event.changedTouches[0]?.clientX ?? touchStart);
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
        className="pointer-events-none absolute -start-24 bottom-[8%] h-64 w-64 rounded-full bg-brand-coral/[.14] blur-3xl lg:h-80 lg:w-80"
      />
      <motion.div
        aria-hidden
        style={{ x: mediaX, y: mediaY }}
        className="pointer-events-none absolute start-[30%] top-[8%] h-56 w-56 rounded-full bg-brand-sky/[.16] blur-3xl lg:h-72 lg:w-72"
      />

      <div className="mx-auto w-full max-w-[1720px] lg:p-3">
        <div className="grid lg:min-h-[calc(100svh-106px)] lg:grid-cols-[minmax(360px,.86fr)_minmax(0,1.14fr)] lg:gap-3">
          <div
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="relative z-20 order-2 -mt-6 flex rounded-t-[2rem] bg-[#fff9f3] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 lg:order-1 lg:mt-0 lg:min-h-0 lg:items-center lg:rounded-[2.35rem] lg:px-[clamp(2.5rem,5vw,6rem)] lg:pb-10 lg:pt-8"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[620px]"
            >
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-coral/15 bg-white/[.88] px-3 py-2 text-[10px] font-black text-slate-700 shadow-[0_8px_28px_rgba(15,23,42,.06)] backdrop-blur sm:text-xs">
                <KidorlyMascot className="h-7 w-7 shrink-0" />
                <span className="truncate">{t("eyebrow")}</span>
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-coral" />
              </div>

              <h1 className="mt-4 max-w-[610px] text-balance text-[clamp(2.15rem,10.5vw,3.15rem)] font-black leading-[.98] tracking-[-.055em] text-slate-950 sm:text-[3.3rem] lg:mt-6 lg:text-[clamp(3.2rem,4.45vw,4.75rem)] lg:leading-[.94]">
                {title}
              </h1>

              <p className="mt-4 max-w-[560px] text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7 lg:mt-5 lg:text-[1.05rem] lg:leading-8">
                {subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-7">
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={`/${locale}/shop`}
                    className="hero-primary-cta group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand-coral px-6 py-3.5 text-sm font-black text-white shadow-[0_16px_38px_rgba(255,107,107,.28)] transition-colors hover:bg-[#ff5757] sm:min-h-14 sm:px-8 sm:text-base"
                  >
                    {cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                  </Link>
                </motion.div>

                <Link
                  href={`/${locale}/offers`}
                  className="group inline-flex min-h-12 items-center gap-1.5 rounded-2xl px-3 text-sm font-black text-slate-700 transition hover:bg-white hover:text-brand-coral sm:text-base"
                >
                  {t("secondaryCta")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="relative order-1 h-[36svh] min-h-[270px] max-h-[390px] overflow-hidden bg-slate-200 lg:order-2 lg:h-auto lg:max-h-none lg:min-h-[calc(100svh-106px)] lg:rounded-[2.35rem]">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={`${current}-${slide.desktop}`}
                initial={
                  reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.035 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={reduceMotion ? undefined : { x: mediaX, y: mediaY }}
                className="absolute -inset-3"
              >
                <Image
                  src={slide.mobile}
                  alt={title}
                  fill
                  priority={current === 0}
                  quality={78}
                  sizes="(max-width: 1023px) 100vw"
                  className={cn("object-cover lg:hidden", slide.position)}
                />
                <Image
                  src={slide.desktop}
                  alt=""
                  fill
                  priority={current === 0}
                  quality={78}
                  sizes="(min-width: 1024px) 58vw"
                  className={cn("hidden object-cover lg:block", slide.position)}
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/5" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/55 to-transparent" />

            <div
              dir="ltr"
              className="absolute inset-x-4 bottom-9 z-20 flex items-end justify-between gap-4 sm:inset-x-6 lg:bottom-6"
            >
              <div className="min-w-0 rounded-2xl border border-white/20 bg-black/[.15] px-3 py-2.5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-black tabular-nums text-white">
                    {String(current + 1).padStart(2, "0")}
                  </span>
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-white/30 sm:w-28">
                    <motion.span
                      key={current}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : SLIDE_DURATION / 1000,
                        ease: "linear",
                      }}
                      className="block h-full origin-left rounded-full bg-white"
                    />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums text-white/[.65]">
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previous}
                  aria-label={t("previousSlide")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/[.15] text-white shadow-xl backdrop-blur-xl transition hover:bg-white hover:text-slate-950 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label={t("nextSlide")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white text-slate-950 shadow-xl transition hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
