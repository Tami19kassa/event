import {
  CheckCircle2,
  Clock,
  DoorOpen,
  Building2,
  Smartphone,
  Ticket,
  Ban,
} from "lucide-react";

export function OrderMethodBadge({
  method,
  totalAmount,
}: {
  method: string | null;
  totalAmount: number;
}) {
  if (method === "FREE" || totalAmount <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-slate-100 text-slate-700 border border-slate-200">
        <Ticket className="w-3 h-3 shrink-0" /> Free Pass
      </span>
    );
  }
  if (method === "CBE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-amber-50 text-amber-800 border border-amber-200">
        <Building2 className="w-3 h-3 shrink-0" /> CBE Bank
      </span>
    );
  }
  if (method === "PAY_AT_GATE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-slate-100 text-slate-700 border border-slate-300">
        <DoorOpen className="w-3 h-3 shrink-0" /> Pay at Gate
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Smartphone className="w-3 h-3 shrink-0" /> Telebirr
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Verified Paid
        </span>
      );
    case "RESERVED_PAY_AT_GATE":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-full bg-amber-100 text-amber-800">
          <Clock className="w-3.5 h-3.5 shrink-0" /> Gate Reserved
        </span>
      );
    case "PENDING_VERIFICATION":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-full theme-badge-accent border">
          <Clock className="w-3.5 h-3.5 shrink-0" /> Verify Receipt
        </span>
      );
    case "CANCELLED":
    case "FAILED":
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-full bg-rose-100 text-rose-800">
          <Ban className="w-3.5 h-3.5 shrink-0" /> {status === "CANCELLED" ? "Cancelled" : "Failed"}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-full bg-slate-100 text-slate-700">
          <Clock className="w-3.5 h-3.5 shrink-0" /> {status.replace(/_/g, " ")}
        </span>
      );
  }
}
