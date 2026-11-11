"use client";

import { useEffect, useState } from "react";
import { X, Building2, Award, Mail, Phone, Copy, Check, Save, Trash2 } from "lucide-react";
import { formatAdminInquiryTime, type InquiryRecord, type InquiryStatus } from "@/lib/inquiries-admin-helpers";

interface DrawerProps {
  inquiry: InquiryRecord | null;
  busy: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onSaveNotes: (id: string, notes: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
}

const STAGES: { key: InquiryStatus; label: string }[] = [
  { key: "NEW", label: "New Lead" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "QUALIFIED", label: "Qualified" },
  { key: "ARCHIVED", label: "Archived" },
];

export function InquiryDetailDrawer({ inquiry, busy, onClose, onStatusChange, onSaveNotes, onDelete }: DrawerProps) {
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setNotesDraft(inquiry?.notes || "");
    setConfirmDelete(false);
    setCopiedField(null);
  }, [inquiry?.id, inquiry?.notes]);

  useEffect(() => {
    if (!inquiry) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inquiry, onClose]);

  if (!inquiry) return null;

  const isExhibitor = inquiry.type === "EXHIBITOR";
  const dirtyNotes = notesDraft.trim() !== (inquiry.notes || "").trim();

  const handleCopy = async (kind: "email" | "phone", val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedField(kind);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {}
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotes(true);
    await onSaveNotes(inquiry.id, notesDraft);
    setSavingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${isExhibitor ? "theme-badge" : "theme-badge-accent"}`}>
                {isExhibitor ? <Building2 className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                {inquiry.type}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">#{inquiry.id.slice(-8).toUpperCase()}</span>
              <span className="text-xs text-slate-400">{formatAdminInquiryTime(inquiry.createdAt)}</span>
            </div>
            <h2 className="font-display text-lg text-slate-900 truncate">{inquiry.companyName}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close drawer" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 theme-radius-sm cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Pipeline Stage</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STAGES.map((stage) => {
                const active = inquiry.status === stage.key;
                return (
                  <button
                    key={stage.key} type="button" disabled={busy} onClick={() => onStatusChange(inquiry.id, stage.key)}
                    className={`px-2.5 py-2 text-xs font-bold theme-radius-sm border transition cursor-pointer disabled:opacity-50 ${
                      active ? "theme-nav-active border-transparent" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 theme-radius border border-slate-200/80 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Requested Package / Stand</div>
            <div className="text-sm font-bold text-slate-900">{inquiry.selection}</div>
            {inquiry.expoTitle && (
              <div className="text-xs text-slate-600">Event / Expo: <span className="font-semibold text-slate-800">{inquiry.expoTitle}</span></div>
            )}
          </div>

          <div className="p-4 bg-slate-50 theme-radius border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Contact</span>
              <span className="text-xs font-bold text-slate-800">{inquiry.contactName}</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 border border-slate-200 theme-radius-sm">
              <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{inquiry.email}</span>
              </a>
              <button type="button" onClick={() => handleCopy("email", inquiry.email)} className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 theme-radius-sm inline-flex items-center gap-1 cursor-pointer shrink-0">
                {copiedField === "email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === "email" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 border border-slate-200 theme-radius-sm">
              <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-slate-900">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inquiry.phone}</span>
              </a>
              <button type="button" onClick={() => handleCopy("phone", inquiry.phone)} className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 theme-radius-sm inline-flex items-center gap-1 cursor-pointer shrink-0">
                {copiedField === "phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedField === "phone" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <form onSubmit={handleNotesSubmit} className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Follow-Up &amp; Sales Notes</label>
            <textarea
              rows={4} maxLength={1500} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Record call outcomes, booth placement, sent proposal, or next follow-up date..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">{dirtyNotes ? "Unsaved note changes" : "Saved to lead record"}</span>
              <button type="submit" disabled={savingNotes || busy || !dirtyNotes} className="px-3.5 py-2 theme-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-45">
                <Save className="w-3.5 h-3.5" />
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100">
            {!confirmDelete ? (
              <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} className="w-full py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" /> Delete Lead Record
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 theme-radius space-y-2">
                <p className="text-xs font-semibold text-rose-800">Permanently remove this B2B inquiry?</p>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => onDelete(inquiry.id)} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold theme-radius-sm cursor-pointer disabled:opacity-50">
                    Yes, Delete Lead
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 theme-radius-sm cursor-pointer">
                    Keep
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
