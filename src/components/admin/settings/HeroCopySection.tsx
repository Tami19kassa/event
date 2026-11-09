"use client";

import { Type, Sparkles, MessageSquare } from "lucide-react";
import { ThemeSettings } from "@/lib/settings";

interface Props {
  settings: ThemeSettings;
  update: (key: keyof ThemeSettings, value: any) => void;
}

export function HeroCopySection({ settings, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Type className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="font-semibold text-slate-900">Hero Section Copy & Messaging</h2>
          <p className="text-xs text-slate-400">
            Control the main headline, highlighted word, narrative subtitle, and search text on the homepage.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Headline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Hero Headline
          </label>
          <input
            type="text"
            value={settings.heroTitle || ""}
            onChange={(e) => update("heroTitle", e.target.value)}
            placeholder="e.g. Discover Events That Inspire You"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold text-slate-900"
          />
        </div>

        {/* Highlighted Word */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Highlighted Word (Golden Amber Accent)
            </label>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Accented Word
            </span>
          </div>
          <input
            type="text"
            value={settings.heroTitleHighlight || ""}
            onChange={(e) => update("heroTitleHighlight", e.target.value)}
            placeholder="e.g. Inspire"
            className="w-full px-4 py-2.5 border border-amber-200 bg-amber-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-700"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            This specific word in your headline will glow in bright golden amber.
          </p>
        </div>

        {/* Narrative Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Hero Subtitle / Description
          </label>
          <textarea
            rows={3}
            value={settings.heroSubtitle || ""}
            onChange={(e) => update("heroSubtitle", e.target.value)}
            placeholder="e.g. From tech summits at Millennium Hall to cultural concerts at Friendship Park..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-700 resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Atmosphere Badge Label */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Live Atmosphere Badge
            </label>
            <input
              type="text"
              value={settings.heroBadgeText || ""}
              onChange={(e) => update("heroBadgeText", e.target.value)}
              placeholder="e.g. Live Visual Atmosphere"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Search Placeholder */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Input Placeholder
            </label>
            <input
              type="text"
              value={settings.heroSearchPlaceholder || ""}
              onChange={(e) => update("heroSearchPlaceholder", e.target.value)}
              placeholder="e.g. Search events in Addis Ababa, venues..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
