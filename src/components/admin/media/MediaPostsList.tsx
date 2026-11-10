"use client";

import Link from "next/link";
import { Film, FileText, Globe, Star, Edit2, Trash2, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  extractExternalDomain,
  resolveMediaPoster,
  type MediaPostItem,
} from "@/lib/media-types";

type Props = {
  posts: MediaPostItem[];
  onEdit: (post: MediaPostItem) => void;
  onDelete: (post: MediaPostItem) => void;
  onToggleFeatured: (post: MediaPostItem) => void;
};

export function MediaPostsList({ posts, onEdit, onDelete, onToggleFeatured }: Props) {
  if (posts.length === 0) {
    return (
      <div className="bg-white theme-radius-card border border-slate-200 p-16 text-center text-slate-400">
        <Film className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-700 text-base">No media posts published yet</p>
        <p className="text-xs mt-1">Upload an expo vlog, YouTube highlight, blog recap, or press coverage link.</p>
      </div>
    );
  }

  return (
    <div className="bg-white theme-radius-card border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
      {posts.map((post) => {
        const poster = resolveMediaPoster(post);
        const domain = extractExternalDomain(post.externalUrl);
        const previewHref =
          post.kind === "EXTERNAL_LINK" && post.externalUrl
            ? post.externalUrl
            : `/stories/${post.slug}`;

        return (
          <div
            key={post.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-start gap-4 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt={post.title}
                className="w-24 h-16 object-cover rounded-xl border border-slate-200 bg-slate-900 shrink-0"
              />

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full theme-badge border font-bold">
                    {post.kind === "VIDEO_VLOG" ? (
                      <>
                        <Film className="w-3 h-3" /> Video / Vlog
                      </>
                    ) : post.kind === "EXTERNAL_LINK" ? (
                      <>
                        <Globe className="w-3 h-3" /> {domain || "External"}
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3" /> Blog Story
                      </>
                    )}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      post.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {post.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>

                  <span className="text-slate-400">
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm truncate">{post.title}</h3>

                {post.event && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                    Linked to: <strong className="text-slate-700">{post.event.title}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => onToggleFeatured(post)}
                title={post.isFeatured ? "Unpin from Homepage bottom strip" : "Pin to Homepage bottom strip"}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  post.isFeatured
                    ? "theme-badge-accent border"
                    : "bg-white border-slate-200 text-slate-400 hover:text-amber-500"
                }`}
              >
                <Star className={`w-4 h-4 ${post.isFeatured ? "fill-current" : ""}`} />
              </button>

              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                title="Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => onEdit(post)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-50 transition cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(post)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
