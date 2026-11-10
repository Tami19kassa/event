"use client";

import { Layers } from "lucide-react";
import { ThemeSettings } from "@/lib/theme-types";

const GRADIENT_DIRECTIONS = [
  { value: "to-br", label: "Diagonal ↘" },
  { value: "to-r", label: "Horizontal →" },
  { value: "to-b", label: "Vertical ↓" },
  { value: "to-tr", label: "Diagonal ↗" },
] as const;

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: string) => void;
}

export function TypographyShapeSection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Layers
          className="w-5 h-5"
          style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}
        />
        <h2 className="font-semibold text-slate-900">Shapes, Accent Mode &amp; Button Styles</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Corner Rounding
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {(["none", "sm", "md", "lg", "xl"] as const).map((r) => {
              const active = settings.borderRadius === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => update("borderRadius", r)}
                  style={
                    active
                      ? {
                          borderColor: "var(--color-primary)",
                          backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
                          color: "var(--color-primary)",
                        }
                      : undefined
                  }
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer uppercase ${
                    active ? "" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Primary Button Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["filled", "soft", "outline"] as const).map((b) => {
              const active = settings.buttonStyle === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => update("buttonStyle", b)}
                  style={
                    active
                      ? {
                          borderColor: "var(--color-primary)",
                          backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
                          color: "var(--color-primary)",
                        }
                      : undefined
                  }
                  className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer capitalize ${
                    active ? "" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Accent Surface Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["solid", "gradient"] as const).map((mode) => {
            const active = settings.themeType === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => update("themeType", mode)}
                style={
                  active
                    ? {
                        borderColor: "var(--color-primary)",
                        backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
                        color: "var(--color-primary)",
                      }
                    : undefined
                }
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  active ? "" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mode === "solid" ? "Solid Brand Color" : "Primary → Secondary Gradient"}
              </button>
            );
          })}
        </div>
      </div>

      {settings.themeType === "gradient" && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Gradient Direction
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GRADIENT_DIRECTIONS.map((dir) => {
              const active = (settings.gradientDirection || "to-br") === dir.value;
              return (
                <button
                  key={dir.value}
                  type="button"
                  onClick={() => update("gradientDirection", dir.value)}
                  style={
                    active
                      ? {
                          borderColor: "var(--color-primary)",
                          backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
                          color: "var(--color-primary)",
                        }
                      : undefined
                  }
                  className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    active ? "" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {dir.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
