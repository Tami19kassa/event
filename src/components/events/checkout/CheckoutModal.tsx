"use client";

import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Event } from "@/types/event";
import { PaymentMethodSelector, PaymentGatewayInfo } from "./PaymentMethodSelector";
import { CheckoutSuccessView } from "./CheckoutSuccessView";

interface CheckoutModalProps {
  event: Event;
  quantities: Record<string, number>;
  total: number;
  discount: number;
  promoCode?: string;
  gatewaySettings: PaymentGatewayInfo;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({
  event,
  quantities,
  total,
  discount,
  promoCode = "",
  gatewaySettings,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TELEBIRR" | "CBE" | "PAY_AT_GATE">("TELEBIRR");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Lock background body scroll to prevent scroll bleeding & background movement
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    setSubmitting(true);

    try {
      const selectedItems = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([tierId, qty]) => ({ ticketTierId: tierId, quantity: qty }));

      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          items: selectedItems,
          customerEmail,
          customerName,
          customerPhone,
          paymentMethod: total === 0 ? "FREE" : paymentMethod,
          receiptUrl: total === 0 || paymentMethod === "PAY_AT_GATE" ? "" : receiptUrl,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process order");

      setCompletedOrder(data.order);
      onSuccess();
    } catch (err: any) {
      setCheckoutError(err.message || "Order checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overscroll-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white theme-radius-modal max-w-xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-4 border-b border-slate-100 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">
              Direct Booking &amp; Pass
            </span>
            <h3 className="text-xl sm:text-2xl font-display text-slate-900 leading-tight">
              {completedOrder ? "Reservation Confirmed" : "Reserve Your Tickets"}
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-md">{event.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition shrink-0 ml-3 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body with overscroll containment */}
        <div className="overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-4 flex-1 pb-8 sm:pb-7">
          {!completedOrder ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {checkoutError && (
                <div className="p-3.5 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-xl leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Could not complete reservation</span>
                    <span>{checkoutError}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name (e.g. Kebede Abebe)"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number (09...)"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email Address (for ticket pass & barcode)"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />

              {total > 0 && (
                <PaymentMethodSelector
                  method={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  receiptUrl={receiptUrl}
                  onReceiptUrlChange={setReceiptUrl}
                  total={total}
                  gatewaySettings={gatewaySettings}
                />
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-3 font-bold theme-btn-primary shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Confirm & Book (ETB ${total.toLocaleString()})`
                )}
              </button>
            </form>
          ) : (
            <CheckoutSuccessView
              event={event}
              order={completedOrder}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
