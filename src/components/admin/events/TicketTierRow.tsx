"use client";

import { Edit2, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import type { TicketTierInput } from "@/lib/event-form-types";

interface Props {
  tier: TicketTierInput;
  index: number;
  totalCount: number;
  currency: string;
  onEdit: (index: number) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (index: number) => void;
}

export function TicketTierRow({
  tier,
  index,
  totalCount,
  currency,
  onEdit,
  onMove,
  onRemove,
}: Props) {
  const sold = tier.soldCount ?? 0;
  const isFree = tier.price === 0;

  return (
    <div
      data-tier-row
      className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 theme-radius flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-500 flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 truncate">
              {tier.name || "Untitled Tier"}
            </h4>

            {isFree ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                Free Pass
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-white border border-slate-200 text-slate-800">
                {tier.price.toLocaleString()} {currency}
              </span>
            )}

            {tier.earlyBird && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold theme-badge-accent border">
                <Sparkles className="w-2.5 h-2.5" /> Early Bird
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>
              <strong>{tier.quantity.toLocaleString()}</strong> seats capacity
            </span>
            {sold > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-700 font-semibold">{sold} sold</span>
              </>
            )}
            {tier.description && (
              <>
                <span>·</span>
                <span className="truncate max-w-[240px] text-slate-400">
                  {tier.description}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, -1)}
          className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          title="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={index === totalCount - 1}
          onClick={() => onMove(index, 1)}
          className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          title="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(index)}
          data-edit-tier-btn
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <Edit2 className="w-3 h-3 text-slate-500" />
          Edit
        </button>
        {totalCount > 1 && sold === 0 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete tier"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
