"use client";

import Link from "next/link";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { extractYouTubeId, buildYouTubeBackgroundUrl, getYouTubeThumbnail } from "@/lib/youtube";

interface HeroSectionProps {
  mediaType?: "image" | "video";
  videoUrl?: string | null;
  posterUrl?: string | null;
  badgeText?: string | null;
  title?: string | null;
  titleHighlight?: string | null;
  subtitle?: string | null;
  searchPlaceholder?: string | null;
}

export function HeroSection({
  mediaType = "image",
  videoUrl = "",
  posterUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600",
  badgeText = "Addis Ababa's Premier Event Hub",
  title = "Discover Events That Inspire You",
  titleHighlight = "Inspire",
  subtitle = "From tech summits at Millennium Hall to cultural concerts at Friendship Park — explore the vibrant pulse of Addis Ababa.",
  searchPlaceholder = "Search events, venues, categories in Addis...",
}: HeroSectionProps) {
  const hasVideoUrl = Boolean(videoUrl && videoUrl.trim());
  const isVideoMode = mediaType === "video" && hasVideoUrl;
  const youtubeId = isVideoMode ? extractYouTubeId(videoUrl) : null;
  const isDirectVideo = isVideoMode && !youtubeId && hasVideoUrl;

  const fallbackPoster = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600";
  const effectivePoster =
    posterUrl || (youtubeId ? getYouTubeThumbnail(youtubeId) : fallbackPoster);

  const renderTitle = () => {
    const rawTitle = title || "Discover Events That Inspire You";
    const highlight = titleHighlight?.trim();
    if (!highlight || !rawTitle.toLowerCase().includes(highlight.toLowerCase())) {
      return rawTitle;
    }
    const idx = rawTitle.toLowerCase().indexOf(highlight.toLowerCase());
    const before = rawTitle.slice(0, idx);
    const matched = rawTitle.slice(idx, idx + highlight.length);
    const after = rawTitle.slice(idx + highlight.length);
    return (
      <>
        {before}
        <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
          {matched}
        </span>
        {after}
      </>
    );
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden min-h-[540px] md:min-h-[600px] flex items-center">
      {/* Base Layer: Poster Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
        style={{ backgroundImage: `url('${effectivePoster}')` }}
      />

      {/* Priority 1A: YouTube Background Loop */}
      {isVideoMode && youtubeId && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={buildYouTubeBackgroundUrl(youtubeId)}
            title="Hero Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover opacity-60 md:opacity-70 scale-[1.3] pointer-events-none select-none transition-opacity duration-1000"
            tabIndex={-1}
            loading="eager"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* Priority 1B: Direct Video Loop */}
      {isVideoMode && isDirectVideo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={effectivePoster}
            className="w-full h-full object-cover opacity-35 transition-opacity duration-1000"
          >
            <source src={videoUrl!} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Cinematic Vignette for maximum legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full z-10">
        <div className="max-w-3xl">
          {/* Subtle Aesthetic Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-white/90 mb-5 border border-white/15 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{badgeText || "Addis Ababa's Premier Event Hub"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
            {renderTitle()}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Option 1: Translucent Frosted Glass Search Bar */}
          <form
            action="/discover"
            method="GET"
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-white/15 focus-within:border-indigo-400/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all group"
          >
            <div className="flex-1 flex items-center gap-3 px-3.5">
              <Search className="w-5 h-5 text-slate-400 shrink-0 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                name="q"
                placeholder={searchPlaceholder || "Search events, venues, categories in Addis..."}
                className="w-full py-2.5 text-white placeholder:text-slate-400 focus:outline-none text-sm md:text-base bg-transparent font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--color-primary)] hover:opacity-95 text-white font-bold px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 text-sm shrink-0"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Clean Trending Tags */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Trending:</span>
            {["Technology", "Music", "Business", "Startups"].map((cat) => (
              <Link
                key={cat}
                href={`/discover?category=${cat.toLowerCase()}`}
                prefetch={true}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 hover:text-white transition border border-white/10 backdrop-blur-xs active:scale-95"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
