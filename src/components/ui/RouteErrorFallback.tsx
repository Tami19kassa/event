"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  onReset: () => void;
}

export function RouteErrorFallback({
  title = "Something went wrong",
  description = "A temporary network or server issue interrupted loading this view. Please retry or return home.",
  homeHref = "/",
  homeLabel = "Back to Home",
  onReset,
}: Props) {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-slate-200 theme-radius-card p-8 text-center shadow-sm space-y-5">
        <div className="w-14 h-14 mx-auto theme-radius-sm bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-display text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold theme-btn-primary shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
