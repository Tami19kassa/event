"use client";

import { Eye, Calendar, MapPin, Sparkles, LayoutDashboard, ShoppingCart } from "lucide-react";
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
import { resolveSidebarPalette } from "@/lib/theme-sidebar";

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
  const font = getFontPreset(settings.fontPreset);
  const angle = gradientAngle(settings.gradientDirection);
  const sidebar = resolveSidebarPalette({
    sidebarColor: settings.adminSidebarColor,
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    themeType: settings.themeType,
  });

  const surfaceBg =
    settings.themeType === "gradient"
      ? `linear-gradient(${angle}, ${primary}, ${secondary})`
      : primary;

  const buttonStyles =
    settings.buttonStyle === "outline"
      ? { borderRadius: radiusPx, border: `2px solid ${primary}`, color: primary, backgroundColor: "transparent" }
      : settings.buttonStyle === "soft"
      ? { borderRadius: radiusPx, backgroundColor: `${primary}1F`, color: primary }
      : { borderRadius: radiusPx, background: surfaceBg, color: primaryFg };

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

      {/* Admin Shell Mini-Preview (Sidebar Color + Active + Queue Badge) */}
      <div
        className="border border-slate-200 overflow-hidden grid grid-cols-12"
        style={{ borderRadius: cardRadiusPx }}
      >
        <div
          className="col-span-5 p-3 space-y-2"
          style={{
            backgroundColor: sidebar.bg,
            color: sidebar.fg,
            borderRight: `1px solid ${sidebar.border}`,
          }}
        >
          <div className="text-[11px] font-bold truncate">{settings.siteName || "Utopia"}</div>
          <div
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5"
            style={{ background: sidebar.activeBg, color: sidebar.activeFg }}
          >
            <LayoutDashboard className="w-3 h-3 shrink-0" />
            <span className="truncate">Dashboard</span>
          </div>
          <div
            className="px-2 py-1 rounded-lg text-[10px] font-medium flex items-center justify-between"
            style={{ color: sidebar.muted }}
          >
            <span className="flex items-center gap-1.5 truncate">
              <ShoppingCart className="w-3 h-3 shrink-0" />
              Orders
            </span>
            <span
              className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
              style={{ backgroundColor: sidebar.badgeBg, color: sidebar.badgeFg }}
            >
              1
            </span>
          </div>
        </div>

        <div className="col-span-7 bg-slate-50 p-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
            <span>3-Color Balance</span>
            <span style={{ color: secondaryInk }}>Secondary</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
            <div className="h-full" style={{ width: "55%", backgroundColor: primary }} />
            <div className="h-full" style={{ width: "30%", backgroundColor: secondary }} />
            <div className="h-full" style={{ width: "15%", backgroundColor: accent }} />
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1"
              style={{ backgroundColor: accent, color: accentFg }}
            >
              <Sparkles className="w-2.5 h-2.5" /> Accent
            </span>
            <span className="text-[9px] text-slate-500 font-semibold">Live Navbar</span>
          </div>
        </div>
      </div>

      {/* Public Card + Footer Sample */}
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
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs text-white truncate"
              style={{ fontFamily: font.displayStack, fontWeight: font.displayWeight }}
            >
              {settings.siteName || "Utopia"} Footer
            </span>
            <span className="text-[10px] font-bold" style={{ color: primaryOnDark }}>
              Link Ink
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {settings.footerTagline || "Footer tagline preview appears here."}
          </p>
        </div>
      </div>
    </div>
  );
}
