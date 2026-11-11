"use client";

import { useMemo, useState } from "react";
import { Layers, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AdminCategoryRow } from "@/lib/categories-admin";
import { CategoriesSummaryStrip } from "./CategoriesSummaryStrip";
import { CategoriesFilterBar, type CategoryFilter } from "./CategoriesFilterBar";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { CategoryRowCard } from "./CategoryRowCard";

interface Props {
  initialCategories: AdminCategoryRow[];
}

export function CategoriesWorkspace({ initialCategories }: Props) {
  const [categories, setCategories] = useState<AdminCategoryRow[]>(initialCategories);
  const [filter, setFilter] = useState<CategoryFilter>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setError("");
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const reloadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories?scope=admin");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch {
      setError("Failed to refresh event types.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (
    id: string,
    payload: { name: string; slug: string; icon: string }
  ) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update event type");
      showToast(`Updated "${payload.name}".`);
      await reloadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to update event type");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, reassignTo?: string) => {
    setBusyId(id);
    setError("");
    try {
      const qs = reassignTo ? `?reassignTo=${encodeURIComponent(reassignTo)}` : "";
      const res = await fetch(`/api/categories/${id}${qs}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete event type");
      showToast(reassignTo ? "Events moved and event type removed." : "Event type deleted.");
      await reloadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete event type");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((c) => {
      const matchSearch =
        !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
      const matchFilter =
        filter === "ALL" ? true : filter === "ACTIVE" ? c.totalCount > 0 : c.totalCount === 0;
      return matchSearch && matchFilter;
    });
  }, [categories, search, filter]);

  const totalLive = useMemo(
    () => categories.reduce((sum, c) => sum + c.liveCount, 0),
    [categories]
  );

  return (
    <div className="p-5 sm:p-6 md:p-8 space-y-5 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold theme-radius shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-0.5"
            style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}
          >
            Catalog &amp; Media
          </span>
          <h1 className="text-2xl font-display text-slate-900">Event Types &amp; Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize public homepage browsing pills, Discover filters, and organizer classifications.
          </p>
        </div>
        <button
          type="button"
          onClick={reloadCategories}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <CategoriesSummaryStrip categories={categories} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <CreateCategoryForm
            onCreated={async (createdName) => {
              showToast(`Created "${createdName}".`);
              await reloadCategories();
            }}
            onError={setError}
          />
        </div>

        <div className="lg:col-span-8 space-y-3.5">
          <CategoriesFilterBar
            totalCount={categories.length}
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
          />

          <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-14 text-center space-y-2">
                <Layers className="w-9 h-9 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No matching event types</p>
                <p className="text-xs text-slate-400">Try clearing your search or create a new event type.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((cat) => (
                  <CategoryRowCard
                    key={cat.id}
                    category={cat}
                    otherCategories={categories.filter((c) => c.id !== cat.id)}
                    totalLiveAcrossSite={totalLive}
                    busy={busyId === cat.id}
                    onSaveEdit={handleSaveEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
