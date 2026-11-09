"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Event } from "@/types/event";
import { PaymentMethodSelector, PaymentGatewayInfo } from "./PaymentMethodSelector";
import { TicketPassCard } from "./TicketPassCard";
import { CalendarSyncButtons } from "./CalendarSyncButtons";

interface CheckoutModalProps {
  event: Event;
  quantities: Record<string, number>;
  total: number;
  discount: number;
  gatewaySettings: PaymentGatewayInfo;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({
  event,
  quantities,
  total,
  discount,
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

  const calendarData = completedOrder
    ? {
        title: `${event.title} - Pass #${completedOrder.orderNumber}`,
        description: `${event.shortDescription || event.title}\nRef: ${completedOrder.orderNumber}`,
        location: `${event.location.name}, ${event.location.city}, Ethiopia`,
        startDate: event.startDate,
        endDate: event.endDate,
        orderNumber: completedOrder.orderNumber,
        status: completedOrder.status,
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                Direct Booking & Pass
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">Reserve Your Tickets</h3>
              <p className="text-xs text-slate-500 mt-1">{event.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {checkoutError && (
                <div className="p-3.5 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {checkoutError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name (e.g. Abebe Bikila)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number (09...)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                className="w-full py-3.5 mt-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Confirm & Book (ETB ${total.toLocaleString()})`}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {completedOrder.status === "RESERVED_PAY_AT_GATE" ? "Gate Reservation Confirmed!" : "Ticket Confirmed!"}
            </h3>
            <p className="text-xs text-slate-500 mb-5">Digital entry pass generated successfully.</p>
            <TicketPassCard event={event} order={completedOrder} />
            {calendarData && <CalendarSyncButtons eventData={calendarData} orderNumber={completedOrder.orderNumber} />}
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
