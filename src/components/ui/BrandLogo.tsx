"use client";

import Link from "next/link";

interface BrandLogoProps {
  siteName?: string;
  logoUrl?: string | null;
  className?: string;
  variant?: "light" | "dark";
  showSubtitle?: boolean;
}

export function BrandLogo({
  siteName = "Utopia",
  logoUrl,
  className = "",
  variant = "light",
  showSubtitle = true,
}: BrandLogoProps) {
  const isDark = variant === "dark";
  const hasValidCustomLogo = Boolean(
    logoUrl &&
    !logoUrl.includes("photo-1612810806563") &&
    (logoUrl.startsWith("/uploads") || logoUrl.startsWith("http") || logoUrl.startsWith("data:"))
  );

  return (
    <div className={`flex items-center gap-3.5 group select-none ${className}`}>
      {hasValidCustomLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl!}
          alt={siteName}
          className="h-10 w-auto rounded-xl object-contain shadow-xs"
        />
      ) : (
        /* Bespoke High-End Vector Brand Mark */
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/30 transition-all duration-300 shrink-0">
          <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-amber-400/20 opacity-80" />

            {/* Vector Utopia "U" Gateway & Event Star */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 relative z-10"
            >
              <defs>
                <linearGradient id="utopia-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#C084FC" />
                </linearGradient>
                <linearGradient id="utopia-spark" x1="18" y1="6" x2="26" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCD34D" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              {/* Gateway / Stage Arc "U" */}
              <path
                d="M8 8V17C8 21.4183 11.5817 25 16 25C20.4183 25 24 21.4183 24 17V8"
                stroke="url(#utopia-grad)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Inspiring Spotlight / Flame */}
              <path
                d="M16 11V19M12.5 15H19.5"
                stroke="url(#utopia-grad)"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Golden Star / Event Spark */}
              <circle cx="23" cy="9" r="2.5" fill="url(#utopia-spark)" />
            </svg>
          </div>
        </div>
      )}

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black text-2xl tracking-tight leading-none transition-colors ${
              isDark ? "text-white" : "text-slate-900 group-hover:text-indigo-600"
            }`}
          >
            {siteName}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-extrabold tracking-widest uppercase mt-1 ${
              isDark ? "text-slate-400" : "text-slate-400"
            }`}
          >
            Events · Addis Ababa
          </span>
        )}
      </div>
    </div>
  );
}
