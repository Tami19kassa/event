"use client";

import { Eye, Calendar, MapPin } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";
import { getFontPreset } from "@/lib/theme-fonts";
import { getContrastForeground, normalizeHex, radiusValue } from "@/lib/theme-colors";

interface Props {
  settings: ThemeSettings;
}

export function ThemeLivePreview({ settings }: Props) {
  const radiusPx = radiusValue(settings.borderRadius);
  const primary = normalizeHex(settings.primaryColor, "#4F46E5");
  const secondary = normalizeHex(settings.secondaryColor, "#0D9488");
  const primaryFg = getContrastForeground(primary);
  const font = getFontPreset(settings.fontPreset);

  const surfaceBg =
    settings.themeType === "gradient"
      ? `linear-gradient(135deg, ${primary}, ${secondary})`
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
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: font.displayStack }}>
            Live Token Preview
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">{font.label}</span>
      </div>

      <div
        className="p-5 overflow-hidden"
        style={{ background: surfaceBg, color: primaryFg, borderRadius: radiusPx }}
      >
        {settings.logoDarkUrl || settings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(settings.logoDarkUrl || settings.logoUrl)!}
            alt={settings.siteName}
            className="h-8 w-auto object-contain mb-2 bg-white/15 rounded-lg px-2 py-1"
          />
        ) : null}
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
          {settings.themeType === "gradient" ? "Gradient Theme" : "Solid Theme"} · {font.label}
        </span>
        <h3 className="text-xl font-black mt-0.5" style={{ fontFamily: font.displayStack }}>
          {settings.siteName || "Utopia"}
        </h3>
        <p className="text-xs opacity-85 mt-1">
          Fonts, contrast, radius, and colors sync across public &amp; admin portals.
        </p>
      </div>

      <div className="p-4 border border-slate-200 bg-slate-50 space-y-3" style={{ borderRadius: radiusPx }}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900" style={{ fontFamily: font.displayStack }}>
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
          <MapPin className="w-3.5 h-3.5" style={{ color: secondary }} />
          Skylight Convention Center
        </div>
        <button type="button" className="w-full py-2.5 text-xs font-bold transition" style={buttonStyles}>
          Reserve Pass · ETB 500
        </button>
      </div>
    </div>
  );
}
