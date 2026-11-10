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

export function MediaPostCard({ post, onPlayVideo }: Props) {
  const poster = resolveMediaPoster(post);
  const isVideo = post.kind === "VIDEO_VLOG" && Boolean(post.videoUrl);
  const isExternal = post.kind === "EXTERNAL_LINK" && Boolean(post.externalUrl);
  const externalDomain = extractExternalDomain(post.externalUrl);
  const publishedLabel = format(new Date(post.publishedAt), "MMM d, yyyy");

  const cardInner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-900 rounded-full shadow-xs inline-flex items-center gap-1">
            {isVideo ? (
              <>
                <Play className="w-3 h-3 fill-current text-[var(--color-primary)]" />
                <span>Vlog / Video</span>
              </>
            ) : isExternal ? (
              <>
                <Globe className="w-3 h-3 text-[var(--color-primary)]" />
                <span>{externalDomain || "External"}</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3 text-[var(--color-primary)]" />
                <span>{post.categoryTag || "Story"}</span>
              </>
            )}
          </span>
        </div>

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              style={{
                background: "var(--hero-bg, var(--color-primary))",
                color: "var(--color-primary-foreground, #ffffff)",
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border border-white/25"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {isVideo && post.duration && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/85 text-white text-[11px] font-bold border border-white/15">
            {post.duration}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            {post.categoryTag && (
              <>
                <span className="text-[var(--color-primary)] font-semibold uppercase tracking-wider text-[11px]">
                  {post.categoryTag}
                </span>
                <span>·</span>
              </>
            )}
            <span className="text-slate-500">{publishedLabel}</span>
          </div>

          <h3 className="font-display text-slate-900 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors mb-2 text-base leading-snug">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 mt-1 flex items-center justify-between gap-2 text-xs">
          {post.event ? (
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium truncate">
              <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }} />
              <span className="truncate">{post.event.title}</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium">
              {isVideo ? "Watch video" : isExternal ? "External link" : "Read story"}
            </span>
          )}

          <span className="font-bold text-[var(--color-primary)] inline-flex items-center gap-1 shrink-0">
            {isVideo ? "Play" : isExternal ? "Visit" : "Read"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </>
  );

  const cardClass =
    "group bg-white theme-radius-card overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full text-left";

  if (isVideo) {
    return (
      <button type="button" onClick={() => onPlayVideo(post)} className={`${cardClass} cursor-pointer w-full`}>
        {cardInner}
      </button>
    );
  }

  if (isExternal && post.externalUrl) {
    return (
      <a
        href={post.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <Link href={`/stories/${post.slug}`} prefetch={true} className={cardClass}>
      {cardInner}
    </Link>
  );
}
