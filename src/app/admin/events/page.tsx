"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { AdminEventsTable, AdminEventRow } from "@/components/admin/events/AdminEventsTable";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setToast(`Event status updated to ${nextStatus}!`);
        setTimeout(() => setToast(""), 3500);
        load();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setToast(`Event deleted successfully.`);
      setTimeout(() => setToast(""), 3500);
      load();
    }
  };

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.slug.includes(q);
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 md:p-10 space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Catalog Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Toggle events live on the main page, monitor ticket sales, and manage Addis catalog.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm cursor-pointer"
        >
          <option value="ALL">All statuses</option>
          <option value="PUBLISHED">Published (Live on Main)</option>
          <option value="DRAFT">Draft (Hidden)</option>
          <option value="LIVE">Live Now</option>
        </select>
        <button
          onClick={load}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && events.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-sm">Loading events catalog...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No events found matching your criteria.</div>
        ) : (
          <AdminEventsTable
            events={filtered}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
