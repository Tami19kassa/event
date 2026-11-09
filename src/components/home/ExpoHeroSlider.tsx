"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { HeroSlide } from "@/lib/expo-settings";
import { ExhibitorInquiryModal } from "./ExhibitorInquiryModal";

interface Props {
  slides: HeroSlide[];
  intervalSeconds?: number;
}

export function ExpoHeroSlider({ slides, intervalSeconds = 7 }: Props) {
  const activeSlides = slides.filter((s) => s.isActive);
  const [index, setIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedExpoTitle, setSelectedExpoTitle] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);

  const total = activeSlides.length;

  // Sync scroll position when index changes (e.g. from tab tap or autoplay)
  const scrollToIndex = (newIndex: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: newIndex * width, behavior: "smooth" });
    setIndex(newIndex);
  };

  // Detect native scroll / swipe on mobile
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== index && newIndex >= 0 && newIndex < total) {
      setIndex(newIndex);
    }
  };

  // Autoplay timer
  useEffect(() => {
    if (total <= 1) return;
    const duration = Math.max(4, intervalSeconds) * 1000;
    const timer = setInterval(() => {
      if (!isUserScrolling.current) {
        setIndex((prev) => {
          const next = (prev + 1) % total;
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              left: next * scrollRef.current.clientWidth,
              behavior: "smooth",
            });
          }
          return next;
        });
      }
    }, duration);

    return () => clearInterval(timer);
  }, [total, intervalSeconds]);

  if (total === 0) return null;

  return (
    <>
      <section className="relative bg-slate-900 overflow-hidden">
        {/* Horizontal Snap Scroll Track for Mobile & Desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={() => { isUserScrolling.current = true; }}
          onTouchEnd={() => { setTimeout(() => { isUserScrolling.current = false; }, 800); }}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar w-full select-none"
        >
          {activeSlides.map((slide, sIdx) => (
            <div
              key={slide.id}
              className="min-w-full w-full shrink-0 snap-start relative min-h-[580px] md:min-h-[640px] flex items-center"
            >
              {/* True Color, 100% Opacity Full Image (No Dark Masking Over Image) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.posterUrl}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Crisp Glass Showcase Pod for Readable Text Without Masking Entire Image */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
                <div className="max-w-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl text-white">
                  {/* Top Row: Category Badge + Slide Counter (01 / 03) */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span
                      style={{ borderColor: "var(--color-primary, #4F46E5)" }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {slide.badgeText}
                    </span>

                    {/* Prominent Slide Counter */}
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                      <span style={{ color: "var(--color-primary, #4F46E5)" }}>
                        {String(sIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-300">{String(total).padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2.5 leading-snug">
                    {slide.title}
                  </h1>

                  {/* Date & Venue Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {slide.datesText}
                    </span>
                    <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-300" />
                      {slide.venueText}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed line-clamp-3">
                    {slide.subtitle}
                  </p>

                  {/* Side-by-Side Clean Action Pair */}
                  <div className="flex flex-row items-center gap-2.5 sm:gap-3">
                    <Link
                      href={slide.visitorCtaLink}
                      style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                      className="flex-1 text-white font-bold px-4 py-3 rounded-xl transition shadow-md hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-center"
                    >
                      <span>{slide.visitorCtaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExpoTitle(slide.title);
                        setInquiryModalOpen(true);
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl border border-white/20 transition cursor-pointer active:scale-95 text-xs sm:text-sm text-center"
                    >
                      <span>{slide.exhibitorCtaText}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Pagination Strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {activeSlides.map((s, sIdx) => (
            <button
              key={s.id}
              onClick={() => scrollToIndex(sIdx)}
              className="cursor-pointer transition-all duration-300"
              aria-label={`Jump to slide ${sIdx + 1}`}
            >
              <div
                style={{
                  backgroundColor: sIdx === index ? "var(--color-primary, #4F46E5)" : "rgba(255,255,255,0.3)",
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  sIdx === index ? "w-6" : "w-2 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
          <span className="text-[11px] font-mono text-slate-300 pl-1">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </section>

      {/* Exhibitor Modal */}
      <ExhibitorInquiryModal
        expoTitle={selectedExpoTitle || activeSlides[0]?.title}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
}
