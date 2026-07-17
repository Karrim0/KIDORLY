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
    position: "object-[64%_center] md:object-[72%_center]",
  },
  {
    desktop: "/images/hero1.webp",
    mobile: "/images/hero1-mobile.webp",
    position: "object-[62%_center] md:object-[72%_center]",
  },
  {
    desktop: "/images/hero2.webp",
    mobile: "/images/hero2-mobile.webp",
    position: "object-[61%_center] md:object-[70%_center]",
  },
  {
    desktop: "/images/hero3.webp",
    mobile: "/images/hero3-mobile.webp",
    position: "object-[64%_center] md:object-[74%_center]",
  },
];

const SLIDE_DURATION = 6500;

const TEXT_LIMITS = {
  title: { min: 8, max: 72 },
  subtitle: { min: 16, max: 180 },
  cta: { min: 5, max: 28 },
} as const;

function localizedValue(
  content: HeroContent | undefined,
  field: "title" | "subtitle" | "cta",
  locale: string,
  fallback: string,
) {
  const suffix = locale === "ar" ? "Ar" : locale === "de" ? "De" : "En";
  const key = `${field}${suffix}` as keyof HeroContent;
  const value = content?.[key];

  if (typeof value !== "string") {
    return fallback;
  }

  const cleanedValue = value.replace(/\s+/g, " ").trim();
  const limits = TEXT_LIMITS[field];

  if (
    cleanedValue.length < limits.min ||
    cleanedValue.length > limits.max
  ) {
    return fallback;
  }

  return cleanedValue;
}

function getValidImage(value?: string) {
  const image = value?.trim();

  if (!image) {
    return null;
  }

  const isLocalImage = image.startsWith("/");
  const isRemoteImage = /^https?:\/\//i.test(image);

  return isLocalImage || isRemoteImage ? image : null;
}

