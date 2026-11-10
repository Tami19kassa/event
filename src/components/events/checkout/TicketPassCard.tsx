"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Event } from "@/types/event";

interface TicketPassCardProps {
  event: Event;
  order: {
    orderNumber: string;
    customerName?: string | null;
    status: string;
    totalAmount: number;
  };
}

export function TicketPassCard({ event, order }: TicketPassCardProps) {
  const [qrSrc, setQrSrc] = useState("");
  const isGate = order.status === "RESERVED_PAY_AT_GATE";
  const isPending = order.status === "PENDING_VERIFICATION" || order.status === "PENDING";

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const payload = origin
      ? `${origin}/admin/orders?scan=${encodeURIComponent(order.orderNumber)}`
      : order.orderNumber;

    QRCode.toString(payload, {
      type: "svg",
      margin: 1,
      width: 140,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((svg) => setQrSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`))
      .catch(() => {});
  }, [order.orderNumber]);

  const badgeStyle = isGate
    ? "bg-amber-400 text-slate-950"
    : isPending
    ? "theme-bg-primary"
    : "bg-emerald-400 text-slate-950";

  const badgeLabel = isGate
    ? "Pay at Gate"
    : isPending
    ? "Pending Verification"
    : "Verified Paid";

  return (
    <div className="bg-slate-900 text-white theme-radius-card p-5 sm:p-6 text-left shadow-2xl relative overflow-hidden mb-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Official Scannable Pass
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeStyle}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg sm:text-xl font-display leading-snug mb-3">{event.title}</h4>
          <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">PASS REFERENCE</span>
              <span
                className="font-mono font-bold break-all"
                style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }}
              >
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ATTENDEE</span>
              <span className="font-bold truncate block">{order.customerName || "Guest"}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">VENUE</span>
              <span className="font-medium truncate block">
                {event.location.name || event.location.city || "Venue TBA"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                {isGate ? "TO PAY AT DOOR" : "TOTAL AMOUNT"}
              </span>
              <span className="font-extrabold text-emerald-400">
                ETB {order.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-lg">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrSrc} alt={`QR Pass ${order.orderNumber}`} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg" />
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1.5 uppercase tracking-wider">
            Scan at Gate
          </span>
        </div>
      </div>
    </div>
  );
}
