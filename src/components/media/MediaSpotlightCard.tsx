"use client";

import Link from "next/link";
import { Play, ArrowUpRight, FileText, Globe, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  extractExternalDomain,
  resolveMediaPoster,
  type MediaPostItem,
} from "@/lib/media-types";

type Props = {
  post: MediaPostItem;
  onPlayVideo: (post: MediaPostItem) => void;
};

export function MediaSpotlightCard({ post, onPlayVideo }: Props) {
  const poster = resolveMediaPoster(post);
  const isVideo = post.kind === "VIDEO_VLOG" && Boolean(post.videoUrl);
  const isExternal = post.kind === "EXTERNAL_LINK" && Boolean(post.externalUrl);
  const externalDomain = extractExternalDomain(post.externalUrl);
  const dateLabel = format(new Date(post.publishedAt), "MMM d, yyyy");

  const mediaVisual = (
    <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[240px] overflow-hidden bg-slate-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold theme-pill-accent shadow-sm">
          Featured Highlight
        </span>
        {isVideo && post.duration && (
          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-xs font-bold border border-white/15">
            {post.duration}
          </span>
        )}
      </div>

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              background: "var(--hero-bg, var(--color-primary))",
              color: "var(--color-primary-foreground, #ffffff)",
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-2 border-white/30"
          >
            <Play className="w-7 h-7 fill-current ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="group bg-white theme-radius-card border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {isVideo ? (
          <button
            type="button"
            onClick={() => onPlayVideo(post)}
            className="block w-full h-full cursor-pointer text-left"
          >
            {mediaVisual}
          </button>
        ) : isExternal && post.externalUrl ? (
          <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
            {mediaVisual}
          </a>
        ) : (
          <Link href={`/stories/${post.slug}`} className="block h-full">
            {mediaVisual}
          </Link>
        )}
      </div>

      <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full theme-badge border font-bold text-[11px]">
              {isVideo ? (
                <>
                  <Play className="w-3 h-3 fill-current" /> Video / Vlog
                </>
              ) : isExternal ? (
                <>
                  <Globe className="w-3 h-3" /> {externalDomain || "External Feature"}
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" /> {post.categoryTag || "Editorial"}
                </>
              )}
            </span>
            <span>·</span>
            <span>{dateLabel}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl text-slate-900 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {isVideo ? (
            <button
              type="button"
              onClick={() => onPlayVideo(post)}
              className="theme-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Video</span>
            </button>
          ) : isExternal && post.externalUrl ? (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>{post.externalLabel || "Open Feature"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={`/stories/${post.slug}`}
              className="theme-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>Read Full Story</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}

          {post.event && (
            <Link
              href={`/events/${post.event.slug}`}
              className="theme-radius-sm px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition inline-flex items-center gap-1.5 max-w-full"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]" />
              <span className="truncate">{post.event.title}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