export function HeroSection({ content }: { content?: HeroContent }) {
  const t = useTranslations("hero");
  const locale = useLocale();

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const contentImage = getValidImage(content?.image);

  const slides: HeroSlide[] = contentImage
    ? [
        {
          desktop: contentImage,
          mobile: contentImage,
          position: "object-center",
        },
        ...DEFAULT_SLIDES,
      ]
    : DEFAULT_SLIDES;

  const title = localizedValue(
    content,
    "title",
    locale,
    t("title"),
  );

  const subtitle = localizedValue(
    content,
    "subtitle",
    locale,
    t("subtitle"),
  );

  const cta = localizedValue(
    content,
    "cta",
    locale,
    t("cta"),
  );

  const slide = slides[current] ?? slides[0];

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    setCurrent((index) => (index + 1) % slides.length);
  }, [slides.length]);

  const previous = useCallback(() => {
    setCurrent(
      (index) => (index - 1 + slides.length) % slides.length,
    );
  }, [slides.length]);

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateMotionPreference = () => {
      setReduceMotion(media.matches);
    };

    updateMotionPreference();
    media.addEventListener?.("change", updateMotionPreference);

    return () => {
      media.removeEventListener?.("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) {
      return;
    }

    const timeout = window.setTimeout(next, SLIDE_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [current, next, paused, reduceMotion]);

  useEffect(() => {
    setCurrent(0);
  }, [contentImage]);

  const trustItems = [
    {
      icon: Truck,
      label: t("trustDelivery"),
    },
    {
      icon: ShieldCheck,
      label: t("trustQuality"),
    },
    {
      icon: Headphones,
      label: t("trustSupport"),
    },
  ];

  const contentDirection = locale === "ar" ? "rtl" : "ltr";

  return (
    <section
      aria-label={title}
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-[#07111f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onTouchStart={(event) => {
        setTouchStart(event.touches[0]?.clientX ?? null);
      }}
      onTouchEnd={(event) => {
        if (touchStart === null) {
          return;
        }

        const endPosition = event.changedTouches[0]?.clientX ?? touchStart;
        const distance = touchStart - endPosition;

        if (Math.abs(distance) > 50) {
          if (distance > 0) {
            next();
          } else {
            previous();
          }
        }

        setTouchStart(null);
      }}
    >
      {/* صور الـHero */}
      <div
        key={`${current}-${slide.desktop}`}
        className="hero-media-enter absolute inset-0"
      >
        <Image
          src={slide.mobile}
          alt={title}
          fill
          priority={current === 0}
          quality={75}
          sizes="(max-width: 767px) 100vw"
          className={cn(
            "object-cover md:hidden",
            slide.position,
          )}
        />

        <Image
          src={slide.desktop}
          alt=""
          fill
          priority={current === 0}
          quality={75}
          sizes="(min-width: 768px) 100vw"
          className={cn(
            "hidden object-cover md:block",
            slide.position,
          )}
        />
      </div>

      {/* Mobile overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,18,.05)_0%,rgba(4,9,18,.08)_30%,rgba(4,9,18,.72)_65%,rgba(4,9,18,.98)_100%)] md:hidden" />

      {/* Desktop overlay: المنطقة الداكنة ناحية اليسار */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,8,17,.96)_0%,rgba(3,8,17,.86)_31%,rgba(3,8,17,.48)_51%,rgba(3,8,17,.08)_72%,transparent_100%)] md:block" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(255,107,107,.20),transparent_34%)]" />

      {/* محتوى الـHero */}
      <div
        dir="ltr"
        className="container relative z-10 flex h-full items-end px-4 pb-[88px] pt-28 sm:px-6 md:items-center md:px-8 md:pb-12 md:pt-24"
      >
        <div
          dir={contentDirection}
          className="hero-copy-enter w-full text-white md:w-[48%] md:max-w-[660px]"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-black text-white/95 shadow-lg backdrop-blur-xl sm:text-xs">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-sun" />

            <span className="truncate">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="mt-4 max-w-[650px] text-[clamp(2.35rem,11vw,4.8rem)] font-black leading-[0.98] tracking-[-0.045em] text-balance drop-shadow-[0_10px_35px_rgba(0,0,0,.35)] md:mt-6">
            {title}
          </h1>

          <p className="mt-3 max-w-[570px] text-sm font-semibold leading-6 text-white/80 sm:text-base md:mt-5 md:text-lg md:leading-8">
            {subtitle}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap md:mt-8 md:gap-3">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex min-h-[52px] min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand-coral px-4 py-3 text-center text-sm font-black text-white shadow-[0_16px_45px_rgba(255,107,107,.38)] transition duration-300 hover:-translate-y-1 hover:bg-[#ff5959] active:translate-y-0 active:scale-[.98] sm:min-h-14 sm:px-8 sm:text-base"
            >
              <span className="truncate">{cta}</span>

              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>

            <Link
              href={`/${locale}/offers`}
              className="inline-flex min-h-[52px] min-w-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center text-sm font-black text-white shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/20 active:translate-y-0 active:scale-[.98] sm:min-h-14 sm:px-8 sm:text-base"
            >
              <span className="truncate">
                {t("secondaryCta")}
              </span>
            </Link>
          </div>

          {/* مخفية على الموبايل لمنع التكدس */}
          <div className="mt-8 hidden max-w-[590px] grid-cols-3 gap-2.5 md:grid">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-3 py-3 text-xs font-extrabold text-white/85 backdrop-blur-lg"
              >
                <Icon className="h-4 w-4 shrink-0 text-brand-sun" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الأسهم على الشاشات الكبيرة فقط */}
      <button
        type="button"
        onClick={previous}
        aria-label={t("previousSlide")}
        className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label={t("nextSlide")}
        className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* مؤشرات الشرائح */}
      <div
        dir="ltr"
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${t("slideLabel")} ${index + 1}`}
            aria-current={index === current}
            className={cn(
              "relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300",
              index === current
                ? "w-10 bg-white/35"
                : "w-2.5 bg-white/40 hover:bg-white/80",
            )}
          >
            {index === current && !reduceMotion && (
              <span
                className="hero-progress absolute inset-y-0 left-0 bg-brand-coral"
                style={{
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes hero-media-in {
          from {
            opacity: 0;
            transform: scale(1.025);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes hero-copy-in {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hero-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .hero-media-enter {
          animation: hero-media-in 850ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-copy-enter {
          animation: hero-copy-in 700ms
            cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
        }

        .hero-progress {
          width: 100%;
          transform-origin: left;
          animation: hero-progress ${SLIDE_DURATION}ms linear both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-media-enter,
          .hero-copy-enter,
          .hero-progress {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}