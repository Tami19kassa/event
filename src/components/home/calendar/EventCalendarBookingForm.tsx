"use client";

import { useState } from "react";
import { Event } from "@/types/event";
import { Loader2, CheckCircle2, Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  event: Event;
  onSuccessClose?: () => void;
}

export function EventCalendarBookingForm({ event }: Props) {
  const initialTierId = event.ticketTiers?.[0]?.id || "";
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId);
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TELEBIRR" | "CBE" | "PAY_AT_GATE">("TELEBIRR");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const selectedTier = event.ticketTiers?.find((t) => t.id === selectedTierId) || event.ticketTiers?.[0];
  const unitPrice = selectedTier?.price || 0;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          items: [{ ticketTierId: selectedTier?.id, quantity }],
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
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-black text-slate-900">Spot Reserved Successfully!</h4>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Pass reference: <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>. Confirmation sent to {email}.
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1 max-w-sm mx-auto">
          <div className="flex justify-between text-slate-500">
            <span>Pass Type</span>
            <span className="font-bold text-slate-800">{selectedTier?.name} ({quantity}x)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total</span>
            <span className="font-bold text-slate-800">{totalPrice === 0 ? "Free Pass" : `ETB ${totalPrice}`}</span>
          </div>
        </div>
        <Link
          href={`/events/${event.slug}`}
          style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-white font-bold text-xs rounded-xl hover:brightness-110 transition"
        >
          <span>View Event Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
      {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}

      {/* Ticket Tier Selection */}
      {event.ticketTiers && event.ticketTiers.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Select Pass Tier</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {event.ticketTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                style={{
                  borderColor: selectedTierId === tier.id ? "var(--color-primary, #4F46E5)" : undefined,
                  backgroundColor: selectedTierId === tier.id ? "rgba(var(--color-primary-rgb, 79, 70, 229), 0.06)" : undefined,
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  selectedTierId === tier.id ? "ring-1 ring-[var(--color-primary)]" : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{tier.name}</div>
                  <div className="text-[10px] text-slate-500">{tier.remaining} remaining</div>
                </div>
                <span style={{ color: "var(--color-primary, #4F46E5)" }} className="text-xs font-black">
                  {tier.price === 0 ? "Free" : `ETB ${tier.price}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attendee Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Full Name *</label>
          <input
            required
            type="text"
            placeholder="Abebe Bekele"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Phone Number *</label>
          <input
            required
            type="tel"
            placeholder="09... / +251..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Email for Pass *</label>
        <input
          required
          type="email"
          placeholder="attendee@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Payment Method */}
      {totalPrice > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Payment Option</label>
          <div className="grid grid-cols-3 gap-2">
            {(["TELEBIRR", "CBE", "PAY_AT_GATE"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                style={{
                  backgroundColor: paymentMethod === m ? "var(--color-primary, #4F46E5)" : undefined,
                  borderColor: paymentMethod === m ? "var(--color-primary, #4F46E5)" : undefined,
                }}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                  paymentMethod === m ? "text-white shadow-2xs" : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {m === "TELEBIRR" ? "Telebirr" : m === "CBE" ? "CBE Bank" : "Pay at Gate"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
        className="w-full py-3 text-white font-bold text-sm rounded-xl shadow-md transition hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Reservation...</span>
          </>
        ) : (
          <>
            <Ticket className="w-4 h-4" />
            <span>{totalPrice === 0 ? "Confirm Free Entry Pass" : `Confirm & Take Place (ETB ${totalPrice.toLocaleString()})`}</span>
          </>
        )}
      </button>
    </form>
  );
}
