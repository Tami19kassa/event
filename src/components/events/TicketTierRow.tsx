"use client";

import { Minus, Plus } from "lucide-react";
import type { TicketTier } from "@/types/event";

interface TicketTierRowProps {
  tier: TicketTier;
  quantity: number;
  currency: string;
  onUpdateQty: (delta: number) => void;
}

export function TicketTierRow({
  tier,
  quantity,
  currency,
  onUpdateQty,
}: TicketTierRowProps) {
  const soldOut = tier.remaining === 0;

  return (
    <div className="p-5 transition hover:bg-slate-50/50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{tier.name}</span>
            {tier.earlyBird && (
              <span className="px-2 py-0.5 text-[11px] font-semibold theme-badge-accent border rounded-full">
                Early bird
              </span>
            )}
          </div>
          {tier.description && (
            <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
          )}
          {soldOut && <p className="text-xs font-semibold text-rose-600 mt-1">Sold out</p>}
        </div>
        <div className="font-extrabold text-slate-900 text-base shrink-0">
          {tier.price === 0 ? (
            <span className="text-emerald-600">Free</span>
          ) : (
            `${currency} ${tier.price.toLocaleString()}`
          )}
        </div>
      </div>

      {!soldOut && (
        <div className="flex items-center justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={() => onUpdateQty(-1)}
            disabled={quantity === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-bold text-sm text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQty(1)}
            disabled={quantity >= tier.remaining}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
