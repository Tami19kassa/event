"use client";

import { useId } from "react";

interface BrandLogoProps {
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  className?: string;
  variant?: "light" | "dark" | "sidebar";
  showSubtitle?: boolean;
  subtitle?: string;
}

export function BrandLogo({
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
  className = "",
  variant = "light",
  showSubtitle = true,
  subtitle = "Events & Expos",
}: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const isSidebar = variant === "sidebar";
  const isDark = variant === "dark";
  const resolvedLogo = isDark ? logoDarkUrl || logoUrl : logoUrl || logoDarkUrl;
  const isValidLogoUrl = (url?: string | null) =>
    Boolean(
      url &&
        !url.includes("photo-1612810806563") &&
        (url.startsWith("/uploads") || url.startsWith("http") || url.startsWith("data:"))
    );
  const hasLightLogo = isValidLogoUrl(logoUrl);
  const hasDarkLogo = isValidLogoUrl(logoDarkUrl);
  const hasValidCustomLogo = isSidebar ? hasLightLogo || hasDarkLogo : isValidLogoUrl(resolvedLogo);

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {hasValidCustomLogo ? (
        isSidebar && hasLightLogo && hasDarkLogo && logoUrl !== logoDarkUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDarkUrl!}
              alt={siteName}
              className="sidebar-only-dark h-10 w-auto max-w-[140px] rounded-xl object-contain shadow-xs"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl!}
              alt={siteName}
              className="sidebar-only-light h-10 w-auto max-w-[140px] rounded-xl object-contain shadow-xs"
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(isSidebar ? logoDarkUrl || logoUrl : resolvedLogo)!}
            alt={siteName}
            className="h-10 w-auto max-w-[140px] rounded-xl object-contain shadow-xs"
          />
        )
      ) : (
        <div
          style={{
            background: "var(--hero-bg, linear-gradient(135deg, var(--color-primary, #4F46E5), var(--color-secondary, #0D9488)))",
          }}
          className="relative w-10 h-10 theme-radius-sm p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0"
        >
          <div className="w-full h-full theme-radius-sm bg-slate-950 flex items-center justify-center relative overflow-hidden">
            <div
              style={{
                background:
                  "linear-gradient(to top right, rgba(var(--color-primary-rgb, 79, 70, 229), 0.35), rgba(var(--color-accent-rgb, 245, 158, 11), 0.22))",
              }}
              className="absolute inset-0 opacity-85"
            />
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 relative z-10">
              <defs>
                <linearGradient id={`grad-${uid}`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop style={{ stopColor: "var(--color-primary, #818CF8)" }} />
                  <stop offset="1" style={{ stopColor: "var(--color-secondary, #0D9488)" }} />
                </linearGradient>
                <linearGradient id={`spark-${uid}`} x1="18" y1="6" x2="26" y2="14" gradientUnits="userSpaceOnUse">
                  <stop style={{ stopColor: "var(--color-accent-on-dark, var(--color-accent, #FCD34D))" }} />
                  <stop offset="1" style={{ stopColor: "var(--color-accent, #F59E0B)" }} />
                </linearGradient>
              </defs>
              <path
                d="M8 8V17C8 21.4183 11.5817 25 16 25C20.4183 25 24 21.4183 24 17V8"
                stroke={`url(#grad-${uid})`}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 11V19M12.5 15H19.5"
                stroke={`url(#grad-${uid})`}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="23" cy="9" r="2.5" fill={`url(#spark-${uid})`} />
            </svg>
          </div>
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            style={isSidebar ? { color: "var(--admin-sidebar-fg, #F8FAFC)" } : undefined}
            className={`font-display text-xl sm:text-2xl leading-none transition-colors truncate ${
              isSidebar
                ? ""
                : isDark
                ? "text-white"
                : "text-slate-900 group-hover:text-[var(--color-primary)]"
            }`}
          >
            {siteName}
          </span>
          <span
            style={{ backgroundColor: "var(--color-accent-on-dark, var(--color-accent, #F59E0B))" }}
            className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
          />
        </div>
        {showSubtitle && (
          <span
            style={isSidebar ? { color: "var(--admin-sidebar-muted, #94A3B8)" } : undefined}
            className={`text-[10px] font-extrabold tracking-widest uppercase mt-1 truncate ${
              isSidebar ? "" : "text-slate-400"
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
