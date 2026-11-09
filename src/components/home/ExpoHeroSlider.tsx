"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Building2,
  Ticket,
  Pause,
  Play,
  ArrowRight,
} from "lucide-react";
import { HeroSlide } from "@/lib/expo-settings";
import { extractYouTubeId, buildYouTubeBackgroundUrl } from "@/lib/youtube";
import { ExhibitorInquiryModal } from "./ExhibitorInquiryModal";

interface Props {
  slides: HeroSlide[];
}

export function ExpoHeroSlider({ slides }: Props) {
  const activeSlides = slides.filter((s) => s.isActive);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = activeSlides[index] || activeSlides[0];

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeSlides.length, index]);

  if (!current) return null;

  const youtubeId = current.mediaType === "video" && current.videoUrl ? extractYouTubeId(current.videoUrl) : null;

  return (
    <>
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-950 text-white overflow-hidden min-h-[580px] md:min-h-[640px] flex items-center"
      >
        {/* Background Layer: Image Poster */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url('${current.posterUrl}')` }}
        />

        {/* Video Loop (if active) */}
        {current.mediaType === "video" && youtubeId && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={buildYouTubeBackgroundUrl(youtubeId)}
              title="Expo Background Stream"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover opacity-60 scale-[1.3] pointer-events-none"
              tabIndex={-1}
              style={{ border: 0 }}
            />
          </div>
        )}

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 w-full z-10">
          <div className="max-w-3xl">
            {/* Top Badge & Date Info */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {current.badgeText}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                {current.datesText}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                {current.venueText}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.1] transition-all">
              {current.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              {current.subtitle}
            </p>

            {/* Dual B2B Conversion Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg mb-8">
              <Link
                href={current.visitorCtaLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                {current.visitorCtaText}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-2 text-sm backdrop-blur-md cursor-pointer active:scale-95"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                {current.exhibitorCtaText}
              </button>
            </div>

            {/* Slide Quick-Selector Pills */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 font-semibold mr-1">Featured Expos:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {activeSlides.map((slide, sIdx) => (
                  <button
                    key={slide.id}
                    onClick={() => setIndex(sIdx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      sIdx === index
                        ? "bg-white text-slate-900 shadow-md scale-105"
                        : "bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10"
                    }`}
                  >
                    {slide.category || `Expo ${sIdx + 1}`}
                  </button>
                ))}
              </div>

              {/* Pause / Play Control */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 ml-auto transition"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {activeSlides.length > 1 && (
          <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-2 z-20">
            <button
              onClick={() => setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
              className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIndex((prev) => (prev + 1) % activeSlides.length)}
              className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {/* Exhibitor Booth Modal */}
      <ExhibitorInquiryModal
        expoTitle={current.title}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
}
