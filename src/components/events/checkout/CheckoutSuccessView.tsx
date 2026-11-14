"use client";

import { CheckCircle2, Printer } from "lucide-react";
import { Event } from "@/types/event";
import { TicketPassCard } from "./TicketPassCard";
import { CalendarSyncButtons } from "./CalendarSyncButtons";

interface Props {
  event: Event;
  order: any;
  onClose: () => void;
}

export function CheckoutSuccessView({ event, order, onClose }: Props) {
  const isPayAtGate = order.status === "RESERVED_PAY_AT_GATE";

  const calendarData = {
    title: `${event.title} - Pass #${order.orderNumber}`,
    description: `${event.shortDescription || event.title}\nRef: ${order.orderNumber}`,
    location: `${event.location.name}, ${event.location.city}, Ethiopia`,
    startDate: event.startDate,
    endDate: event.endDate,
    orderNumber: order.orderNumber,
    status: order.status,
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="text-center py-2 space-y-4">
      <div className="w-14 h-14 bg-emerald-100 theme-radius-card flex items-center justify-center mx-auto text-emerald-600">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-2xl font-display text-slate-900 mb-1">
          {isPayAtGate ? "Gate Reservation Confirmed!" : "Ticket Pass Ready!"}
        </h3>
        <p className="text-xs text-slate-500">
          Your digital entry pass has been generated. Screenshot or save it now.
        </p>
      </div>

      <TicketPassCard event={event} order={order} />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 theme-radius-sm text-xs font-bold text-slate-800 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          Print / Save Pass
        </button>
        <button
          type="button"
          onClick={onClose}
          className="py-2.5 px-3 bg-slate-100 text-slate-700 font-bold theme-radius-sm hover:bg-slate-200 transition text-xs cursor-pointer"
        >
          Done
        </button>
      </div>

      <CalendarSyncButtons eventData={calendarData} orderNumber={order.orderNumber} />
    </div>
  );
}
