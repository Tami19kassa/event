"use client";

import { Trash2, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import type { TicketTierInput } from "@/lib/event-form-types";

interface Props {
  tier: TicketTierInput;
  index: number;
  totalCount: number;
  currency: string;
  mode: "create" | "edit";
  onUpdate: (index: number, field: string, value: any) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (index: number) => void;
}

export function TicketTierCard({
  tier,
  index,
  totalCount,
  currency,
  mode,
  onUpdate,
  onMove,
  onRemove,
}: Props) {
  const sold = tier.soldCount ?? 0;
  const liveRemaining =
    mode === "edit" && typeof tier.remaining === "number"
      ? Math.max(0, tier.quantity - sold)
      : null;
  const minQty = Math.max(1, sold);
  const missingName = !tier.name.trim();
  const belowSold = sold > 0 && tier.quantity < minQty;

  return (
    <div
      className={`p-4 bg-slate-50/90 theme-radius border space-y-3 ${
        missingName || belowSold ? "border-rose-300" : "border-slate-200/80"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Tier #{index + 1}
          </span>
          {liveRemaining !== null && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
              {sold} sold · {liveRemaining} left
            </span>
          )}
          {tier.price === 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
              Free Tier
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
            title="Move up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={() => onMove(index, 1)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
            title="Move down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onUpdate(index, "earlyBird", !tier.earlyBird)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              tier.earlyBird
                ? "theme-badge-accent"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Early Bird {tier.earlyBird ? "On" : "Off"}
          </button>

          {totalCount > 1 && sold === 0 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Remove tier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-bold text-slate-600 mb-1">Tier Name *</label>
          <input
            type="text"
            required
            value={tier.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
            placeholder="VIP / Regular"
          />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Price ({currency})
          </label>
          <input
            type="number"
            min={0}
            step="1"
            value={tier.price}
            onChange={(e) => onUpdate(index, "price", Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
          />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1">Quantity</label>
          <input
            type="number"
            min={minQty}
            value={tier.quantity}
            onChange={(e) =>
              onUpdate(index, "quantity", Math.max(0, Math.floor(Number(e.target.value) || 0)))
            }
            onBlur={() => {
              if (tier.quantity < minQty) onUpdate(index, "quantity", minQty);
            }}
            className={`w-full px-3 py-2 bg-white border theme-radius-sm text-sm ${
              belowSold ? "border-rose-400" : "border-slate-200"
            }`}
          />
          {belowSold && (
            <p className="text-[10px] font-semibold text-rose-600 mt-1">
              Min {minQty} ({sold} sold)
            </p>
          )}
        </div>
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-xs font-bold text-slate-600 mb-1">Perks / Note</label>
          <input
            type="text"
            value={tier.description || ""}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
            placeholder="Front-row lounge access, lunch pass..."
          />
        </div>
      </div>
    </div>
  );
}
