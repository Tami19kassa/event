"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/components/ui/RouteErrorFallback";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public route error:", error);
  }, [error]);

  return (
    <RouteErrorFallback
      title="Unable to load event content"
      description="Our catalog connection experienced a brief interruption. Click below to reload cleanly."
      onReset={reset}
    />
  );
}
