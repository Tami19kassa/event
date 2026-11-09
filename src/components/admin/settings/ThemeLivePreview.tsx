"use client";

import { Eye, Calendar, MapPin } from "lucide-react";
import { ThemeSettings } from "@/lib/settings";

interface Props {
  settings: ThemeSettings;
}

export function ThemeLivePreview({ settings }: Props) {
  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };

  const currentRadius = radiusMap[settings.borderRadius] || "rounded-xl";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 sticky top-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Eye className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-slate-900">Live Preview</h2>
      </div>

      <div
        className={`p-6 text-white overflow-hidden ${currentRadius}`}
        style={{
          background: `linear-gradient(to bottom right, ${settings.primaryColor}, ${settings.secondaryColor})`,
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
          Hero Preview
        </span>
        <h3 className="text-xl font-black mt-1">{settings.siteName}</h3>
        <p className="text-xs text-white/80 mt-1">Discover live events in Addis Ababa.</p>
      </div>

      <div className={`p-4 border border-slate-200 bg-slate-50 space-y-3 ${currentRadius}`}>
        <span className="text-xs font-bold text-slate-800">Sample Event Card</span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" /> Sat, Nov 28 · 6:00 PM
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5" /> Millennium Hall, Addis Ababa
        </div>
        <button
          type="button"
          className={`w-full py-2.5 text-xs font-bold text-white transition ${currentRadius}`}
          style={{ backgroundColor: settings.primaryColor }}
        >
          Book Ticket · ETB 500
        </button>
      </div>
    </div>
  );
}
