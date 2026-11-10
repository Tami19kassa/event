"use client";

import { Eye, Calendar, MapPin } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";

interface Props {
  settings: ThemeSettings;
}

export function ThemeLivePreview({ settings }: Props) {
  const radiusMap: Record<string, string> = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  };
  const radiusPx = radiusMap[settings.borderRadius] || "16px";

  const surfaceBg =
    settings.themeType === "gradient"
      ? `linear-gradient(to bottom right, ${settings.primaryColor}, ${settings.secondaryColor})`
      : settings.primaryColor;

  const buttonStyles =
    settings.buttonStyle === "outline"
      ? {
          borderRadius: radiusPx,
          border: `2px solid ${settings.primaryColor}`,
          color: settings.primaryColor,
          backgroundColor: "transparent",
        }
      : settings.buttonStyle === "soft"
      ? {
          borderRadius: radiusPx,
          backgroundColor: `${settings.primaryColor}1F`,
          color: settings.primaryColor,
        }
      : {
          borderRadius: radiusPx,
          background: surfaceBg,
          color: "#ffffff",
        };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 sticky top-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Eye className="w-5 h-5 text-[var(--color-primary)]" />
        <h2 className="font-semibold text-slate-900">Live Token Preview</h2>
      </div>

      <div className="p-5 text-white overflow-hidden" style={{ background: surfaceBg, borderRadius: radiusPx }}>
        {settings.logoDarkUrl || settings.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(settings.logoDarkUrl || settings.logoUrl)!}
            alt={settings.siteName}
            className="h-8 w-auto object-contain mb-2 bg-white/10 rounded-lg px-2 py-1"
          />
        ) : null}
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
          {settings.themeType === "gradient" ? "Gradient Theme" : "Solid Theme"}
        </span>
        <h3 className="text-xl font-black mt-0.5">{settings.siteName || "Utopia"}</h3>
        <p className="text-xs text-white/85 mt-1">Brand tokens apply across public &amp; admin portals.</p>
      </div>

      <div className="p-4 border border-slate-200 bg-slate-50 space-y-3" style={{ borderRadius: radiusPx }}>
        <span className="text-xs font-bold text-slate-800 block">Sample Event Card</span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" style={{ color: settings.primaryColor }} />
          Sat, Nov 28 · 6:00 PM
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5" style={{ color: settings.secondaryColor }} />
          Skylight Convention Center
        </div>
        <button type="button" className="w-full py-2.5 text-xs font-bold transition" style={buttonStyles}>
          Reserve Pass · ETB 500
        </button>
      </div>
    </div>
  );
}
