"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Mail, Building2, Award, CheckCircle2 } from "lucide-react";
import { InquiryRow, InquiryRecord } from "@/components/admin/inquiries/InquiryRow";
import { InquiriesFilterBar } from "@/components/admin/inquiries/InquiriesFilterBar";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: InquiryRecord["status"]) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
        notify(`Lead status updated to ${status}.`);
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        notify("Inquiry deleted.");
      }
    } finally {
      setBusyId(null);
    }
  };

  const filtered = inquiries.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      i.companyName.toLowerCase().includes(q) ||
      i.contactName.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.includes(q) ||
      i.selection.toLowerCase().includes(q) ||
      (i.expoTitle && i.expoTitle.toLowerCase().includes(q));
    const matchType = typeFilter === "ALL" || i.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || i.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const newCount = inquiries.filter((i) => i.status === "NEW").length;
  const exhibitorCount = inquiries.filter((i) => i.type === "EXHIBITOR").length;
  const sponsorCount = inquiries.filter((i) => i.type === "SPONSOR").length;

  return (
    <div className="p-6 md:p-10 space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Commercial Pipeline
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            B2B Exhibitor & Sponsor Inquiries
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage booth requests and sponsorship applications submitted across your expos.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 self-start cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-xs font-bold text-slate-400 uppercase block">New Unread</span>
          <span className="text-2xl font-black text-[var(--color-primary)]">{newCount}</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">Exhibitors</span>
            <span className="text-2xl font-black text-slate-900">{exhibitorCount}</span>
          </div>
          <Building2 className="w-5 h-5 text-blue-500" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">Sponsors</span>
            <span className="text-2xl font-black text-slate-900">{sponsorCount}</span>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <InquiriesFilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading && inquiries.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">Loading B2B inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <div className="font-bold text-slate-700">No B2B inquiries found</div>
            <p className="text-xs mt-1">Submissions from Book Exhibition Stand and Become a Sponsor appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-bold">Lead</th>
                  <th className="px-5 py-3.5 font-bold">Company & Package</th>
                  <th className="px-5 py-3.5 font-bold">Contact</th>
                  <th className="px-5 py-3.5 font-bold">Received</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <InquiryRow
                    key={item.id}
                    inquiry={item}
                    busy={busyId === item.id}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
