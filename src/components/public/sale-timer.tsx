"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SaleTimerProps {
  endsAt: Date | string;
  className?: string;
}

export function SaleTimer({ endsAt, className }: SaleTimerProps) {
  const t = useTranslations("product");
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function calc() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (expired || !timeLeft) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl",
      "bg-gradient-to-r from-brand-coral/10 to-brand-sun/10",
      "border border-brand-coral/20",
      className
    )}>
      <Clock className="h-4 w-4 text-brand-coral shrink-0 animate-pulse" />
      <span className="text-sm font-semibold text-brand-coral">
        {t("saleEnds")}
      </span>

      <div className="flex items-center gap-1.5 ms-auto">
        {/* Days — only show if > 0 */}
        {timeLeft.days > 0 && (
          <>
            <TimeBlock value={timeLeft.days} label={t("days")} />
            <Colon />
          </>
        )}
        <TimeBlock value={timeLeft.hours}   label={t("hours")} />
        <Colon />
        <TimeBlock value={timeLeft.minutes} label={t("minutes")} />
        <Colon />
        <TimeBlock value={timeLeft.seconds} label={t("seconds")} urgent={timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 10} />
      </div>
    </div>
  );
}

function TimeBlock({ value, label, urgent = false }: {
  value: number;
  label: string;
  urgent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn(
        "text-lg font-black leading-none tabular-nums min-w-[2ch] text-center",
        urgent ? "text-red-500" : "text-brand-coral"
      )}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-muted-foreground uppercase tracking-wide leading-none mt-0.5">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="text-brand-coral font-black text-lg leading-none mb-3">:</span>
  );
}