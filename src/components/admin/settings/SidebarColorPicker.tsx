"use client";

import { PanelLeft, ShieldCheck } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";
import { buildSidebarPresets, resolveSidebarPalette } from "@/lib/theme-sidebar";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string) => void;
}

export function SidebarColorPicker({ settings, update }: Props) {
  const sidebarHex = settings.adminSidebarColor || "#09090B";
  const presets = buildSidebarPresets(settings.primaryColor, settings.secondaryColor);
  const resolved = resolveSidebarPalette({
    sidebarColor: sidebarHex,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    themeType: settings.themeType,
  });

  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <PanelLeft className="w-3.5 h-3.5 text-[var(--color-secondary-ink,var(--color-secondary))]" />
          Admin Left Navbar Surface
        </label>

        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-black/10"
          style={{ backgroundColor: resolved.bg, color: resolved.fg }}
        >
          <ShieldCheck className="w-3 h-3" />
          {resolved.isLight ? "Dark Ink Surface" : "Light Ink Surface"}
          {resolved.hasActiveCollision ? " · Contrast Guard Active" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {presets.map((preset) => {
          const active = sidebarHex.toLowerCase() === preset.color.toLowerCase();
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => update("adminSidebarColor", preset.color)}
              className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                active
                  ? "border-slate-900 bg-slate-50 shadow-2xs"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: preset.color }}
              />
              <span className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
        <div className="flex items-center gap-2 sm:w-56">
          <input
            type="color"
            value={resolved.bg}
            onChange={(e) => update("adminSidebarColor", e.target.value)}
            aria-label="Custom sidebar background color"
            className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 shrink-0"
          />
          <input
            type="text"
            value={sidebarHex}
            onChange={(e) => update("adminSidebarColor", e.target.value)}
            placeholder="#09090B"
            className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase"
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Updates the admin navigation bar immediately with automatic text, logo, scrollbar, and active-pill contrast safety.
        </p>
      </div>
    </div>
  );
}
