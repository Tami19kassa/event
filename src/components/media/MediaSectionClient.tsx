"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clapperboard, Film, FileText, Globe } from "lucide-react";
import type { MediaKind, MediaPostItem } from "@/lib/media-types";
import { MediaPostCard } from "./MediaPostCard";
import { VideoPlayerModal } from "./VideoPlayerModal";

type FilterKind = "ALL" | MediaKind;

function circularOffset(index: number, active: number, total: number): number {
  if (total <= 1) return 0;
  let diff = index - active;
  if (total >= 3) {
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
  }
  return diff;
}

export function MediaSectionClient({ posts }: { posts: MediaPostItem[] }) {
  const stageHostRef = useRef<HTMLDivElement>(null);
  const [kindFilter, setKindFilter] = useState<FilterKind>("ALL");
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeVideo, setActiveVideo] = useState<MediaPostItem | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visiblePosts = useMemo(
    () => (kindFilter === "ALL" ? posts : posts.filter((p) => p.kind === kindFilter)).slice(0, 6),
    [posts, kindFilter]
  );

  const total = visiblePosts.length;
  const safeIdx = total > 0 ? activeIdx % total : 0;

  useEffect(() => {
    setActiveIdx(0);
  }, [kindFilter]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      setInView(true);
      return;
    }
    const el = stageHostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (posts.length === 0) return null;

  const kinds: { key: FilterKind; label: string; icon: typeof Clapperboard; count: number }[] = (
    [
      { key: "ALL" as FilterKind, label: "All Highlights", icon: Clapperboard, count: posts.length },
      { key: "VIDEO_VLOG" as FilterKind, label: "Videos & Vlogs", icon: Film, count: posts.filter((p) => p.kind === "VIDEO_VLOG").length },
      { key: "ARTICLE" as FilterKind, label: "Blogs & Articles", icon: FileText, count: posts.filter((p) => p.kind === "ARTICLE").length },
      { key: "EXTERNAL_LINK" as FilterKind, label: "Press & Links", icon: Globe, count: posts.filter((p) => p.kind === "EXTERNAL_LINK").length },
    ]
  ).filter((t) => t.key === "ALL" || t.count > 0);

  const goPrev = () => setActiveIdx((c) => (c - 1 + total) % total);
  const goNext = () => setActiveIdx((c) => (c + 1) % total);

  return (
    <>
      <div ref={stageHostRef} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {kinds.map((tab) => {
              const active = kindFilter === tab.key;
              return (
                <button
                  key={tab.key} type="button" onClick={() => setKindFilter(tab.key)}
                  className={`px-3 py-1.5 theme-radius-sm text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                    active ? "theme-nav-active" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {total > 1 && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 mr-1">
                {safeIdx + 1} / {total}
              </span>
              <button type="button" onClick={goPrev} aria-label="Previous story" className="p-2 bg-white border border-slate-200 hover:border-slate-300 theme-radius-sm text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={goNext} aria-label="Next story" className="p-2 bg-white border border-slate-200 hover:border-slate-300 theme-radius-sm text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop 3D Perspective Stage */}
        <div
          data-media-3d-stage="true"
          style={{
            perspective: reducedMotion ? undefined : "1400px",
            transformStyle: reducedMotion ? undefined : "preserve-3d",
            transform: inView || reducedMotion ? "rotateX(0deg) translateY(0px)" : "rotateX(12deg) translateY(28px)",
            opacity: inView || reducedMotion ? 1 : 0.15,
            transition: "transform 750ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease",
          }}
          className="hidden md:block relative h-[468px] w-full overflow-visible select-none"
        >
          {visiblePosts.map((post, idx) => {
            const offset = circularOffset(idx, safeIdx, total);
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const tx = offset === 0 ? "0%" : `${offset * 66}%`;
            const tz = offset === 0 ? "0px" : `${-115 * absOffset}px`;
            const ry = offset === 0 ? "0deg" : `${offset * -22}deg`;
            const sc = offset === 0 ? 1 : absOffset === 1 ? 0.88 : 0.76;
            const opacity = absOffset > 2 ? 0 : absOffset === 2 ? 0.55 : isCenter ? 1 : 0.92;
            const zIndex = 40 - absOffset * 10;

            return (
              <div
                key={post.id}
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: "380px",
                  zIndex,
                  opacity,
                  transformOrigin: "center center",
                  transform: reducedMotion
                    ? `translateX(calc(-50% + ${offset * 405}px))`
                    : `translateX(-50%) translate3d(${tx}, ${absOffset * 8}px, ${tz}) rotateY(${ry}) scale(${sc})`,
                  transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",
                  pointerEvents: absOffset > 2 ? "none" : "auto",
                  cursor: isCenter ? "auto" : "pointer",
                }}
              >
                <div className={!isCenter ? "[&_a]:pointer-events-none [&_button]:pointer-events-none" : ""}>
                  <MediaPostCard post={post} onPlayVideo={setActiveVideo} elevated={isCenter} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal 3D-Snap Strip */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth -mx-4 px-4 no-scrollbar">
          {visiblePosts.map((post) => (
            <div key={post.id} className="w-[84vw] sm:w-[330px] shrink-0 snap-center">
              <MediaPostCard post={post} onPlayVideo={setActiveVideo} />
            </div>
          ))}
        </div>

        {total > 1 && (
          <div className="hidden md:flex items-center justify-center gap-2 pt-1">
            {visiblePosts.map((p, idx) => {
              const active = idx === safeIdx;
              return (
                <button
                  key={p.id} type="button" onClick={() => setActiveIdx(idx)} aria-label={`Focus ${p.title}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    active ? "w-7 bg-[var(--color-primary)]" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      <VideoPlayerModal post={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
