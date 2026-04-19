import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Full-page loading spinner */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

/** Section heading used on public pages */
export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "start";
}) {
  return (
    <div className={cn("mb-10", align === "center" ? "text-center" : "text-start", className)}>
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

/** Price display with optional discount */
export function PriceDisplay({
  price,
  originalPrice,
  discount,
  locale = "en",
  size = "default",
}: {
  price: number;
  originalPrice?: number;
  discount?: number;
  locale?: string;
  size?: "default" | "lg";
}) {
  const formatPrice = (amount: number) => {
    const formatted = new Intl.NumberFormat(
      locale === "ar" ? "ar-EG" : locale === "de" ? "de-DE" : "en-EG",
      { minimumFractionDigits: 0, maximumFractionDigits: 2 }
    ).format(amount);
    return locale === "ar" ? `${formatted} ج.م` : `EGP ${formatted}`;
  };

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={cn(
          "font-bold",
          discount && discount > 0 ? "text-brand-coral" : "",
          size === "lg" ? "text-2xl" : "text-base"
        )}
      >
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-base" : "text-sm")}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
