"use client";

import { DoorOpen, Phone, UserCheck, ShieldCheck, RefreshCw, Eye } from "lucide-react";
import {
  formatAdminOrderTime,
  isReleasedStatus,
  type AdminOrderRow,
} from "@/lib/orders-admin-helpers";
import { OrderMethodBadge, OrderStatusBadge } from "./OrderBadges";

interface RowProps {
  order: AdminOrderRow;
  currency: string;
  canManageReceipts: boolean;
  actionInProgress: string | null;
  onCheckIn: (id: string, ref: string) => void;
  onApprove: (id: string, ref: string) => void;
  onInspect: (order: AdminOrderRow) => void;
}

export function OrderRow({
  order,
  currency,
  canManageReceipts,
  actionInProgress,
  onCheckIn,
  onApprove,
  onInspect,
}: RowProps) {
  const isGate = order.paymentMethod === "PAY_AT_GATE";
  const isReleased = isReleasedStatus(order.status);
  const isPendingReview = order.status === "PENDING_VERIFICATION";
  const ordCurrency = order.currency || currency;
  const busy = actionInProgress === order.id;

  return (
    <tr className={`transition ${isReleased ? "bg-slate-50/40 opacity-80" : "hover:bg-slate-50/70"}`}>
      <td className="px-5 py-3.5 align-top">
        <div className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
          {order.orderNumber}
        </div>
        <div className="text-[11px] text-slate-400 mt-1 whitespace-nowrap">{formatAdminOrderTime(order.createdAt)}</div>
        <div className="mt-1.5">
          <OrderMethodBadge method={order.paymentMethod} totalAmount={order.totalAmount} />
        </div>
      </td>

      <td className="px-5 py-3.5 align-top">
        <div className="font-bold text-slate-900 text-sm">{order.customerName || "Guest"}</div>
        <div className="text-xs text-slate-500 truncate max-w-[175px]">{order.customerEmail}</div>
        {order.customerPhone && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 mt-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{order.customerPhone}</span>
          </div>
        )}
      </td>

      <td className="px-5 py-3.5 align-top">
        <div className="font-semibold text-slate-800 line-clamp-1 max-w-[190px]">
          {order.event?.title || "Event Pass"}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2 max-w-[190px]">
          {order.items.map((i) => `${i.quantity}x ${i.ticketName}`).join(", ") || "1x Pass"}
        </div>
      </td>

      <td className="px-5 py-3.5 align-top">
        <OrderStatusBadge status={order.status} />
        {order.transactionRef && (
          <div
            className="mt-1.5 text-[11px] font-mono text-slate-500 truncate max-w-[155px]"
            title={order.transactionRef}
          >
            Ref: {order.transactionRef}
          </div>
        )}
      </td>

      <td className="px-5 py-3.5 align-top font-sans font-bold tabular-nums text-slate-900 text-sm whitespace-nowrap">
        {order.totalAmount > 0 ? `${ordCurrency} ${order.totalAmount.toLocaleString()}` : "Free"}
      </td>

      <td className="px-5 py-3.5 align-top">
        {isReleased ? (
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Voided</span>
        ) : order.checkedIn ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              <UserCheck className="w-3.5 h-3.5 shrink-0" /> Checked In
            </span>
            {order.checkedInAt && (
              <div className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">
                {formatAdminOrderTime(order.checkedInAt)}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs font-medium whitespace-nowrap text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
            Not arrived
          </span>
        )}
      </td>

      <td className="px-5 py-3.5 align-top text-right">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onInspect(order)}
            title="Inspect order, receipt, or cancel"
            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap theme-radius-sm transition cursor-pointer inline-flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" /> Inspect
          </button>

          {canManageReceipts && isPendingReview && (
            <button
              type="button"
              onClick={() => onApprove(order.id, order.orderNumber)}
              disabled={busy}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap theme-radius-sm transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Approve
            </button>
          )}

          {!order.checkedIn && !isReleased && (
            <button
              type="button"
              onClick={() => onCheckIn(order.id, order.orderNumber)}
              disabled={busy}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap theme-radius-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 transition ${
                isPendingReview
                  ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
                  : "theme-btn-primary"
              }`}
            >
              {busy ? (
                <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin" />
              ) : (
                <DoorOpen className="w-3.5 h-3.5 shrink-0" />
              )}
              {isGate ? "Collect & Admit" : "Check-in"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
