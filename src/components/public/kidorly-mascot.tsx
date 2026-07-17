"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export function KidorlyMascot({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn("relative shrink-0", className)}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -5, 0],
              rotate: [-3, 3, -3],
            }
      }
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_12px_22px_rgba(245,158,11,.28)]">
        <path
          d="M60 7 73 35l31 3-23 21 7 31-28-16-28 16 7-31-23-21 31-3L60 7Z"
          fill="#FFE66D"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <ellipse cx="47" cy="54" rx="4.5" ry="6" fill="#172033" />
        <ellipse cx="73" cy="54" rx="4.5" ry="6" fill="#172033" />
        <circle cx="45.5" cy="52" r="1.4" fill="white" />
        <circle cx="71.5" cy="52" r="1.4" fill="white" />
        <path d="M47 67c7 8 19 8 26 0" fill="none" stroke="#172033" strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="64" r="5" fill="#FF8C9A" opacity=".8" />
        <circle cx="82" cy="64" r="5" fill="#FF8C9A" opacity=".8" />
      </svg>
    </motion.div>
  );
}
