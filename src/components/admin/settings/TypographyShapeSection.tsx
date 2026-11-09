"use client";

import { Layers } from "lucide-react";
import { ThemeSettings } from "@/lib/settings";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: any) => void;
}

export function TypographyShapeSection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Layers className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-900">Shapes & Styles</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Corner Rounding
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["none", "sm", "md", "xl"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update("borderRadius", r)}
                className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer capitalize ${
                  settings.borderRadius === r
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Button Fill Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["filled", "soft", "outline"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => update("buttonStyle", b)}
                className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer capitalize ${
                  settings.buttonStyle === b
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
