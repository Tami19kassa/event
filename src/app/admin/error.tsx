"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/components/ui/RouteErrorFallback";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin workspace error:", error);
  }, [error]);

  return (
    <RouteErrorFallback
      title="Workspace request failed"
      description="Unable to load administrative records right now. Try refreshing or return to the dashboard."
      homeHref="/admin/dashboard"
      homeLabel="Dashboard"
      onReset={reset}
    />
  );
}
