"use client";

import { useState, useEffect } from "react";
import { Ticket, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { makeClientKey, type TicketTierInput } from "@/lib/event-form-types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tier?: TicketTierInput | null;
  currency: string;
  onSave: (tier: TicketTierInput) => void;
}

export function AdminTicketTierModal({ isOpen, onClose, tier, currency, onSave }: Props) {
  const isEditing = Boolean(tier);
  const sold = tier?.soldCount ?? 0;
  const minQty = Math.max(1, sold);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(100);
  const [earlyBird, setEarlyBird] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (tier) {
        setName(tier.name || "");
        setPrice(Number(tier.price) || 0);
        setQuantity(Number(tier.quantity) || 100);
        setEarlyBird(Boolean(tier.earlyBird));
        setDescription(tier.description || "");
      } else {
        setName("VIP Pass");
        setPrice(500);
        setQuantity(50);
        setEarlyBird(false);
        setDescription("");
      }
      setError("");
    }
  }, [isOpen, tier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for this ticket tier.");
      return;
    }
    if (quantity < minQty) {
      setError(`Quantity cannot be lower than ${minQty} (${sold} already sold).`);
      return;
    }

    onSave({
      ...(tier || {}),
      clientKey: tier?.clientKey || makeClientKey("tier"),
      name: name.trim(),
      price: Math.max(0, Number(price) || 0),
      quantity: Math.max(minQty, Math.floor(Number(quantity) || minQty)),
      earlyBird,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Ticket Tier" : "Add Ticket Tier"}
      subtitle={`${currency} pricing · Inventory capacity & attendee perks`}
      icon={<Ticket className="w-4 h-4" />}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 theme-radius-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-bold theme-btn-primary theme-radius-sm shadow-xs transition cursor-pointer"
          >
            {isEditing ? "Save Changes" : "Add Tier"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tier Name *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            placeholder="e.g. VIP Pass, Early Bird, General Admission"
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Price ({currency}) *
            </label>
            <input
              type="number"
              min={0}
              step="1"
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">0 = Free pass</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quantity / Seats *
            </label>
            <input
              type="number"
              min={minQty}
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(minQty, Math.floor(Number(e.target.value) || minQty)))}
              className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
            />
            {sold > 0 && (
              <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">
                {sold} already sold (min: {minQty})
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Early Bird Badge</label>
            <button
              type="button"
              onClick={() => setEarlyBird(!earlyBird)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                earlyBird
                  ? "theme-badge-accent"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {earlyBird ? "Highlighted Early Bird" : "Standard Tier"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Highlights this tier with an eye-catching accent badge on checkout.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Perks &amp; Notes
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Front-row lounge, priority badge pickup, welcome pack"
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
          />
        </div>
      </form>
    </Modal>
  );
}
