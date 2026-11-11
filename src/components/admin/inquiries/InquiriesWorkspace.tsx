"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, Download } from "lucide-react";
import {
  downloadInquiriesCsvFile,
  filterAdminInquiries,
  type AdminInquiriesSummary,
  type InquiryRecord,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/inquiries-admin-helpers";
import { InquiriesStats } from "./InquiriesStats";
import { InquiriesFilterBar } from "./InquiriesFilterBar";
import { InquiriesTable } from "./InquiriesTable";
import { InquiryDetailDrawer } from "./InquiryDetailDrawer";

interface WorkspaceProps {
  initialInquiries: InquiryRecord[];
  initialSummary: AdminInquiriesSummary;
  initialTypeFilter?: "ALL" | InquiryType;
  initialStatusFilter?: "ALL" | InquiryStatus;
}

export function InquiriesWorkspace({
  initialInquiries, initialSummary, initialTypeFilter = "ALL", initialStatusFilter = "ALL",
}: WorkspaceProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);
  const [summary, setSummary] = useState<AdminInquiriesSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | InquiryType>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<"ALL" | InquiryStatus>(initialStatusFilter);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => { setError(""); setToast(msg); setTimeout(() => setToast(""), 3500); };

  const reloadSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries?scope=admin");
      if (!res.ok) throw new Error("Failed to reload inquiries.");
      const data = await res.json();
      setInquiries(Array.isArray(data.inquiries) ? data.inquiries : []);
      if (data.summary) setSummary(data.summary);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to reload B2B inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatch = async (id: string, payload: { status?: InquiryStatus; notes?: string }, successMsg: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update inquiry."); return false; }
      showToast(successMsg);
      await reloadSnapshot();
      return true;
    } catch {
      setError("Network error while updating inquiry.");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to delete inquiry.");
      if (inspectedId === id) setInspectedId(null);
      showToast("B2B inquiry removed.");
      await reloadSnapshot();
    } catch {
      setError("Network error while deleting inquiry.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => filterAdminInquiries(inquiries, { search, typeFilter, statusFilter }), [inquiries, search, typeFilter, statusFilter]);
  const inspectedInquiry = useMemo(() => (inspectedId ? inquiries.find((i) => i.id === inspectedId) || null : null), [inquiries, inspectedId]);

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
            Commercial Pipeline
          </span>
          <h1 className="text-2xl font-display text-slate-900">B2B Exhibitor &amp; Sponsor Inquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track stand requests, corporate sponsorships, and sales follow-up notes across your expos.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button" disabled={filtered.length === 0}
            onClick={() => { downloadInquiriesCsvFile(filtered); showToast(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"} to CSV.`); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button type="button" onClick={reloadSnapshot} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      <InquiriesStats summary={summary} activeTypeFilter={typeFilter} activeStatusFilter={statusFilter} onSelectType={setTypeFilter} onSelectStatus={setStatusFilter} />

      <InquiriesFilterBar summary={summary} search={search} onSearchChange={setSearch} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />

      {summary.totalCount > inquiries.length && (
        <p className="text-xs text-slate-500">Showing latest {inquiries.length.toLocaleString()} of {summary.totalCount.toLocaleString()} inquiries. Top KPI cards reflect full totals.</p>
      )}

      <InquiriesTable
        inquiries={filtered} busyId={busyId} onInspect={(row) => setInspectedId(row.id)}
        onStatusChange={(id, status) => handlePatch(id, { status }, `Lead marked as ${status.toLowerCase()}.`)}
        onDelete={handleDelete}
      />

      <InquiryDetailDrawer
        inquiry={inspectedInquiry} busy={Boolean(inspectedInquiry && busyId === inspectedInquiry.id)}
        onClose={() => setInspectedId(null)}
        onStatusChange={(id, status) => handlePatch(id, { status }, `Lead marked as ${status.toLowerCase()}.`)}
        onSaveNotes={(id, notes) => handlePatch(id, { notes }, "Sales follow-up notes saved.")}
        onDelete={handleDelete}
      />
    </div>
  );
}
