"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, AlertCircle, Film, Globe, FileText, Clapperboard } from "lucide-react";
import type { MediaKind, MediaPostItem } from "@/lib/media-types";
import { MediaPostsList } from "@/components/admin/media/MediaPostsList";
import { MediaFormModal } from "@/components/admin/media/MediaFormModal";

type FilterKind = "ALL" | MediaKind;
type EventOption = { id: string; title: string };

export default function AdminMediaPage() {
  const [posts, setPosts] = useState<MediaPostItem[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [filter, setFilter] = useState<FilterKind>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaPostItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [mediaRes, eventsRes] = await Promise.all([
        fetch("/api/media?scope=admin"),
        fetch("/api/events?limit=100"),
      ]);
      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        setPosts(Array.isArray(mediaJson) ? mediaJson : []);
      }
      if (eventsRes.ok) {
        const eventsJson = await eventsRes.json();
        if (Array.isArray(eventsJson)) {
          setEvents(eventsJson.map((e: any) => ({ id: e.id, title: e.title })));
        }
      }
    } catch {
      setError("Failed to load media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeatured = async (post: MediaPostItem) => {
    try {
      const res = await fetch(`/api/media/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isFeatured: !post.isFeatured }),
      });
      if (res.ok) loadData();
    } catch {}
  };

  const handleDelete = async (post: MediaPostItem) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      const res = await fetch(`/api/media/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      loadData();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const filtered = useMemo(
    () => (filter === "ALL" ? posts : posts.filter((p) => p.kind === filter)),
    [posts, filter]
  );

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Editorial &amp; Video Hub
          </span>
          <h1 className="text-3xl font-display text-slate-900">Media, Vlogs &amp; Stories</h1>
          <p className="text-slate-500 text-sm mt-1">
            Publish event highlight videos, vlogs, articles, or external press links to `/` and `/stories`.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold theme-btn-primary inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video / Story</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {[
          { val: "ALL" as FilterKind, label: `All (${posts.length})`, icon: Clapperboard },
          { val: "VIDEO_VLOG" as FilterKind, label: "Videos & Vlogs", icon: Film },
          { val: "ARTICLE" as FilterKind, label: "Blog Articles", icon: FileText },
          { val: "EXTERNAL_LINK" as FilterKind, label: "External Links", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = filter === tab.val;
          return (
            <button
              key={tab.val}
              type="button"
              onClick={() => setFilter(tab.val)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition ${
                active ? "theme-nav-active" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <MediaPostsList
        posts={filtered}
        onEdit={(p) => {
          setEditing(p);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
      />

      <MediaFormModal
        isOpen={modalOpen}
        editing={editing}
        events={events}
        onClose={() => setModalOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
