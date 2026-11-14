"use client";

import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import { makeClientKey, type TicketTierInput } from "@/lib/event-form-types";
import { TicketTierRow } from "./TicketTierRow";
import { AdminTicketTierModal } from "./AdminTicketTierModal";

interface Props {
  tiers: TicketTierInput[];
  currency: string;
  mode?: "create" | "edit";
  updateTier?: (index: number, field: string, value: any) => void;
  addTier?: () => void;
  removeTier: (index: number) => void;
  moveTier: (index: number, delta: -1 | 1) => void;
  replaceTiers?: (next: TicketTierInput[]) => void;
}

export function TicketTiersSection({
  tiers,
  currency,
  removeTier,
  moveTier,
  replaceTiers,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const totalSeats = tiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
  const hasSoldAny = tiers.some((t) => (t.soldCount || 0) > 0);

  const handleOpenCreate = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSaveTier = (savedTier: TicketTierInput) => {
    if (!replaceTiers) return;
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < tiers.length) {
      const next = [...tiers];
      next[editingIndex] = savedTier;
      replaceTiers(next);
    } else {
      replaceTiers([...tiers, savedTier]);
    }
  };

  const applyTierPack = (pack: "free" | "standard" | "expo") => {
    if (!replaceTiers || hasSoldAny) return;
    if (pack === "free") {
      replaceTiers([{ clientKey: makeClientKey("tier"), name: "Free Admission", price: 0, quantity: 150, earlyBird: false, description: "Full event entry & QR gate pass" }]);
    } else if (pack === "standard") {
      replaceTiers([
        { clientKey: makeClientKey("tier"), name: "Regular Pass", price: 400, quantity: 200, earlyBird: true, description: "General admission access" },
        { clientKey: makeClientKey("tier"), name: "VIP Pass", price: 1500, quantity: 60, earlyBird: false, description: "Priority entry, front seating & refreshments" },
      ]);
    } else {
      replaceTiers([
        { clientKey: makeClientKey("tier"), name: "Visitor Pass", price: 0, quantity: 400, earlyBird: false, description: "Exhibition floor & keynote stages" },
        { clientKey: makeClientKey("tier"), name: "Delegate VIP", price: 1800, quantity: 80, earlyBird: true, description: "B2B lounge, concierge & full sessions" },
        { clientKey: makeClientKey("tier"), name: "Exhibitor Booth", price: 12000, quantity: 25, earlyBird: false, description: "3x3m pavilion booth + 4 team badges" },
      ]);
    }
  };

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
              {currency} pricing · {totalSeats.toLocaleString()} total capacity across {tiers.length} tier{tiers.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          data-add-tier-modal-trigger
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-btn-primary cursor-pointer hover:brightness-105 transition shadow-2xs"
        >
          <Plus className="w-4 h-4" /> Add Ticket Tier
        </button>
      </div>

      {!hasSoldAny && replaceTiers && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Quick Packs:
          </span>
          <button
            type="button"
            onClick={() => applyTierPack("free")}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Free RSVP
          </button>
          <button
            type="button"
            onClick={() => applyTierPack("standard")}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Regular + VIP
          </button>
          <button
            type="button"
            onClick={() => applyTierPack("expo")}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Expo (Visitor / VIP / Booth)
          </button>
        </div>
      )}

      {tiers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 theme-radius text-xs text-slate-500 space-y-3">
          <p>No ticket tiers created yet. Every event needs at least one ticket tier.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 theme-radius-sm theme-btn-primary text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create First Tier
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tiers.map((tier, i) => (
            <TicketTierRow
              key={tier.id || tier.clientKey || i}
              tier={tier}
              index={i}
              totalCount={tiers.length}
              currency={currency}
              onEdit={handleOpenEdit}
              onMove={moveTier}
              onRemove={removeTier}
            />
          ))}
        </div>
      )}

      <AdminTicketTierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={editingIndex !== null ? tiers[editingIndex] : null}
        currency={currency}
        onSave={handleSaveTier}
      />
    </section>
  );
}
