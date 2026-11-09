"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { Minus, Plus, Tag, Sparkles, ArrowRight } from "lucide-react";
import { CheckoutModal } from "./checkout/CheckoutModal";
import { PaymentGatewayInfo } from "./checkout/PaymentMethodSelector";

interface TicketSelectorProps {
  event: Event;
}

const defaultGateways: PaymentGatewayInfo = {
  cbeAccount: "1000345678901",
  cbeAccountName: "Utopia Event Management PLC",
  telebirrNumber: "0911223344",
  telebirrAccountName: "Utopia Events",
  allowPayAtGate: true,
  currency: "ETB",
};

export function TicketSelector({ event }: TicketSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(event.ticketTiers.map((t) => [t.id, 0]))
  );
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gateways, setGateways] = useState<PaymentGatewayInfo>(defaultGateways);

  useEffect(() => {
    fetch("/api/settings/payments")
      .then((r) => r.json())
      .then((data) => {
        if (data?.cbeAccount) setGateways(data);
      })
      .catch(() => {});
  }, []);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const tier = event.ticketTiers.find((t) => t.id === id);
      if (!tier) return prev;
      const next = Math.max(0, Math.min(tier.remaining, (prev[id] || 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = event.ticketTiers.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-24">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Tickets & Pricing</h3>
            <span className="text-xs text-slate-400">All prices in Ethiopian Birr (ETB)</span>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Addis Ababa
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
          {event.ticketTiers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No ticket tiers available.</div>
          ) : (
            event.ticketTiers.map((tier) => {
              const qty = quantities[tier.id] || 0;
              const soldOut = tier.remaining === 0;

              return (
                <div key={tier.id} className="p-5 transition hover:bg-slate-50/50">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{tier.name}</span>
                        {tier.earlyBird && (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full">
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
                        `ETB ${tier.price.toLocaleString()}`
                      )}
                    </div>
                  </div>

                  {!soldOut && (
                    <div className="flex items-center justify-end gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => updateQty(tier.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(tier.id, 1)}
                        disabled={qty >= tier.remaining}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Promo code */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Discount code (try SAVE10)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="button"
              onClick={() => setPromoApplied(promoCode.trim().toLowerCase() === "save10")}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 10% promotional discount applied!
            </p>
          )}
        </div>

        {/* Checkout CTA */}
        <div className="p-5 bg-white border-t border-slate-100">
          {totalItems > 0 && (
            <div className="flex justify-between font-bold text-slate-900 text-base mb-4">
              <span>Total Amount</span>
              <span className="text-indigo-600 font-black">ETB {total.toLocaleString()}</span>
            </div>
          )}

          <button
            type="button"
            disabled={totalItems === 0}
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {totalItems === 0 ? "Select Tickets" : `Proceed to Booking · ETB ${total.toLocaleString()}`}
            {totalItems > 0 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <CheckoutModal
          event={event}
          quantities={quantities}
          total={total}
          discount={discount}
          gatewaySettings={gateways}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setQuantities(Object.fromEntries(event.ticketTiers.map((t) => [t.id, 0])))}
        />
      )}
    </>
  );
}
