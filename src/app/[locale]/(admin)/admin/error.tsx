"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6 text-sm">{error.message}</p>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 me-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
