"use client";

import { useState } from "react";
import { Building2, Award, Mail, Phone, Eye, Trash2 } from "lucide-react";
import {
  formatAdminInquiryTime,
  type InquiryRecord,
  type InquiryStatus,
} from "@/lib/inquiries-admin-helpers";

interface RowProps {
  inquiry: InquiryRecord;
  busy: boolean;
  onInspect: (inquiry: InquiryRecord) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "theme-badge",
  CONTACTED: "bg-amber-50 text-amber-800 border-amber-200",
  QUALIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 border-slate-200",
};

export function InquiryRow({
  inquiry,
  busy,
  onInspect,
  onStatusChange,
  onDelete,
}: RowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isExhibitor = inquiry.type === "EXHIBITOR";

  return (
    <tr className="hover:bg-slate-50/70 transition align-top">
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
            isExhibitor ? "theme-badge" : "theme-badge-accent"
          }`}
        >
          {isExhibitor ? <Building2 className="w-3 h-3 shrink-0" /> : <Award className="w-3 h-3 shrink-0" />}
          {inquiry.type}
        </span>
        <div className="text-[11px] font-mono text-slate-400 mt-1 whitespace-nowrap">
          #{inquiry.id.slice(-8).toUpperCase()}
        </div>
      </td>

      <td className="px-5 py-3.5">
        <button
          type="button"
          onClick={() => onInspect(inquiry)}
          className="font-bold text-slate-900 hover:text-[var(--color-primary)] transition text-left cursor-pointer"
        >
          {inquiry.companyName}
        </button>
        <div className="text-xs font-medium text-slate-600 mt-0.5">{inquiry.selection}</div>
        {inquiry.expoTitle && (
          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[220px]">
            Expo: {inquiry.expoTitle}
          </div>
        )}
        {inquiry.notes && (
          <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 px-2 py-1 theme-radius-sm border border-slate-100 line-clamp-1 max-w-[240px]">
            {inquiry.notes}
          </p>
        )}
      </td>

      <td className="px-5 py-3.5">
        <div className="font-semibold text-slate-900 text-sm">{inquiry.contactName}</div>
        <a
          href={`mailto:${inquiry.email}`}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline mt-0.5 max-w-[190px] truncate"
        >
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate">{inquiry.email}</span>
        </a>
        <a
          href={`tel:${inquiry.phone}`}
          className="flex items-center gap-1 text-xs font-mono text-slate-600 hover:text-slate-900 mt-0.5 whitespace-nowrap"
        >
          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{inquiry.phone}</span>
        </a>
      </td>

      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
        {formatAdminInquiryTime(inquiry.createdAt)}
      </td>

      <td className="px-5 py-3.5">
        <select
          aria-label={`Status for ${inquiry.companyName}`}
          value={inquiry.status}
          disabled={busy}
          onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
          className={`px-2.5 py-1 theme-radius-sm text-xs font-bold border cursor-pointer disabled:opacity-50 whitespace-nowrap ${statusStyles[inquiry.status]}`}
        >
          <option value="NEW">New Lead</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </td>

      <td className="px-5 py-3.5 text-right">
        {!confirmDelete ? (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onInspect(inquiry)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap theme-radius-sm transition cursor-pointer inline-flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" /> Inspect
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${inquiry.companyName}`}
              className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 theme-radius-sm transition cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirmDelete(false);
                onDelete(inquiry.id);
              }}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold theme-radius-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold theme-radius-sm whitespace-nowrap cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
