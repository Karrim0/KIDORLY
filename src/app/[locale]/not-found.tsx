"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-gradient mb-6">404</div>
        <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("subtitle")}</p>
        <Button size="lg" asChild>
          <Link href={`/${locale}`}>
            <Home className="h-4 w-4 me-2" />
            {t("cta")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
