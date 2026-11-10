"use client";

import { Plus, Trash2, Ticket, Sparkles } from "lucide-react";
import type { TicketTierInput } from "@/lib/event-form-types";

interface Props {
  tiers: TicketTierInput[];
  currency: string;
  mode: "create" | "edit";
  updateTier: (index: number, field: string, value: any) => void;
  addTier: () => void;
  removeTier: (index: number) => void;
}

export function TicketTiersSection({
  tiers,
  currency,
  mode,
  updateTier,
  addTier,
  removeTier,
}: Props) {
  const totalSeats = tiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 theme-radius-sm theme-icon-accent border flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Ticket Tiers &amp; Pricing</h2>
            <p className="text-xs text-slate-400">
              Configured in {currency} · {totalSeats.toLocaleString()} total tier passes across {tiers.length} tier{tiers.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addTier}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-badge-secondary border cursor-pointer hover:brightness-95 transition"
        >
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, i) => {
          const sold =
            mode === "edit" && typeof tier.remaining === "number"
              ? Math.max(0, tier.quantity - tier.remaining)
              : null;

          return (
            <div
              key={tier.id || i}
              className="p-4 bg-slate-50/90 theme-radius border border-slate-200/80 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Tier #{i + 1}
                  </span>
                  {sold !== null && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                      {sold} sold · {tier.remaining} left
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateTier(i, "earlyBird", !tier.earlyBird)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                      tier.earlyBird
                        ? "theme-badge-accent"
                        : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Early Bird {tier.earlyBird ? "On" : "Off"}
                  </button>

                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
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
                    onChange={(e) => updateTier(i, "name", e.target.value)}
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
                    onChange={(e) => updateTier(i, "price", Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={tier.quantity}
                    onChange={(e) =>
                      updateTier(i, "quantity", Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                  />
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Perks / Note</label>
                  <input
                    type="text"
                    value={tier.description || ""}
                    onChange={(e) => updateTier(i, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    placeholder="Front-row lounge access, lunch pass..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
