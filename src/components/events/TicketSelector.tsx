"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { Tag, Sparkles, ArrowRight } from "lucide-react";
import { CheckoutModal } from "./checkout/CheckoutModal";
import { PaymentGatewayInfo } from "./checkout/PaymentMethodSelector";
import { TicketTierRow } from "./TicketTierRow";

interface TicketSelectorProps {
  event: Event;
  initialGateways?: PaymentGatewayInfo;
}

const defaultGateways: PaymentGatewayInfo = {
  cbeAccount: "1000345678901",
  cbeAccountName: "Utopia Event Management PLC",
  telebirrNumber: "0911223344",
  telebirrAccountName: "Utopia Events",
  allowPayAtGate: true,
  currency: "ETB",
  promoCode: "SAVE10",
  promoDiscountPercent: 10,
};

export function TicketSelector({ event, initialGateways }: TicketSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(event.ticketTiers.map((t) => [t.id, 0]))
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gateways, setGateways] = useState<PaymentGatewayInfo>(
    initialGateways || defaultGateways
  );

  useEffect(() => {
    if (!initialGateways) {
      fetch("/api/settings/payments")
        .then((r) => r.json())
        .then((data) => {
          if (data?.cbeAccount) setGateways(data);
        })
        .catch(() => {});
    }
  }, [initialGateways]);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const tier = event.ticketTiers.find((t) => t.id === id);
      if (!tier) return prev;
      const next = Math.max(0, Math.min(tier.remaining, (prev[id] || 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const promoEnabled = Boolean(
    gateways.promoDiscountPercent &&
    gateways.promoDiscountPercent > 0 &&
    gateways.promoCode
  );
  const activePromoCode = (gateways.promoCode || "SAVE10").toUpperCase();
  const activeDiscountRate = (gateways.promoDiscountPercent || 10) / 100;
  const promoApplied = promoEnabled && appliedPromoCode === activePromoCode;
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const subtotal = event.ticketTiers.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0);
  const discount = promoApplied ? Math.round(subtotal * activeDiscountRate * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (promoEnabled && clean === activePromoCode) {
      setAppliedPromoCode(clean);
      setPromoError("");
    } else {
      setAppliedPromoCode("");
      setPromoError(clean ? "Invalid discount code." : "");
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 theme-radius-card shadow-sm overflow-hidden sticky top-24">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-slate-900 text-lg">Tickets &amp; Pricing</h3>
            <span className="text-xs text-slate-400">All prices in {gateways.currency || "ETB"}</span>
          </div>
          <span className="text-xs font-bold theme-badge border px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
            {event.format === "online" ? "Online Event" : event.location.city || "Ethiopia"}
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
          {event.ticketTiers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No ticket tiers available.</div>
          ) : (
            event.ticketTiers.map((tier) => (
              <TicketTierRow
                key={tier.id}
                tier={tier}
                quantity={quantities[tier.id] || 0}
                currency={gateways.currency || "ETB"}
                onUpdateQty={(delta) => updateQty(tier.id, delta)}
              />
            ))
          )}
        </div>

        {/* Promo code (rendered when active promo campaign exists) */}
        {promoEnabled && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={`Discount code (e.g. ${activePromoCode})`}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 theme-radius-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 theme-radius-sm hover:bg-slate-100 transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-xs text-rose-600 font-medium mt-2">{promoError}</p>}
            {promoApplied && (
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {gateways.promoDiscountPercent}% promotional discount applied!
              </p>
            )}
          </div>
        )}

        {/* Checkout CTA */}
        <div className="p-5 bg-white border-t border-slate-100">
          {totalItems > 0 && (
            <div className="flex justify-between font-bold text-slate-900 text-base mb-4">
              <span>Total Amount</span>
              <span className="text-[var(--color-primary)] font-display">{gateways.currency || "ETB"} {total.toLocaleString()}</span>
            </div>
          )}

          <button
            type="button"
            disabled={totalItems === 0}
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3.5 font-bold theme-btn-primary disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {totalItems === 0 ? "Select Tickets" : `Proceed to Booking · ${gateways.currency || "ETB"} ${total.toLocaleString()}`}
            {totalItems > 0 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <CheckoutModal event={event} quantities={quantities} total={total} discount={discount} promoCode={appliedPromoCode} gatewaySettings={gateways} onClose={() => setIsModalOpen(false)} onSuccess={() => setQuantities(Object.fromEntries(event.ticketTiers.map((t) => [t.id, 0])))} />
      )}
    </>
  );
}
