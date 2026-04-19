"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation direction: up (default), down, left, right, scale */
  direction?: "up" | "down" | "left" | "right" | "scale";
  /** Delay in ms */
  delay?: number;
  /** Duration in ms */
  duration?: number;
}

/**
 * Wrapper component: reveals children with animation on scroll.
 * 
 * Usage:
 *   <Reveal direction="up" delay={100}>
 *     <h2>Your content</h2>
 *   </Reveal>
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 600,
}: RevealProps) {
  const { ref, isVisible } = useScrollReveal();

  const directionStyles: Record<string, string> = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    scale: "scale-95",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : `opacity-0 ${directionStyles[direction]}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stagger children reveal: each child animates in sequence.
 * 
 * Usage:
 *   <RevealStagger staggerDelay={100}>
 *     <Card /><Card /><Card />
 *   </RevealStagger>
 */
export function RevealStagger({
  children,
  className,
  staggerDelay = 100,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: RevealProps["direction"];
}) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <Reveal key={i} direction={direction} delay={i * staggerDelay}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}