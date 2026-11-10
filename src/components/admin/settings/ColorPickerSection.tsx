"use client";

import { Palette } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";
import { getContrastForeground } from "@/lib/theme-colors";

const presets = [
  { name: "Indigo", primary: "#4F46E5", secondary: "#0D9488", accent: "#F59E0B" },
  { name: "Emerald", primary: "#059669", secondary: "#0284C7", accent: "#D97706" },
  { name: "Violet", primary: "#7C3AED", secondary: "#EC4899", accent: "#EAB308" },
  { name: "Rose", primary: "#E11D48", secondary: "#8B5CF6", accent: "#F97316" },
  { name: "Gold", primary: "#EAB308", secondary: "#0F172A", accent: "#10B981" },
  { name: "Obsidian", primary: "#0F172A", secondary: "#2563EB", accent: "#F59E0B" },
];

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string) => void;
}

export function ColorPickerSection({ settings, update }: Props) {
  const fg = getContrastForeground(settings.primaryColor);

  const handlePrimaryChange = (val: string) => {
    update("primaryColor", val);
    update("gradientFrom", val);
  };

  const handleSecondaryChange = (val: string) => {
    update("secondaryColor", val);
    update("gradientTo", val);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="font-semibold text-slate-900">Color Palette</h2>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span>WCAG Button Text:</span>
          <span
            className="px-2.5 py-0.5 rounded-full font-bold border border-black/10"
            style={{ backgroundColor: settings.primaryColor, color: fg }}
          >
            {fg === "#0F172A" ? "Dark Ink (#0F172A)" : "White (#FFFFFF)"}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Quick Color Themes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                update("primaryColor", p.primary);
                update("secondaryColor", p.secondary);
                update("accentColor", p.accent);
                update("gradientFrom", p.primary);
                update("gradientTo", p.secondary);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-left transition flex items-center gap-2 cursor-pointer"
            >
              <div className="flex -space-x-1 shrink-0">
                <div className="w-4 h-4 rounded-full border border-white" style={{ background: p.primary }} />
                <div className="w-4 h-4 rounded-full border border-white" style={{ background: p.secondary }} />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Primary Brand</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handlePrimaryChange(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 shrink-0"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handlePrimaryChange(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Secondary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleSecondaryChange(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 shrink-0"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => handleSecondaryChange(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => update("accentColor", e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 shrink-0"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => update("accentColor", e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
