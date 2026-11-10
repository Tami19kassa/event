import {
  ExternalLink,
  CheckCircle2,
  Clock,
  DoorOpen,
  Phone,
  UserCheck,
  Building2,
  Smartphone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export type OrderItem = {
  id: string;
  ticketName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  paymentMethod: string | null;
  receiptUrl: string | null;
  transactionRef: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
  event?: { title: string; slug: string; startDate: string };
  items?: OrderItem[];
};

interface RowProps {
  order: Order;
  actionInProgress: string | null;
  onCheckIn: (id: string, ref: string) => void;
  onApprove: (id: string, ref: string) => void;
}

export function OrderRow({ order, actionInProgress, onCheckIn, onApprove }: RowProps) {
  const isGate = order.paymentMethod === "PAY_AT_GATE";
  const isTelebirr = order.paymentMethod === "TELEBIRR";
  const isCbe = order.paymentMethod === "CBE";

  return (
    <tr className="hover:bg-slate-50/60 transition">
      <td className="px-6 py-4">
        <div className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">
          {order.orderNumber}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          {isTelebirr && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Smartphone className="w-3 h-3" /> Telebirr
            </span>
          )}
          {isCbe && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Building2 className="w-3 h-3" /> CBE Bank
            </span>
          )}
          {isGate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <DoorOpen className="w-3 h-3" /> Pay at Gate
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="font-bold text-slate-900">{order.customerName || "Guest"}</div>
        <div className="text-xs text-slate-400 truncate max-w-[160px]">{order.customerEmail}</div>
        {order.customerPhone && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 mt-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{order.customerPhone}</span>
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="font-bold text-slate-800 line-clamp-1 max-w-[180px]">
          {order.event?.title || "Event Pass"}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {order.items?.map((i) => `${i.quantity}x ${i.ticketName}`).join(", ") || "1x Pass"}
        </div>
      </td>

      <td className="px-6 py-4">
        {order.status === "COMPLETED" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Paid
          </span>
        )}
        {order.status === "RESERVED_PAY_AT_GATE" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Gate Reserved
          </span>
        )}
        {order.status === "PENDING_VERIFICATION" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" /> Pending Scrape
          </span>
        )}

        {order.receiptUrl && (
          <div className="mt-1">
            <a
              href={order.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> View Bank Receipt
            </a>
          </div>
        )}
      </td>

      <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">
        ETB {order.totalAmount?.toLocaleString() ?? "0"}
      </td>

      <td className="px-6 py-4">
        {order.checkedIn ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
            <UserCheck className="w-3.5 h-3.5" /> Checked In
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
            Not yet arrived
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {!order.checkedIn && (
            <button
              onClick={() => onCheckIn(order.id, order.orderNumber)}
              disabled={actionInProgress === order.id}
              className="px-3 py-1.5 theme-btn-primary text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {actionInProgress === order.id ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <DoorOpen className="w-3.5 h-3.5" />
              )}
              {isGate ? "Collect & Check-in" : "Check-in Pass"}
            </button>
          )}

          {order.status === "PENDING_VERIFICATION" && (
            <button
              onClick={() => onApprove(order.id, order.orderNumber)}
              disabled={actionInProgress === order.id}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Approve
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
