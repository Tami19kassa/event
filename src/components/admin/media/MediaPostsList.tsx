"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, FileText, Globe, Star, Edit2, Trash2, ExternalLink, Calendar, Eye, EyeOff } from "lucide-react";
import { extractExternalDomain, resolveMediaPoster, type MediaPostItem } from "@/lib/media-types";
import { formatAdminMediaDate } from "@/lib/media-admin-helpers";

type Props = {
  posts: MediaPostItem[];
  busyId: string | null;
  onEdit: (post: MediaPostItem) => void;
  onDelete: (post: MediaPostItem) => void;
  onToggleFeatured: (post: MediaPostItem) => void;
  onToggleStatus: (post: MediaPostItem) => void;
};

export function MediaPostsList({
  posts, busyId, onEdit, onDelete, onToggleFeatured, onToggleStatus,
}: Props) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="bg-white theme-radius-card border border-slate-200 p-14 text-center text-slate-400">
        <Film className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-700 text-sm">No matching stories or videos</p>
        <p className="text-xs mt-1">Try clearing filters or publish an expo vlog, article recap, or press link.</p>
      </div>
    );
  }

  return (
    <div className="bg-white theme-radius-card border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
      {posts.map((post) => {
        const poster = resolveMediaPoster(post);
        const domain = extractExternalDomain(post.externalUrl);
        const previewHref = post.kind === "EXTERNAL_LINK" && post.externalUrl ? post.externalUrl : `/stories/${post.slug}`;
        const busy = busyId === post.id;
        const confirming = confirmDeleteId === post.id;

        return (
          <div key={post.id} className="p-4 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
            <div className="flex items-start gap-3.5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt={post.title}
                className="w-24 h-16 object-cover theme-radius-sm border border-slate-200 bg-slate-100 shrink-0"
              />

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold whitespace-nowrap ${
                      post.kind === "VIDEO_VLOG"
                        ? "theme-badge-secondary"
                        : post.kind === "EXTERNAL_LINK"
                        ? "theme-badge-accent"
                        : "theme-badge"
                    }`}
                  >
                    {post.kind === "VIDEO_VLOG" ? (
                      <><Film className="w-3 h-3" /> Video / Vlog</>
                    ) : post.kind === "EXTERNAL_LINK" ? (
                      <><Globe className="w-3 h-3" /> {domain || "External"}</>
                    ) : (
                      <><FileText className="w-3 h-3" /> Blog Story</>
                    )}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                      post.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {post.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>

                  {post.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full theme-badge-accent border font-bold whitespace-nowrap inline-flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Homepage Lead
                    </span>
                  )}

                  <span className="text-slate-400 whitespace-nowrap">{formatAdminMediaDate(post.publishedAt)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit(post)}
                  className="font-bold text-slate-900 hover:text-[var(--color-primary)] text-sm truncate block max-w-full text-left cursor-pointer transition"
                >
                  {post.title}
                </button>

                {post.event && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 shrink-0" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }} />
                    <span>Linked to: <strong className="text-slate-700">{post.event.title}</strong></span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-center">
              {!confirming ? (
                <>
                  <button
                    type="button" disabled={busy} onClick={() => onToggleStatus(post)}
                    title={post.status === "PUBLISHED" ? "Move to Draft" : "Publish live"}
                    className="px-2.5 py-1.5 theme-radius-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {post.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{post.status === "PUBLISHED" ? "Unpublish" : "Publish"}</span>
                  </button>

                  <button
                    type="button" disabled={busy} onClick={() => onToggleFeatured(post)}
                    title={post.isFeatured ? "Unpin lead slot on homepage" : "Pin first on homepage 3D strip"}
                    className={`p-2 theme-radius-sm border transition cursor-pointer disabled:opacity-50 ${
                      post.isFeatured ? "theme-badge-accent border" : "bg-white border-slate-200 text-slate-400 hover:text-amber-500"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${post.isFeatured ? "fill-current" : ""}`} />
                  </button>

                  <Link
                    href={previewHref} target="_blank" rel="noopener noreferrer" title="Preview live"
                    className="p-2 theme-radius-sm border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button" disabled={busy} onClick={() => onEdit(post)} title="Edit"
                    className="p-2 theme-radius-sm border border-slate-200 bg-white text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button" disabled={busy} onClick={() => setConfirmDeleteId(post.id)} aria-label={`Delete ${post.title}`}
                    className="p-2 theme-radius-sm border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button" disabled={busy}
                    onClick={() => { setConfirmDeleteId(null); onDelete(post); }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold theme-radius-sm cursor-pointer disabled:opacity-50"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button" disabled={busy} onClick={() => setConfirmDeleteId(null)}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold theme-radius-sm hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
