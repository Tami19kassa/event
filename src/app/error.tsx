"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/components/ui/RouteErrorFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return <RouteErrorFallback onReset={reset} />;
}
