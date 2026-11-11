"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { AdminEventsTable, AdminEventRow } from "./AdminEventsTable";
import { EventsSummaryStrip } from "./EventsSummaryStrip";
import { EventsFilterBar, type EventStatusFilter } from "./EventsFilterBar";
import { duplicateEventAsDraft, filterAdminEvents } from "./event-admin-helpers";

interface Props {
  initialEvents: AdminEventRow[];
  initialCurrency: string;
  isAdmin: boolean;
}

export function EventsWorkspace({ initialEvents, initialCurrency, isAdmin }: Props) {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEventRow[]>(initialEvents);
  const [currency] = useState(initialCurrency || "ETB");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

  const reloadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?scope=admin&limit=200");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to refresh events.");
      setEvents(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load events catalog.");
    } finally {
      setLoading(false);
    }
  };

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
        await reloadEvents();
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
  const handleRequestDelete = (evt: AdminEventRow) => {
    const orderCount = evt._count?.orders || 0;
    if (orderCount > 0) {
      setConfirmDeleteId(null);
      setError(`Cannot delete "${evt.title}" because ${orderCount} order${orderCount === 1 ? "" : "s"} are linked to it. Set status to Ended or Cancelled in Edit.`);
      return;
    }
    setError("");
    setConfirmDeleteId(evt.id);
  };
  const handleConfirmDelete = (evt: AdminEventRow) =>
    runAction(
      evt.id,
      async () => {
        const res = await fetch(`/api/events/${evt.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Delete failed");
        setConfirmDeleteId(null);
        notify(`Deleted "${evt.title}".`);
        await reloadEvents();
      },
      "Failed to delete event."
    );

  const filtered = useMemo(() => filterAdminEvents(events, search, statusFilter, featuredOnly), [events, search, statusFilter, featuredOnly]);

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
          <h1 className="text-2xl font-display text-slate-900">{isAdmin ? "Events Catalog" : "My Events Catalog"}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? "Publish events, feature homepage highlights, reassign hosts, and track pass inventory."
              : "Manage, publish, duplicate, and monitor ticket inventory for your own events."}
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
        onRefresh={reloadEvents}
      />
      <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-14 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">{events.length === 0 ? "No events assigned to you yet" : "No events match your filters"}</p>
            <p className="text-xs text-slate-400">
              {events.length === 0 ? "Click Create Event to publish your first event or expo." : "Try clearing the search query or switching status tabs."}
            </p>
          </div>
        ) : (
          <AdminEventsTable
            events={filtered}
            currency={currency}
            busyId={busyId}
            confirmDeleteId={confirmDeleteId}
            showOrganizer={isAdmin}
            onToggleStatus={handleToggleStatus}
            onToggleFeatured={handleToggleFeatured}
            onDuplicate={handleDuplicate}
            onRequestDelete={handleRequestDelete}
            onCancelDelete={() => setConfirmDeleteId(null)}
            onConfirmDelete={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
}
