"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminEventsTable, AdminEventRow } from "./AdminEventsTable";
import { EventsSummaryStrip } from "./EventsSummaryStrip";
import { EventsFilterBar, type EventStatusFilter } from "./EventsFilterBar";
import { EventsWorkspaceHeader } from "./EventsWorkspaceHeader";
import { EventModal } from "./EventModal";
import { duplicateEventAsDraft, filterAdminEvents } from "./event-admin-helpers";
import type { OrganizerSelectOption } from "@/lib/events-admin";

interface Props {
  initialEvents: AdminEventRow[];
  initialCurrency: string;
  isAdmin: boolean;
  categories?: Array<{ id: string; name: string }>;
  organizerOptions?: OrganizerSelectOption[];
  autoOpenCreate?: boolean;
  initialEditingEvent?: any;
}

export function EventsWorkspace({
  initialEvents, initialCurrency, isAdmin,
  categories = [], organizerOptions = [], autoOpenCreate = false, initialEditingEvent,
}: Props) {
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
  const [isModalOpen, setIsModalOpen] = useState(autoOpenCreate || Boolean(initialEditingEvent));
  const [modalMode] = useState<"create" | "edit">(initialEditingEvent ? "edit" : "create");

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
    try { await fn(); } catch (err: any) { setError(err.message || fallbackErr); } finally { setBusyId(null); }
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
      setError(`Cannot delete "${evt.title}" because ${orderCount} order${orderCount === 1 ? "" : "s"} are linked to it.`);
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
      <EventsWorkspaceHeader
        isAdmin={isAdmin}
        toast={toast}
        error={error}
        onDismissError={() => setError("")}
        onCreateClick={() => setIsModalOpen(true)}
      />

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
            onToggleStatus={(evt) => patchEventField(evt, { status: evt.status === "PUBLISHED" || evt.status === "LIVE" ? "DRAFT" : "PUBLISHED" }, `"${evt.title}" updated.`)}
            onToggleFeatured={(evt) => patchEventField(evt, { isFeatured: !evt.isFeatured }, !evt.isFeatured ? `Featured "${evt.title}".` : `Unfeatured "${evt.title}".`)}
            onDuplicate={handleDuplicate}
            onRequestDelete={handleRequestDelete}
            onCancelDelete={() => setConfirmDeleteId(null)}
            onConfirmDelete={handleConfirmDelete}
          />
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (autoOpenCreate || initialEditingEvent) {
            router.push("/admin/events");
          }
        }}
        mode={modalMode}
        initialData={initialEditingEvent}
        categories={categories}
        currency={currency}
        canCreateCategory={isAdmin}
        organizerOptions={organizerOptions}
        onSuccess={() => {
          notify(modalMode === "create" ? "Event created successfully!" : "Event updated successfully!");
          reloadEvents();
        }}
      />
    </div>
  );
}
