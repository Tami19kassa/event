import { Building2, Award, Mail, Phone, Trash2 } from "lucide-react";

export type InquiryRecord = {
  id: string;
  type: "EXHIBITOR" | "SPONSOR";
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  expoTitle: string | null;
  selection: string;
  notes: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "ARCHIVED";
  createdAt: string;
};

interface Props {
  inquiry: InquiryRecord;
  busy: boolean;
  onStatusChange: (id: string, status: InquiryRecord["status"]) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<InquiryRecord["status"], string> = {
  NEW: "theme-badge",
  CONTACTED: "bg-amber-100 text-amber-800 border-amber-200",
  QUALIFIED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 border-slate-200",
};

export function InquiryRow({ inquiry, busy, onStatusChange, onDelete }: Props) {
  const isExhibitor = inquiry.type === "EXHIBITOR";

  return (
    <tr className="hover:bg-slate-50/70 transition align-top">
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            isExhibitor ? "theme-badge" : "theme-badge-accent"
          }`}
        >
          {isExhibitor ? <Building2 className="w-3 h-3" /> : <Award className="w-3 h-3" />}
          {inquiry.type}
        </span>
        <div className="text-[11px] font-mono text-slate-400 mt-1.5">
          #{inquiry.id.slice(-8).toUpperCase()}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="font-bold text-slate-900">{inquiry.companyName}</div>
        <div className="text-xs text-slate-600 mt-0.5">{inquiry.selection}</div>
        {inquiry.expoTitle && (
          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            Expo: {inquiry.expoTitle}
          </div>
        )}
        {inquiry.notes && (
          <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xs">
            {inquiry.notes}
          </p>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="font-semibold text-slate-900 text-sm">{inquiry.contactName}</div>
        <a
          href={`mailto:${inquiry.email}`}
          className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline mt-0.5"
        >
          <Mail className="w-3 h-3" />
          <span>{inquiry.email}</span>
        </a>
        <a
          href={`tel:${inquiry.phone}`}
          className="flex items-center gap-1 text-xs font-mono text-slate-600 hover:text-slate-900 mt-0.5"
        >
          <Phone className="w-3 h-3 text-slate-400" />
          <span>{inquiry.phone}</span>
        </a>
      </td>

      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>

      <td className="px-5 py-4">
        <select
          value={inquiry.status}
          disabled={busy}
          onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryRecord["status"])}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer disabled:opacity-50 ${statusStyles[inquiry.status]}`}
        >
          <option value="NEW">New Lead</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(inquiry.id)}
          title="Delete inquiry"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer disabled:opacity-40"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
