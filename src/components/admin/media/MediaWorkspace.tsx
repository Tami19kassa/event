"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { MediaPostItem } from "@/lib/media-types";
import {
  filterAdminMediaPosts,
  type AdminMediaSummary,
  type MediaEventOption,
  type MediaKindFilter,
  type MediaStatusFilter,
} from "@/lib/media-admin-helpers";
import { MediaStats } from "./MediaStats";
import { MediaFilterBar } from "./MediaFilterBar";
import { MediaPostsList } from "./MediaPostsList";
import { MediaFormModal } from "./MediaFormModal";

interface WorkspaceProps {
  initialPosts: MediaPostItem[];
  initialEvents: MediaEventOption[];
  initialSummary: AdminMediaSummary;
}

export function MediaWorkspace({ initialPosts, initialEvents, initialSummary }: WorkspaceProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<MediaPostItem[]>(initialPosts);
  const [events, setEvents] = useState<MediaEventOption[]>(initialEvents);
  const [summary, setSummary] = useState<AdminMediaSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<MediaKindFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<MediaStatusFilter>("ALL");
  const [eventId, setEventId] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaPostItem | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => { setError(""); setToast(msg); setTimeout(() => setToast(""), 3500); };

  const upsertLocalPost = (saved?: MediaPostItem) => {
    if (!saved) return;
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      const next = idx >= 0 ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
      return [...next].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || +new Date(b.publishedAt) - +new Date(a.publishedAt)
      );
    });
  };

  const reloadSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media?scope=admin");
      if (!res.ok) throw new Error("Failed to refresh media library.");
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (data.summary) setSummary(data.summary);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to load media library.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatch = async (post: MediaPostItem, payload: Record<string, any>, msg: string) => {
    setBusyId(post.id);
    setError("");
    try {
      const res = await fetch(`/api/media/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Update failed.");
      upsertLocalPost(data as MediaPostItem);
      showToast(msg);
      await reloadSnapshot();
    } catch {
      setError("Network error while updating media item.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (post: MediaPostItem) => {
    setBusyId(post.id);
    setError("");
    try {
      const res = await fetch(`/api/media/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Delete failed.");
      showToast(`Deleted "${post.title}".`);
      await reloadSnapshot();
    } catch {
      setError("Network error while deleting media item.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => filterAdminMediaPosts(posts, { search, kindFilter, statusFilter, eventId }), [posts, search, kindFilter, statusFilter, eventId]);

  return (
    <div className="p-4 sm:p-6 md:px-8 md:py-6 space-y-4 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold theme-radius shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}>
            Editorial &amp; Video Hub
          </span>
          <h1 className="text-2xl font-display text-slate-900">Media, Vlogs &amp; Stories</h1>
          <p className="text-xs text-slate-500 mt-0.5">Publish expo highlight vlogs, articles, and press links — automatically featured in /stories and the homepage 3D showcase.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={reloadSnapshot} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} /> Refresh
          </button>
          <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="px-4 py-2 text-xs sm:text-sm font-bold theme-btn-primary inline-flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <Plus className="w-4 h-4" /> <span>Add Video / Story</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      <MediaStats summary={summary} kindFilter={kindFilter} statusFilter={statusFilter} onSelectKind={setKindFilter} onSelectStatus={setStatusFilter} />

      <MediaFilterBar
        summary={summary} search={search} onSearchChange={setSearch}
        kindFilter={kindFilter} onKindFilterChange={setKindFilter}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        eventId={eventId} onEventIdChange={setEventId} events={events}
      />

      <MediaPostsList
        posts={filtered}
        busyId={busyId}
        onEdit={(p) => { setEditing(p); setModalOpen(true); }}
        onDelete={handleDelete}
        onToggleFeatured={(p) =>
          handlePatch(
            p,
            { isFeatured: !p.isFeatured },
            !p.isFeatured ? `"${p.title}" pinned first on homepage.` : `Unpinned "${p.title}" from lead slot.`
          )
        }
        onToggleStatus={(p) =>
          handlePatch(
            p,
            { status: p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
            p.status === "PUBLISHED" ? `Moved "${p.title}" to drafts.` : `Published "${p.title}" live.`
          )
        }
      />

      <MediaFormModal
        isOpen={modalOpen}
        editing={editing}
        events={events}
        onClose={() => setModalOpen(false)}
        onSaved={(msg, saved) => { upsertLocalPost(saved); showToast(msg); reloadSnapshot(); }}
      />
    </div>
  );
}
