"use client";

import { Plus, Trash2 } from "lucide-react";
import { TicketTierInput } from "../EventForm";

interface Props {
  tiers: TicketTierInput[];
  updateTier: (index: number, field: string, value: any) => void;
  addTier: () => void;
  removeTier: (index: number) => void;
}

export function TicketTiersSection({
  tiers,
  updateTier,
  addTier,
  removeTier,
}: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Ticket Tiers & Pricing</h2>
          <p className="text-xs text-slate-400">All prices denominated in Ethiopian Birr (ETB)</p>
        </div>
        <button
          type="button"
          onClick={addTier}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add tier
        </button>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50 rounded-2xl border border-slate-200/80"
          >
            <div className="col-span-12 sm:col-span-4">
              <label className="block text-xs font-bold text-slate-600 mb-1">Tier Name *</label>
              <input
                type="text"
                required
                value={tier.name}
                onChange={(e) => updateTier(i, "name", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                placeholder="VIP / Regular"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Price (ETB)</label>
              <input
                type="number"
                min={0}
                step="1"
                value={tier.price}
                onChange={(e) => updateTier(i, "price", Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Capacity</label>
              <input
                type="number"
                min={1}
                value={tier.quantity}
                onChange={(e) => updateTier(i, "quantity", Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="col-span-10 sm:col-span-3">
              <label className="block text-xs font-bold text-slate-600 mb-1">Perks / Note</label>
              <input
                type="text"
                value={tier.description || ""}
                onChange={(e) => updateTier(i, "description", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                placeholder="Includes dinner pass"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 flex justify-end">
              {tiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTier(i)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Remove tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
