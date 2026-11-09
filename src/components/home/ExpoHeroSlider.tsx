"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import { HeroSlide } from "@/lib/expo-settings";
import { extractYouTubeId, buildYouTubeBackgroundUrl } from "@/lib/youtube";
import { ExhibitorInquiryModal } from "./ExhibitorInquiryModal";

interface Props {
  slides: HeroSlide[];
  intervalSeconds?: number;
}

export function ExpoHeroSlider({ slides, intervalSeconds = 7 }: Props) {
  const activeSlides = slides.filter((s) => s.isActive);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const slideCount = activeSlides.length;
  const current = activeSlides[index] || activeSlides[0];

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Reliable Autoplay timer with auto-reset on slide change
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const duration = Math.max(3, intervalSeconds) * 1000;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideCount);
    }, duration);

    return () => clearInterval(timer);
  }, [isPaused, slideCount, index, intervalSeconds]);

  // Touch Swipe Handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (!touchStartRef.current) return;
    const deltaX = touchStartRef.current.x - e.changedTouches[0].clientX;
    const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;

    // Horizontal swipe threshold
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) nextSlide();
      else prevSlide();
    }
    touchStartRef.current = null;
  };

  if (!current) return null;
  const youtubeId = current.mediaType === "video" && current.videoUrl ? extractYouTubeId(current.videoUrl) : null;

  return (
    <>
      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
            setIsPaused(true);
          }
        }}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-950 text-white overflow-hidden min-h-[540px] md:min-h-[600px] flex items-center select-none"
      >
        {/* Background Poster */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700 scale-105"
          style={{ backgroundImage: `url('${current.posterUrl}')` }}
        />

        {/* Video Loop */}
        {current.mediaType === "video" && youtubeId && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={buildYouTubeBackgroundUrl(youtubeId)}
              title="Expo Background"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover opacity-50 scale-[1.3] pointer-events-none border-0"
              tabIndex={-1}
            />
          </div>
        )}

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full z-10">
          <div className="max-w-2xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span
                style={{ borderColor: "var(--color-primary, #4F46E5)" }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border backdrop-blur-md"
              >
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 leading-[1.15] text-white">
              {current.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 mb-6 leading-relaxed max-w-xl line-clamp-3">
              {current.subtitle}
            </p>

            {/* Sleek, Non-AI Dual Action Group */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-4 max-w-md mb-8">
              <Link
                href={current.visitorCtaLink}
                style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                className="flex-1 sm:flex-initial text-white font-bold px-5 py-3 rounded-xl transition shadow-lg hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
              >
                <span>{current.visitorCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl border border-white/20 transition backdrop-blur-md cursor-pointer active:scale-95 text-xs sm:text-sm text-center"
              >
                <span>{current.exhibitorCtaText}</span>
              </button>
            </div>

            {/* Story-Style Segmented Navigation & Indicators */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
              {/* Slide Category Pills & Segment Bars */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {activeSlides.map((slide, sIdx) => (
                  <button
                    key={slide.id}
                    onClick={() => setIndex(sIdx)}
                    className={`relative py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      sIdx === index
                        ? "bg-white text-slate-950 shadow-md scale-105"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    <span>{slide.category || `Expo ${sIdx + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Prev / Next Chevrons (Available on both Mobile & Desktop) */}
              {slideCount > 1 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitor Modal */}
      <ExhibitorInquiryModal
        expoTitle={current.title}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
}
