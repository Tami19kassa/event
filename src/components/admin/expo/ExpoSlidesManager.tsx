"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Layers } from "lucide-react";
import { HeroSlide } from "@/lib/expo-settings";
import { ExpoSlideForm } from "./ExpoSlideForm";

interface Props {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
}

export function ExpoSlidesManager({ slides, onChange }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const handleUpdate = (idx: number, key: keyof HeroSlide, val: any) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title: "New International B2B Expo",
      titleHighlight: "Expo",
      subtitle: "Connecting international industry leaders with verified buyers and exhibitors in Addis Ababa.",
      badgeText: "International Trade Fair",
      category: "Exhibition",
      datesText: "Oct 15–18, 2026",
      venueText: "Millennium Hall, Addis Ababa",
      mediaType: "image",
      posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600",
      visitorCtaText: "Get Visitor Pass",
      visitorCtaLink: "/discover",
      exhibitorCtaText: "Book Exhibition Booth",
      exhibitorCtaLink: "#exhibit",
      isActive: true,
    };
    onChange([...slides, newSlide]);
    setActiveTab(slides.length);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    onChange(updated);
    setActiveTab(Math.max(0, idx - 1));
  };

  const current = slides[activeTab] || slides[0];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl theme-badge border flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Multi-Expo Hero Slides</h2>
            <p className="text-xs text-slate-500">Configure multiple summits and expos shown in the carousel.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          className="px-3.5 py-1.5 theme-badge border hover:brightness-95 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Expo Slide
        </button>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              idx === activeTab
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            <span>{s.category || `Slide ${idx + 1}`}</span>
            {!s.isActive && <EyeOff className="w-3 h-3 text-rose-300" />}
          </button>
        ))}
      </div>

      {current && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdate(activeTab, "isActive", !current.isActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  current.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {current.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {current.isActive ? "Active in Carousel" : "Hidden (Draft)"}
              </button>
            </div>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteSlide(activeTab)}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Slide
              </button>
            )}
          </div>

          <ExpoSlideForm
            slide={current}
            onChange={(key, val) => handleUpdate(activeTab, key, val)}
          />
        </div>
      )}
    </section>
  );
}
