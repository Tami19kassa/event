"use client";

import { Palette } from "lucide-react";
import { ThemeSettings } from "@/lib/settings";

const presets = [
  { name: "Indigo", primary: "#4F46E5", secondary: "#0D9488", accent: "#F59E0B" },
  { name: "Emerald", primary: "#059669", secondary: "#0284C7", accent: "#D97706" },
  { name: "Violet", primary: "#7C3AED", secondary: "#EC4899", accent: "#EAB308" },
  { name: "Rose", primary: "#E11D48", secondary: "#8B5CF6", accent: "#F97316" },
];

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: any) => void;
}

export function ColorPickerSection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Palette className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-900">Color Palette</h2>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Quick Color Themes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full border border-white" style={{ background: p.primary }} />
                <div className="w-4 h-4 rounded-full border border-white" style={{ background: p.secondary }} />
              </div>
              <span className="text-xs font-bold text-slate-800">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => update("primaryColor", e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => update("primaryColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Secondary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => update("secondaryColor", e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => update("secondaryColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
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
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => update("accentColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
