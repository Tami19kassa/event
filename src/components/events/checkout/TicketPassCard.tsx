import { QrCode } from "lucide-react";
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
  const isGate = order.status === "RESERVED_PAY_AT_GATE";

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 text-left shadow-2xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <QrCode className="w-32 h-32" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
          Official Event Pass
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isGate ? "bg-amber-400 text-slate-950" : "bg-emerald-400 text-slate-950"
          }`}
        >
          {isGate ? "Pay at Gate" : "Verified Paid"}
        </span>
      </div>

      <h4 className="text-xl font-bold mb-3">{event.title}</h4>

      <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
        <div>
          <span className="text-slate-400 block text-[10px]">PASS REFERENCE</span>
          <span className="font-mono font-bold text-indigo-300">
            {order.orderNumber}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">ATTENDEE</span>
          <span className="font-bold truncate block">
            {order.customerName || "Guest"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">VENUE</span>
          <span className="font-medium truncate block">
            {event.location.name || "Addis Ababa"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">
            {isGate ? "TO PAY AT DOOR" : "TOTAL PAID"}
          </span>
          <span className="font-extrabold text-emerald-400">
            ETB {order.totalAmount?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
