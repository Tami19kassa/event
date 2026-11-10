"use client";

import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { SponsorItem } from "@/lib/expo-settings";

interface Props {
  sponsor: SponsorItem;
  isEditing: boolean;
  onEdit: (sponsor: SponsorItem) => void;
  onDelete: (id: string) => void;
}

export function SponsorListItem({ sponsor: s, isEditing, onEdit, onDelete }: Props) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition ${
        isEditing ? "border-indigo-500 bg-indigo-50/30 shadow-xs" : "border-slate-100 hover:border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            s.tier === "STRATEGIC" ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-slate-100 text-slate-700"
          }`}
        >
          {s.tier}
        </span>
        {s.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.logoUrl}
            alt={s.name}
            className="h-6 max-w-[90px] object-contain border border-slate-100 rounded px-1 shrink-0"
          />
        )}
        <div className="min-w-0">
          <span className="font-bold text-sm text-slate-900 block truncate">{s.name}</span>
          {s.websiteUrl && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
              <ExternalLink className="w-2.5 h-2.5" /> {s.websiteUrl}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(s)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Edit Sponsor"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(s.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          title="Delete Sponsor"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
