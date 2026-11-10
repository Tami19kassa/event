"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { Loader2, CheckCircle2, Ticket, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { PaymentMethodSelector, PaymentGatewayInfo } from "@/components/events/checkout/PaymentMethodSelector";
import { TicketPassCard } from "@/components/events/checkout/TicketPassCard";
import { CalendarSyncButtons } from "@/components/events/checkout/CalendarSyncButtons";

interface Props {
  event: Event;
  onSuccessClose?: () => void;
}

const defaultGateways: PaymentGatewayInfo = {
  cbeAccount: "1000345678901",
  cbeAccountName: "Utopia Event Management PLC",
  telebirrNumber: "0911223344",
  telebirrAccountName: "Utopia Events",
  allowPayAtGate: true,
  currency: "ETB",
};

export function EventCalendarBookingForm({ event }: Props) {
  const firstAvailable = event.ticketTiers?.find((t) => t.remaining > 0) || event.ticketTiers?.[0];
  const [selectedTierId, setSelectedTierId] = useState<string>(firstAvailable?.id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TELEBIRR" | "CBE" | "PAY_AT_GATE">("TELEBIRR");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [gateways, setGateways] = useState<PaymentGatewayInfo>(defaultGateways);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings/payments").then((r) => r.json()).then((d) => d?.cbeAccount && setGateways(d)).catch(() => {});
  }, []);

  const selectedTier = event.ticketTiers?.find((t) => t.id === selectedTierId) || event.ticketTiers?.[0];
  const maxQty = Math.min(10, selectedTier?.remaining || 0);
  const unitPrice = selectedTier?.price || 0;
  const totalPrice = unitPrice * quantity;
  const isSoldOut = !selectedTier || selectedTier.remaining <= 0;

  const handleSelectTier = (tierId: string, remaining: number) => {
    setSelectedTierId(tierId);
    setQuantity((q) => Math.max(1, Math.min(q, Math.max(1, remaining))));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier || isSoldOut) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          items: [{ ticketTierId: selectedTier.id, quantity }],
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          paymentMethod: totalPrice === 0 ? "FREE" : paymentMethod,
          receiptUrl: totalPrice === 0 || paymentMethod === "PAY_AT_GATE" ? "" : receiptUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reserve tickets");
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    const calendarData = {
      title: `${event.title} - Pass #${order.orderNumber}`,
      description: `${event.shortDescription || event.title}\nRef: ${order.orderNumber}`,
      location: `${event.location.name}, ${event.location.city}, Ethiopia`,
      startDate: event.startDate,
      endDate: event.endDate,
      orderNumber: order.orderNumber,
      status: order.status,
    };

    return (
      <div className="p-5 sm:p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-display text-slate-900">Spot Reserved Successfully!</h4>
        <TicketPassCard event={event} order={order} />
        <CalendarSyncButtons eventData={calendarData} orderNumber={order.orderNumber} />
        <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-1.5 px-5 py-2.5 font-bold text-xs theme-btn-primary">
          <span>View Event Details</span><ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
      {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      {event.ticketTiers && event.ticketTiers.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Select Pass Tier</label>
            {!isSoldOut && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Qty:</span>
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 cursor-pointer"><Minus className="w-3 h-3" /></button>
                <span className="text-xs font-extrabold text-slate-900 w-4 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 cursor-pointer"><Plus className="w-3 h-3" /></button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {event.ticketTiers.map((tier) => (
              <button key={tier.id} type="button" disabled={tier.remaining <= 0} onClick={() => handleSelectTier(tier.id, tier.remaining)}
                style={{ borderColor: selectedTierId === tier.id ? "var(--color-primary, #4F46E5)" : undefined, backgroundColor: selectedTierId === tier.id ? "rgba(var(--color-primary-rgb, 79, 70, 229), 0.06)" : undefined }}
                className={`p-2.5 theme-radius-sm border text-left transition flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedTierId === tier.id ? "ring-1 ring-[var(--color-primary)]" : "border-slate-200 bg-white"}`}>
                <div>
                  <div className="text-xs font-bold text-slate-900">{tier.name}</div>
                  <div className="text-[10px] text-slate-500">{tier.remaining <= 0 ? "Sold out" : `${tier.remaining} left`}</div>
                </div>
                <span style={{ color: "var(--color-primary, #4F46E5)" }} className="text-xs font-extrabold">{tier.price === 0 ? "Free" : `ETB ${tier.price.toLocaleString()}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Full Name *</label>
          <input required type="text" placeholder="Abebe Bekele" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Phone Number *</label>
          <input required type="tel" placeholder="09... / +251..." value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Email for Pass *</label>
        <input required type="email" placeholder="attendee@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 theme-radius-sm text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
      </div>

      {totalPrice > 0 && !isSoldOut && (
        <PaymentMethodSelector method={paymentMethod} onMethodChange={setPaymentMethod} receiptUrl={receiptUrl} onReceiptUrlChange={setReceiptUrl} total={totalPrice} gatewaySettings={gateways} />
      )}

      <button type="submit" disabled={loading || isSoldOut} className="w-full py-3 font-bold text-sm theme-btn-primary shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing Reservation...</span></> : <><Ticket className="w-4 h-4" /><span>{isSoldOut ? "Sold Out" : totalPrice === 0 ? "Confirm Free Entry Pass" : `Confirm & Take Place (ETB ${totalPrice.toLocaleString()})`}</span></>}
      </button>
    </form>
  );
}
