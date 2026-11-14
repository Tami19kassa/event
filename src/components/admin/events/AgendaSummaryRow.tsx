"use client";

import { Edit2, Trash2, ArrowUp, ArrowDown, Clock } from "lucide-react";
import type { AgendaItemInput } from "@/lib/event-form-types";

interface Props {
  slot: AgendaItemInput;
  index: number;
  totalCount: number;
  onEdit: (index: number) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (index: number) => void;
}

export function AgendaSummaryRow({
  slot,
  index,
  totalCount,
  onEdit,
  onMove,
  onRemove,
}: Props) {
  return (
    <div
      data-agenda-admin-row
      className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 theme-radius flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold shrink-0">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{slot.time || "TBD"}</span>
        </div>

        <div className="min-w-0 space-y-0.5">
          <h4 className="font-bold text-sm text-slate-900 truncate">
            {slot.title || "Untitled Session"}
          </h4>

          {slot.description && (
            <p className="text-xs text-slate-500 truncate max-w-md">
              {slot.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, -1)}
          className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          title="Move earlier"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={index === totalCount - 1}
          onClick={() => onMove(index, 1)}
          className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          title="Move later"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(index)}
          data-edit-agenda-btn
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <Edit2 className="w-3 h-3 text-slate-500" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          title="Delete session"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
