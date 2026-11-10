"use client";

import { Eye, Calendar, MapPin, Sparkles } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";
import { getFontPreset } from "@/lib/theme-fonts";
import {
  cardRadiusValue,
  getContrastForeground,
  gradientAngle,
  normalizeHex,
  radiusValue,
  readableInkOnDark,
  readableInkOnLight,
} from "@/lib/theme-colors";

interface Props {
  settings: ThemeSettings;
}

export function ThemeLivePreview({ settings }: Props) {
  const radiusPx = radiusValue(settings.borderRadius);
  const cardRadiusPx = cardRadiusValue(settings.borderRadius);
  const primary = normalizeHex(settings.primaryColor, "#4F46E5");
  const secondary = normalizeHex(settings.secondaryColor, "#0D9488");
  const accent = normalizeHex(settings.accentColor, "#F59E0B");
  const primaryFg = getContrastForeground(primary);
  const accentFg = getContrastForeground(accent);
  const primaryOnDark = readableInkOnDark(primary);
  const secondaryInk = readableInkOnLight(secondary);
  const secondaryOnDark = readableInkOnDark(secondary);
  const font = getFontPreset(settings.fontPreset);
  const angle = gradientAngle(settings.gradientDirection);

  const surfaceBg =
    settings.themeType === "gradient"
      ? `linear-gradient(${angle}, ${primary}, ${secondary})`
      : primary;

  const buttonStyles =
    settings.buttonStyle === "outline"
      ? {
          borderRadius: radiusPx,
          border: `2px solid ${primary}`,
          color: primary,
          backgroundColor: "transparent",
        }
      : settings.buttonStyle === "soft"
      ? {
          borderRadius: radiusPx,
          backgroundColor: `${primary}1F`,
          color: primary,
        }
      : {
          borderRadius: radiusPx,
          background: surfaceBg,
          color: primaryFg,
        };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 sticky top-6 shadow-sm"
      style={{ fontFamily: font.sansStack }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[var(--color-primary)]" />
          <h2
            className="text-slate-900"
            style={{
              fontFamily: font.displayStack,
              fontWeight: font.displayWeight,
              letterSpacing: font.displayTracking,
            }}
          >
            Live Token Preview
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">{font.label}</span>
      </div>

      <div
        className="p-5 overflow-hidden"
        style={{ background: surfaceBg, color: primaryFg, borderRadius: cardRadiusPx }}
      >
        {settings.logoDarkUrl || settings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(settings.logoDarkUrl || settings.logoUrl)!}
            alt={settings.siteName}
            className="h-8 w-auto object-contain mb-2 bg-white/15 rounded-lg px-2 py-1"
          />
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block">
            {settings.themeType === "gradient" ? "Gradient Theme" : "Solid Theme"} · {font.label}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
            style={{ backgroundColor: accent, color: accentFg }}
          >
            <Sparkles className="w-2.5 h-2.5" /> Accent
          </span>
        </div>
        <h3
          className="text-xl mt-1"
          style={{
            fontFamily: font.displayStack,
            fontWeight: font.displayWeight,
            letterSpacing: font.displayTracking,
          }}
        >
          {settings.siteName || "Utopia"}
        </h3>
        <p className="text-xs opacity-85 mt-1">
          Fonts, contrast, card radius, and all 3 brand colors sync across public &amp; admin portals.
        </p>
      </div>

      <div className="p-4 border border-slate-200 bg-slate-50 space-y-3" style={{ borderRadius: cardRadiusPx }}>
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs text-slate-900"
            style={{ fontFamily: font.displayStack, fontWeight: font.displayWeight }}
          >
            Addis Tech Expo · ETB 500
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: surfaceBg, color: primaryFg }}
          >
            Active Pill
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" style={{ color: primary }} />
          Sat, Nov 28 · 6:00 PM
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5" style={{ color: secondaryInk }} />
          Skylight Convention Center
        </div>
        <button type="button" className="w-full py-2.5 text-xs font-bold transition" style={buttonStyles}>
          Reserve Pass · ETB 500
        </button>
      </div>

      <div className="bg-slate-950 text-slate-300 overflow-hidden border border-slate-800" style={{ borderRadius: cardRadiusPx }}>
        <div className="h-1 w-full" style={{ background: surfaceBg }} />
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs text-white truncate"
              style={{ fontFamily: font.displayStack, fontWeight: font.displayWeight }}
            >
              {settings.siteName || "Utopia"} Footer
            </span>
            <span className="text-[10px] font-bold" style={{ color: primaryOnDark }}>
              Dark Link Ink
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {settings.footerTagline || "Footer tagline preview appears here."}
          </p>
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: secondaryOnDark }} />
              {settings.contactCity || "Addis Ababa, Ethiopia"}
            </span>
            <span className="text-slate-300 font-semibold">ETB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
