"use client";

import { ArrowRight, Ticket } from "lucide-react";
import type { TicketTier } from "@/types/event";

interface Props {
  ticketTiers: TicketTier[];
  currency?: string;
  onOpenBooking?: () => void;
}

export function MobileBookingBar({
  ticketTiers,
  currency = "ETB",
  onOpenBooking,
}: Props) {
  const minPrice =
    ticketTiers.length > 0
      ? Math.min(...ticketTiers.map((t) => t.price))
      : 0;

  const totalRemaining = ticketTiers.reduce((acc, t) => acc + (t.remaining || 0), 0);
  const isSoldOut = ticketTiers.length > 0 && totalRemaining === 0;

  const handleScrollToBooking = () => {
    if (onOpenBooking) {
      onOpenBooking();
      return;
    }
    const el = document.getElementById("tickets-pricing-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {isSoldOut ? "Tickets Status" : "Ticket Pricing"}
          </span>
          <div className="font-extrabold text-slate-900 text-base leading-tight">
            {isSoldOut ? (
              <span className="text-rose-600">Sold Out</span>
            ) : minPrice === 0 ? (
              <span className="text-emerald-600">Free Admission</span>
            ) : (
              <span>
                From <span className="text-[var(--color-primary)] font-display">{currency} {minPrice.toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={isSoldOut}
          onClick={handleScrollToBooking}
          className="py-2.5 px-5 font-bold theme-btn-primary shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm shrink-0"
        >
          <Ticket className="w-4 h-4" />
          <span>{isSoldOut ? "Sold Out" : "Get Tickets"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
