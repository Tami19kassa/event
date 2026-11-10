"use client";

import { CheckCircle2 } from "lucide-react";
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

  return (
    <div className="text-center py-2 space-y-4">
      <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-2xl font-display text-slate-900 mb-1">
          {isPayAtGate ? "Gate Reservation Confirmed!" : "Ticket Pass Ready!"}
        </h3>
        <p className="text-xs text-slate-500">
          Your digital entry pass has been generated and saved.
        </p>
      </div>
      <TicketPassCard event={event} order={order} />
      <CalendarSyncButtons eventData={calendarData} orderNumber={order.orderNumber} />
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition text-sm cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}
