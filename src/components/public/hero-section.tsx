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
    image: "/images/hero.jpg",
    position: "object-[72%_center] md:object-[72%_center]",
  },
  // { image: "/images/hero2.png", position: "object-[70%_center] md:object-[70%_center]" },
  // { image: "/images/hero3.png", position: "object-[68%_center] md:object-[68%_center]" },
  {
    image: "/images/hero4.png",
    position: "object-[72%_center] md:object-[72%_center]",
  },
  {
    image: "/images/hero5.png",
    position: "object-[70%_center] md:object-[70%_center]",
  },
  {
    image: "/images/hero6.png",
    position: "object-[74%_center] md:object-[74%_center]",
  },
  // { image: "/images/hero7.png", position: "object-[70%_center] md:object-[70%_center]" },
  // { image: "/images/hero8.png", position: "object-[72%_center] md:object-[72%_center]" },
  {
    image: "/images/hero9.png",
    position: "object-[70%_center] md:object-[70%_center]",
  },
  // { image: "/images/hero10.png", position: "object-[72%_center] md:object-[72%_center]" },
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
      className="relative min-h-[100svh] overflow-hidden"
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
          <Image
            src={slide.image}
            alt={`Hero slide ${i + 1}`}
            fill
            priority={i === 0}
            quality={95}
            sizes="100vw"
            className={cn(
              "object-cover",
              "object-center",
              slide.position,
              "transition-transform duration-[1400ms] ease-out",
            )}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent md:from-black/60 md:via-black/20 md:to-transparent rtl:bg-gradient-to-l z-[1]" />
        </div>
      ))}

      <div className="absolute top-20 end-[8%] w-20 h-20 md:w-32 md:h-32 bg-brand-coral/15 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite] pointer-events-none z-[2]" />
      <div className="absolute bottom-20 start-[4%] w-24 h-24 md:w-40 md:h-40 bg-brand-sky/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_1s] pointer-events-none z-[2]" />

      <div className="container relative z-10 min-h-[100svh] flex items-center pt-24 pb-24 md:pt-28 md:pb-20">
        <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl">
          <Reveal direction="up" duration={800}>
            <h1 className="text-[1.9rem] leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-xl max-w-[90%] sm:max-w-none">
              {t("title")}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={200} duration={800}>
            <p className="text-[0.95rem] sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 md:mb-10 max-w-[92%] sm:max-w-md md:max-w-xl drop-shadow-md">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal direction="up" delay={400} duration={800}>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className={cn(
                  "w-full sm:w-auto",
                  "bg-brand-coral hover:bg-brand-coral/90 text-white border-0",
                  "shadow-lg shadow-brand-coral/30 hover:shadow-xl hover:shadow-brand-coral/40",
                  "h-11 sm:h-12 md:h-14 px-5 sm:px-6 md:px-10 text-sm md:text-base font-bold",
                  "transition-all duration-300 press-effect",
                )}
                asChild
              >
                <Link href={`/${locale}/shop`}>
                  {t("cta")}
                  <ArrowRight className="ms-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                className={cn(
                  "w-full sm:w-auto",
                  "bg-white/15 hover:bg-white/25 text-white",
                  "border-2 border-white/35 hover:border-white/50",
                  "backdrop-blur-md shadow-lg",
                  "h-11 sm:h-12 md:h-14 px-5 sm:px-6 md:px-10 text-sm md:text-base font-bold",
                  "transition-all duration-300 press-effect",
                )}
                asChild
              >
                <Link href={`/${locale}/offers`}>{t("secondaryCta")}</Link>
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
              "absolute start-3 top-1/2 -translate-y-1/2 z-20",
              "h-10 w-10 rounded-full",
              "bg-white/10 hover:bg-white/20 backdrop-blur-md",
              "border border-white/20 hover:border-white/35",
              "text-white transition-all duration-300",
              "hidden md:flex items-center justify-center",
              "hover:scale-110 active:scale-95",
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className={cn(
              "absolute end-3 top-1/2 -translate-y-1/2 z-20",
              "h-10 w-10 rounded-full",
              "bg-white/10 hover:bg-white/20 backdrop-blur-md",
              "border border-white/20 hover:border-white/35",
              "text-white transition-all duration-300",
              "hidden md:flex items-center justify-center",
              "hover:scale-110 active:scale-95",
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 start-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3 px-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-2 rounded-full overflow-hidden transition-all duration-500 active:scale-90"
                style={{ width: i === current ? 30 : 10 }}
                aria-label={`Slide ${i + 1}`}
              >
                <span
                  className={cn(
                    "absolute inset-0 rounded-full transition-colors duration-300",
                    i === current
                      ? "bg-white/30"
                      : "bg-white/40 hover:bg-white/60",
                  )}
                />
                {i === current && (
                  <span
                    className="absolute inset-y-0 start-0 bg-brand-coral rounded-full"
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
