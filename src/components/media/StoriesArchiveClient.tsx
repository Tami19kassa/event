"use client";

import { useMemo, useState } from "react";
import { Search, Film, FileText, Globe, Clapperboard } from "lucide-react";
import type { MediaKind, MediaPostItem } from "@/lib/media-types";
import { MediaPostCard } from "./MediaPostCard";
import { VideoPlayerModal } from "./VideoPlayerModal";

type FilterValue = "ALL" | MediaKind;

const FILTERS: Array<{ value: FilterValue; label: string; icon: any }> = [
  { value: "ALL", label: "All Media", icon: Clapperboard },
  { value: "VIDEO_VLOG", label: "Videos & Vlogs", icon: Film },
  { value: "ARTICLE", label: "Articles & Blogs", icon: FileText },
  { value: "EXTERNAL_LINK", label: "External Press & Links", icon: Globe },
];

export function StoriesArchiveClient({ initialPosts }: { initialPosts: MediaPostItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [query, setQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<MediaPostItem | null>(null);

  const filtered = useMemo(() => {
    return initialPosts.filter((p) => {
      if (filter !== "ALL" && p.kind !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.categoryTag.toLowerCase().includes(q) ||
          p.event?.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialPosts, filter, query]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-2 theme-radius-sm text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                  active
                    ? "theme-nav-active"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vlogs, topics, events..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 theme-radius-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white theme-radius-card border border-slate-200 p-14 text-center space-y-2">
          <Clapperboard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-display text-lg text-slate-800">No stories matched your filter</h3>
          <p className="text-xs text-slate-500">
            Try switching category tabs or clearing your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <MediaPostCard key={post.id} post={post} onPlayVideo={setActiveVideo} />
          ))}
        </div>
      )}

      <VideoPlayerModal post={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
