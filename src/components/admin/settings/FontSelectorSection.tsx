"use client";

import { Type, Check } from "lucide-react";
import { FONT_PRESETS } from "@/lib/theme-fonts";
import { ThemeSettings } from "@/lib/theme-types";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string) => void;
}

export function FontSelectorSection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-[var(--color-primary)]" />
          <div>
            <h2 className="font-semibold text-slate-900">Typography &amp; Font Pairing</h2>
            <p className="text-xs text-slate-400">
              Self-hosted Google Fonts with automatic Noto Sans Ethiopic script pairing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FONT_PRESETS.map((preset) => {
          const active = (settings.fontPreset || "inter") === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => update("fontPreset", preset.key)}
              style={
                active
                  ? {
                      borderColor: "var(--color-primary)",
                      backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.06)",
                    }
                  : undefined
              }
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                active ? "shadow-xs" : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  style={{ fontFamily: preset.sansStack }}
                >
                  Aa Bb · ሀ ሁ
                </span>
                {active && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-primary-foreground, #ffffff)",
                    }}
                  >
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <div
                  className="text-sm text-slate-900 leading-snug"
                  style={{
                    fontFamily: preset.displayStack,
                    fontWeight: preset.displayWeight,
                    letterSpacing: preset.displayTracking,
                  }}
                >
                  {preset.label}
                </div>
                <div
                  className="text-[11px] text-slate-500 mt-0.5"
                  style={{ fontFamily: preset.sansStack }}
                >
                  {preset.vibe}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
