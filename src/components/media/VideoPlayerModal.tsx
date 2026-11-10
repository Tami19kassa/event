"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ArrowUpRight, Calendar, ExternalLink } from "lucide-react";
import type { MediaPostItem } from "@/lib/media-types";
import { resolveVideoSource } from "@/lib/youtube";

type Props = {
  post: MediaPostItem | null;
  onClose: () => void;
};

export function VideoPlayerModal({ post, onClose }: Props) {
  useEffect(() => {
    if (!post) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [post, onClose]);

  if (!post) return null;
  const video = resolveVideoSource(post.videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 theme-radius-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-800">
          <div className="min-w-0">
            <span
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }}
            >
              {post.categoryTag || "Expo Video"}
            </span>
            <h3 className="font-display text-white text-sm sm:text-base truncate">
              {post.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black w-full">
          {video?.type === "youtube" || video?.type === "vimeo" ? (
            <iframe
              src={video.embedUrl}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : video?.type === "direct" ? (
            <video
              src={video.src}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Video stream unavailable.
            </div>
          )}
        </div>

        <div
          data-surface="dark"
          className="px-5 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
            {post.excerpt || "Watch highlights, speaker takeaways, and live floor coverage."}
          </p>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {post.event && (
              <Link
                href={`/events/${post.event.slug}`}
                onClick={onClose}
                className="theme-btn-primary px-3.5 py-2 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Linked Event</span>
              </Link>
            )}
            {post.externalUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-radius-sm px-3.5 py-2 text-xs font-bold border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white inline-flex items-center gap-1.5 transition"
              >
                <span>{post.externalLabel || "Open External Link"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {post.content && (
              <Link
                href={`/stories/${post.slug}`}
                onClick={onClose}
                className="text-xs font-bold text-slate-300 hover:text-white px-2.5 py-2 inline-flex items-center gap-1"
              >
                <span>Read Story</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
