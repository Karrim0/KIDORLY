"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    desktopImage: "/images/hero.png",
    mobileImage: "/images/hero-mobile.png",
    desktopPosition: "object-[72%_center]",
    mobilePosition: "object-[58%_center]",
  },
  {
    desktopImage: "/images/hero1.png",
    mobileImage: "/images/hero1-mobile.png",
    desktopPosition: "object-[72%_center]",
    mobilePosition: "object-[58%_center]",
  },
  {
    desktopImage: "/images/hero2.png",
    mobileImage: "/images/hero2-mobile.png",
    desktopPosition: "object-[70%_center]",
    mobilePosition: "object-[55%_center]",
  },
  {
    desktopImage: "/images/hero3.png",
    mobileImage: "/images/hero3-mobile.png",
    desktopPosition: "object-[74%_center]",
    mobilePosition: "object-[58%_center]",
  },
];

const SLIDE_DURATION = 5000;

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const total = SLIDES.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused || total <= 1) return;

    const tick = 50;
    const step = (tick / SLIDE_DURATION) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + step;

        if (nextProgress >= 100) {
          setCurrent((curr) => (curr + 1) % total);
          return 0;
        }

        return nextProgress;
      });
    }, tick);

    return () => clearInterval(interval);
  }, [paused, total]);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;

    const diff = touchStart - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }

    setTouchStart(null);
  }

  return (
    <section
      dir="ltr"
      className="relative h-[100svh] min-h-[620px] max-h-[920px] overflow-hidden sm:min-h-[680px] md:min-h-[720px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-all duration-[1200ms] ease-in-out",
            i === current
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[1.03] pointer-events-none",
          )}
        >
          {/* Mobile Image */}
          <Image
            src={slide.mobileImage}
            alt={`Hero mobile slide ${i + 1}`}
            fill
            priority={i === 0}
            quality={95}
            sizes="(max-width: 767px) 100vw"
            className={cn(
              "block md:hidden object-cover",
              slide.mobilePosition,
              "transition-transform duration-[1400ms] ease-out",
            )}
          />

          {/* Desktop Image */}
          <Image
            src={slide.desktopImage}
            alt={`Hero desktop slide ${i + 1}`}
            fill
            priority={i === 0}
            quality={95}
            sizes="(min-width: 768px) 100vw"
            className={cn(
              "hidden md:block object-cover",
              slide.desktopPosition,
              "transition-transform duration-[1400ms] ease-out",
            )}
          />

          {/* ثابتة من الشمال دايمًا عشان الكلام يفضل LTR حتى في العربي */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/78 via-black/38 to-transparent md:from-black/65 md:via-black/25 md:to-transparent" />

          {/* تهدئة تحت الصورة عشان الـ dots والأزرار */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-black/10 to-transparent md:from-black/45 md:via-black/10 md:to-transparent" />

          {/* طبقة خفيفة للموبايل بس */}
          <div className="absolute inset-0 z-[1] bg-black/10 md:bg-transparent" />
        </div>
      ))}

      <div className="absolute top-20 right-[8%] z-[2] h-20 w-20 rounded-full bg-brand-coral/15 blur-3xl pointer-events-none animate-[float_6s_ease-in-out_infinite] md:h-32 md:w-32" />

      <div className="absolute bottom-24 left-[4%] z-[2] h-24 w-24 rounded-full bg-brand-sky/15 blur-3xl pointer-events-none animate-[float_8s_ease-in-out_infinite_1s] md:h-40 md:w-40" />

      <div className="container relative z-10 flex h-full items-center pt-24 pb-24 sm:pt-28 md:pt-32 md:pb-24">
        <div className="w-full max-w-[92%] text-left sm:max-w-[520px] md:max-w-2xl">
          <Reveal direction="up" duration={800}>
            <h1
              dir="ltr"
              className={cn(
                "mb-4 max-w-[720px] text-left font-bold tracking-tight text-white drop-shadow-xl",
                "text-[2.05rem] leading-[1.05]",
                "sm:text-4xl sm:leading-[1.05]",
                "md:mb-6 md:text-5xl",
                "lg:text-6xl",
              )}
            >
              {t("title")}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={200} duration={800}>
            <p
              dir="ltr"
              className={cn(
                "mb-7 max-w-[520px] text-left leading-relaxed text-white/90 drop-shadow-md",
                "text-[0.95rem]",
                "sm:text-base",
                "md:mb-10 md:text-lg",
                "lg:text-xl",
              )}
            >
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal direction="up" delay={400} duration={800}>
            <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row md:gap-4">
<Button
  size="lg"
  className={cn(
    "w-auto min-w-[96px] sm:min-w-0 sm:w-auto",
    "h-9 px-3 text-xs font-bold sm:h-12 sm:px-6 sm:text-sm md:h-14 md:px-10 md:text-base",
    "border-0 bg-brand-coral text-white hover:bg-brand-coral/90",
    "shadow-lg shadow-brand-coral/30 hover:shadow-xl hover:shadow-brand-coral/40",
    "transition-all duration-300 press-effect",
  )}
  asChild
>
  <Link href={`/${locale}/shop`} className="inline-flex items-center justify-center">
    {t("cta")}
    <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
  </Link>
</Button>

<Button
  size="lg"
  className={cn(
    "w-auto min-w-[96px] sm:min-w-0 sm:w-auto",
    "h-9 px-3 text-xs font-bold sm:h-12 sm:px-6 sm:text-sm md:h-14 md:px-10 md:text-base",
    "bg-white/15 text-white hover:bg-white/25",
    "border border-white/35 hover:border-white/50 sm:border-2",
    "backdrop-blur-md shadow-lg",
    "transition-all duration-300 press-effect",
  )}
  asChild
>
  <Link href={`/${locale}/offers`} className="inline-flex items-center justify-center">
    {t("secondaryCta")}
  </Link>
</Button>
            </div>
          </Reveal>
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className={cn(
              "absolute left-4 top-1/2 z-20 -translate-y-1/2",
              "hidden h-11 w-11 items-center justify-center rounded-full md:flex",
              "border border-white/25 bg-white/10 text-white backdrop-blur-md",
              "transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/20 active:scale-95",
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className={cn(
              "absolute right-4 top-1/2 z-20 -translate-y-1/2",
              "hidden h-11 w-11 items-center justify-center rounded-full md:flex",
              "border border-white/25 bg-white/10 text-white backdrop-blur-md",
              "transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/20 active:scale-95",
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/10 px-3 py-2 backdrop-blur-sm sm:bottom-8 md:bottom-10 md:gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-2 overflow-hidden rounded-full transition-all duration-500 active:scale-90"
                style={{ width: i === current ? 34 : 10 }}
                aria-label={`Slide ${i + 1}`}
              >
                <span
                  className={cn(
                    "absolute inset-0 rounded-full transition-colors duration-300",
                    i === current
                      ? "bg-white/35"
                      : "bg-white/45 hover:bg-white/70",
                  )}
                />

                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-brand-coral"
                    style={{
                      width: `${progress}%`,
                      transition: "width 50ms linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}