"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, BookOpen } from "lucide-react";
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
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedExpoTitle, setSelectedExpoTitle] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const total = activeSlides.length;

  const scrollToIndex = (newIndex: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: newIndex * scrollRef.current.clientWidth, behavior: "smooth" });
    setIndex(newIndex);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const newIdx = Math.round(scrollLeft / clientWidth);
    if (newIdx !== index && newIdx >= 0 && newIdx < total) setIndex(newIdx);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      if (!isUserScrolling.current) {
        setIndex((prev) => {
          const next = (prev + 1) % total;
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: next * scrollRef.current.clientWidth, behavior: "smooth" });
          }
          return next;
        });
      }
    }, Math.max(4, intervalSeconds) * 1000);
    return () => clearInterval(timer);
  }, [total, intervalSeconds]);

  if (total === 0) return null;

  return (
    <>
      <section className="relative bg-slate-950 text-white overflow-hidden select-none">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={() => { isUserScrolling.current = true; }}
          onTouchEnd={() => { setTimeout(() => { isUserScrolling.current = false; }, 800); }}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar w-full"
        >
          {activeSlides.map((slide, sIdx) => {
            const ytId = slide.mediaType === "video" && slide.videoUrl ? extractYouTubeId(slide.videoUrl) : null;
            return (
              <div
                key={slide.id}
                className="min-w-full w-full shrink-0 snap-start relative min-h-[580px] md:min-h-[660px] flex items-end pb-16 md:pb-20"
              >
                {slide.mediaType === "video" && ytId ? (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <iframe
                      src={buildYouTubeBackgroundUrl(ytId)}
                      title={slide.title}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover scale-[1.2] border-0"
                      tabIndex={-1}
                    />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.posterUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                )}

                {/* Subtle bottom shadow gradient to keep typography crisp without hiding image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Direct Cardless Text Overlay */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                  <div className="max-w-3xl space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-bold border border-white/20 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {slide.badgeText}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-black/40 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        <span style={{ color: "var(--color-primary, #4F46E5)" }}>{String(sIdx + 1).padStart(2, "0")}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-white">{String(total).padStart(2, "0")}</span>
                      </div>
                    </div>

                    <Link href={`/expo/${slide.id}`} className="block group">
                      <h1
                        style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 4px 30px rgba(0,0,0,0.8)" }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white group-hover:text-slate-200 transition-colors leading-[1.1]"
                      >
                        {slide.title}
                      </h1>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white font-medium">
                      <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm">
                        <Calendar className="w-3.5 h-3.5 text-amber-300" />
                        <span>{slide.datesText}</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm">
                        <MapPin className="w-3.5 h-3.5 text-rose-300" />
                        <span>{slide.venueText}</span>
                      </span>
                    </div>

                    <p
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.7)" }}
                      className="text-xs sm:text-sm md:text-base text-slate-100 max-w-2xl leading-relaxed line-clamp-3"
                    >
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href={slide.visitorCtaLink}
                        style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                        className="text-white font-bold px-5 py-3 rounded-xl transition shadow-xl hover:brightness-110 active:scale-95 flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <span>{slide.visitorCtaText}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExpoTitle(slide.title);
                          setInquiryModalOpen(true);
                        }}
                        className="bg-black/40 hover:bg-black/60 text-white font-bold px-5 py-3 rounded-xl border border-white/30 transition backdrop-blur-sm cursor-pointer active:scale-95 text-xs sm:text-sm"
                      >
                        <span>{slide.exhibitorCtaText}</span>
                      </button>
                      <Link
                        href={`/expo/${slide.id}`}
                        className="text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 py-3 px-3 hover:underline"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read In-Depth Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Pagination */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          {activeSlides.map((s, sIdx) => (
            <button
              key={s.id}
              onClick={() => scrollToIndex(sIdx)}
              className="cursor-pointer transition-all duration-300"
              aria-label={`Jump to slide ${sIdx + 1}`}
            >
              <div
                style={{
                  backgroundColor: sIdx === index ? "var(--color-primary, #4F46E5)" : "rgba(255,255,255,0.4)",
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${sIdx === index ? "w-6" : "w-2 hover:bg-white/80"}`}
              />
            </button>
          ))}
          <span className="text-[11px] font-mono font-bold text-white pl-1">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </section>

      <ExhibitorInquiryModal
        expoTitle={selectedExpoTitle || activeSlides[0]?.title}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </>
  );
}
