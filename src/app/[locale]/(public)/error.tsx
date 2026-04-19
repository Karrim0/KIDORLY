"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("error")}</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          We encountered an unexpected error. Please try again.
        </p>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 me-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
