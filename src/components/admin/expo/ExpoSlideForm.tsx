"use client";

import { Video, Image as ImageIcon } from "lucide-react";
import { HeroSlide } from "@/lib/expo-settings";

interface Props {
  slide: HeroSlide;
  onChange: (key: keyof HeroSlide, val: any) => void;
}

export function ExpoSlideForm({ slide, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Expo Title *</label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Badge Tag / Kicker</label>
          <input
            type="text"
            value={slide.badgeText}
            onChange={(e) => onChange("badgeText", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Dates Text</label>
          <input
            type="text"
            value={slide.datesText}
            onChange={(e) => onChange("datesText", e.target.value)}
            placeholder="e.g. Nov 4–5, 2026"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Venue / City</label>
          <input
            type="text"
            value={slide.venueText}
            onChange={(e) => onChange("venueText", e.target.value)}
            placeholder="e.g. Millennium Hall, Addis Ababa"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category Tab Label</label>
          <input
            type="text"
            value={slide.category}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="e.g. FMCG Trade Show"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Overview Description</label>
        <textarea
          rows={2}
          value={slide.subtitle}
          onChange={(e) => onChange("subtitle", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Background Media Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange("mediaType", "image")}
              className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                slide.mediaType === "image" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-slate-50 text-slate-600"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Static Image
            </button>
            <button
              type="button"
              onClick={() => onChange("mediaType", "video")}
              className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                slide.mediaType === "video" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-slate-50 text-slate-600"
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video Loop
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            {slide.mediaType === "video" ? "YouTube Video URL" : "Poster Image URL"}
          </label>
          <input
            type="text"
            value={slide.mediaType === "video" ? slide.videoUrl || "" : slide.posterUrl}
            onChange={(e) => onChange(slide.mediaType === "video" ? "videoUrl" : "posterUrl", e.target.value)}
            placeholder={slide.mediaType === "video" ? "https://www.youtube.com/watch?v=..." : "https://..."}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}
