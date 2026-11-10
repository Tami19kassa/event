"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { AdminEventsTable, AdminEventRow } from "@/components/admin/events/AdminEventsTable";
import { EventsSummaryStrip } from "@/components/admin/events/EventsSummaryStrip";
import { EventsFilterBar, type EventStatusFilter } from "@/components/admin/events/EventsFilterBar";
import { duplicateEventAsDraft, filterAdminEvents } from "@/components/admin/events/event-admin-helpers";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [currency, setCurrency] = useState("ETB");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("ALL");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const notify = (msg: string) => {
    setError("");
    setToast(msg);
    setTimeout(() => setToast(""), 3800);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [evRes, payRes] = await Promise.all([
        fetch("/api/events?limit=200"),
        fetch("/api/settings/payments"),
      ]);
      const evJson = await evRes.json();
      setEvents(Array.isArray(evJson) ? evJson : []);
      if (payRes.ok) {
        const payJson = await payRes.json();
        if (payJson?.currency) setCurrency(payJson.currency);
      }
    } catch {
      setError("Failed to load events catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (id: string, fn: () => Promise<void>, fallbackErr: string) => {
    setBusyId(id);
    setError("");
    try {
      await fn();
    } catch (err: any) {
      setError(err.message || fallbackErr);
    } finally {
      setBusyId(null);
    }
  };

  const patchEventField = (evt: AdminEventRow, patch: Record<string, any>, msg: string) =>
    runAction(
      evt.id,
      async () => {
        const res = await fetch(`/api/events/${evt.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Update failed");
        notify(msg);
        await load();
      },
      "Update failed."
    );

  const handleToggleStatus = (evt: AdminEventRow) => {
    const next = evt.status === "PUBLISHED" || evt.status === "LIVE" ? "DRAFT" : "PUBLISHED";
    return patchEventField(evt, { status: next }, `"${evt.title}" updated to ${next}.`);
  };

  const handleToggleFeatured = (evt: AdminEventRow) => {
    const next = !evt.isFeatured;
    return patchEventField(evt, { isFeatured: next }, next ? `Featured "${evt.title}" on homepage.` : `Removed "${evt.title}" from Featured.`);
  };

  const handleDuplicate = (evt: AdminEventRow) =>
    runAction(
      evt.id,
      async () => {
        const created = await duplicateEventAsDraft(evt.id, currency);
        notify(`Created draft copy "${created.title}". Opening editor...`);
        router.push(`/admin/events/${created.id}/edit`);
      },
      "Failed to duplicate event."
    );

  const handleDelete = (evt: AdminEventRow) => {
    const orderCount = evt._count?.orders || 0;
    if (orderCount > 0) {
      setError(`Cannot delete "${evt.title}" because ${orderCount} order${orderCount === 1 ? "" : "s"} are linked to it. Change its status to Ended or Cancelled in Edit instead.`);
      return;
    }
    if (!confirm(`Delete "${evt.title}"? This action cannot be undone.`)) return;
    return runAction(
      evt.id,
      async () => {
        const res = await fetch(`/api/events/${evt.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Delete failed");
        notify(`Deleted "${evt.title}".`);
        await load();
      },
      "Failed to delete event."
    );
  };

  const filtered = useMemo(
    () => filterAdminEvents(events, search, statusFilter, featuredOnly),
    [events, search, statusFilter, featuredOnly]
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
          <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}>
            Catalog &amp; Media
          </span>
          <h1 className="text-2xl font-display text-slate-900">Events Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish events, feature homepage highlights, clone repeating expos, and track pass inventory.
          </p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold theme-btn-primary shadow-xs self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}
      <EventsSummaryStrip events={events} />
      <EventsFilterBar
        totalCount={events.length}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        featuredOnly={featuredOnly}
        onToggleFeaturedOnly={() => setFeaturedOnly((v) => !v)}
        search={search}
        onSearchChange={setSearch}
        loading={loading}
        onRefresh={load}
      />
      <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
        {loading && events.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            <span className="text-xs font-medium">Loading events catalog...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No events match your filters</p>
            <p className="text-xs text-slate-400">Try clearing the search query or switching status tabs.</p>
          </div>
        ) : (
          <AdminEventsTable
            events={filtered}
            currency={currency}
            busyId={busyId}
            onToggleStatus={handleToggleStatus}
            onToggleFeatured={handleToggleFeatured}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
