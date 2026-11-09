"use client";

import Link from "next/link";
import { Search, ArrowRight, Play, Youtube } from "lucide-react";
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
  badgeText = "Live Visual Atmosphere",
  title = "Discover Events That Inspire You",
  titleHighlight = "Inspire",
  subtitle = "From tech summits at Millennium Hall to cultural concerts at Friendship Park — explore the vibrant pulse of Addis Ababa.",
  searchPlaceholder = "Search events in Addis Ababa, venues, categories...",
}: HeroSectionProps) {
  // Video Resolution Hierarchy (Priority System)
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
        <span className="text-amber-400">{matched}</span>
        {after}
      </>
    );
  };

  return (
    <section className="relative bg-[var(--hero-bg)] text-white overflow-hidden min-h-[560px] md:min-h-[620px] flex items-center">
      {/* Base Layer: Poster Image (Always present for zero white-flash transition) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
        style={{ backgroundImage: `url('${effectivePoster}')` }}
      />

      {/* Priority 1A: YouTube Background Loop Stream */}
      {isVideoMode && youtubeId && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={buildYouTubeBackgroundUrl(youtubeId)}
            title="Hero YouTube Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover opacity-65 md:opacity-75 scale-[1.3] pointer-events-none select-none transition-opacity duration-1000"
            tabIndex={-1}
            loading="eager"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* Priority 1B: Direct MP4 / WebM Video Stream */}
      {isVideoMode && isDirectVideo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={effectivePoster}
            className="w-full h-full object-cover opacity-40 transition-opacity duration-1000"
          >
            <source src={videoUrl!} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Atmospheric Overlays for Maximum Contrast & Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/35 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/70 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full z-10">
        <div className="max-w-3xl">
          {isVideoMode && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 mb-5 border border-white/15 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              {youtubeId ? (
                <Youtube className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-amber-300 shrink-0" />
              )}
              <span>{badgeText || "Live Visual Atmosphere"}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-700">
            {renderTitle()}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-800">
            {subtitle}
          </p>

          {/* Search Form */}
          <form
            action="/discover"
            method="GET"
            className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-5 duration-900 group hover:border-indigo-400/40 transition-colors"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-slate-400 shrink-0 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="q"
                placeholder={searchPlaceholder || "Search events in Addis Ababa, venues, categories..."}
                className="w-full py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm md:text-base bg-transparent font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--color-primary)] hover:opacity-95 text-white font-bold px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <span className="text-white/70">Popular in Addis:</span>
            {["Technology", "Music", "Business", "Startups"].map((cat) => (
              <Link
                key={cat}
                href={`/discover?category=${cat.toLowerCase()}`}
                prefetch={true}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10 hover:border-white/30 backdrop-blur-xs active:scale-95"
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
