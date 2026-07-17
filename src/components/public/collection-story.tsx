"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Layers3, Sparkles } from "lucide-react";

import { cn, getTranslated } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { CollectionFull } from "@/types";

const FALLBACK_IMAGES = [
  "/images/hero1.webp",
  "/images/hero2.webp",
  "/images/hero3.webp",
];

const TONES = [
  { shell: "#fff0eb", accent: "#ff6b6b", ink: "#5c2525" },
  { shell: "#eafaf8", accent: "#2aa99d", ink: "#153f3c" },
  { shell: "#f1edff", accent: "#7657dc", ink: "#30255a" },
];

function validImage(value?: string | null) {
  const image = value?.trim();
  return image && (image.startsWith("/") || /^https?:\/\//i.test(image))
    ? image
    : null;
}

function copyFor(locale: Locale) {
  if (locale === "ar") {
    return {
      eyebrow: "قصص مختارة",
      title: "كولكشن لكل مغامرة",
      subtitle: "اختيارات مجمعة بعناية عشان توصل للحاجة المناسبة أسرع.",
      explore: "اكتشف الكولكشن",
      products: "منتج",
    };
  }
  if (locale === "de") {
    return {
      eyebrow: "Ausgewählte Geschichten",
      title: "Eine Kollektion für jedes Abenteuer",
      subtitle: "Sorgfältig kuratierte Auswahl, damit du schneller das Richtige findest.",
      explore: "Kollektion entdecken",
      products: "Produkte",
    };
  }
  return {
    eyebrow: "Curated stories",
    title: "A collection for every adventure",
    subtitle: "Thoughtfully grouped picks that help you find the right thing faster.",
    explore: "Explore collection",
    products: "products",
  };
}

export function CollectionStory({
  collections,
  locale,
}: {
  collections: CollectionFull[];
  locale: Locale;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const copy = copyFor(locale);
  const visibleCollections = collections.slice(0, 3);

  useGSAP(
    () => {
      if (typeof window === "undefined" || reduceMotion) return;
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-collection-step]");
        steps.forEach((step, index) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 56%",
            end: "bottom 44%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
      });

      return () => media.revert();
    },
    { scope: root, dependencies: [reduceMotion, visibleCollections.length] },
  );

  if (!visibleCollections.length) return null;

  const activeCollection = visibleCollections[active] || visibleCollections[0];
  const activeName = getTranslated(activeCollection, "name", locale);
  const activeImage =
    validImage(activeCollection.banner) ||
    validImage(activeCollection.image) ||
    FALLBACK_IMAGES[active % FALLBACK_IMAGES.length];
  const activeTone = TONES[active % TONES.length];

  return (
    <motion.section
      ref={root}
      animate={{ backgroundColor: activeTone.shell }}
      transition={{ duration: reduceMotion ? 0 : 0.55 }}
      className="relative overflow-clip py-14 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute -end-24 top-16 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
      <div className="container relative">
        <div className="mb-10 max-w-2xl lg:mb-16">
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand-coral sm:text-xs">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-.045em] text-slate-950 sm:text-4xl lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            {copy.subtitle}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28 h-[min(70vh,720px)] overflow-hidden rounded-[3rem] bg-slate-900 shadow-[0_30px_90px_rgba(15,23,42,.18)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeCollection.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image src={activeImage} alt={activeName} fill className="object-cover" sizes="52vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-8 bottom-8 z-10 flex items-end justify-between gap-5 text-white">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-[10px] font-black backdrop-blur-xl">
                    <Sparkles className="h-3.5 w-3.5 text-brand-sun" />
                    {String(active + 1).padStart(2, "0")} / {String(visibleCollections.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-3xl font-black tracking-[-.04em]">{activeName}</h3>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-black backdrop-blur-xl">
                  {activeCollection._count?.products || 0} {copy.products}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:space-y-0">
            {visibleCollections.map((collection, index) => {
              const name = getTranslated(collection, "name", locale);
              const description = getTranslated(collection, "description", locale);
              const image =
                validImage(collection.banner) ||
                validImage(collection.image) ||
                FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const tone = TONES[index % TONES.length];

              return (
                <article
                  key={collection.id}
                  data-collection-step
                  className="group relative flex min-h-[420px] items-end overflow-hidden rounded-[2rem] bg-slate-900 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,.14)] sm:p-7 lg:min-h-[72vh] lg:items-center lg:overflow-visible lg:bg-transparent lg:p-0 lg:text-slate-950 lg:shadow-none"
                >
                  <div className="absolute inset-0 lg:hidden">
                    <Image src={image} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  </div>

                  <motion.div
                    animate={index === active ? { y: 0 } : { y: 10 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35 }}
                    className={cn(
                      "relative w-full rounded-[2rem] transition-opacity duration-300 lg:border lg:border-white/70 lg:bg-white/72 lg:p-8 lg:shadow-[0_18px_55px_rgba(15,23,42,.08)] lg:backdrop-blur-xl",
                      index === active ? "lg:opacity-100" : "lg:opacity-55",
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${tone.accent}1f`, color: tone.accent }}
                      >
                        <Layers3 className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-black text-white/70 lg:text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black tracking-[-.035em] sm:text-3xl">{name}</h3>
                    {description && (
                      <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-white/72 lg:text-slate-600">
                        {description}
                      </p>
                    )}
                    <Link
                      href={`/${locale}/shop?collection=${collection.slug}`}
                      className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-black text-white shadow-lg transition hover:-translate-y-1"
                      style={{ backgroundColor: tone.accent }}
                    >
                      {copy.explore}
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Link>
                  </motion.div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
