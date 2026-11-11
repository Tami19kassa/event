"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, DoorOpen, RotateCcw, Ban, AlertTriangle } from "lucide-react";
import { isReleasedStatus, type AdminOrderRow } from "@/lib/orders-admin-helpers";

interface ActionsProps {
  order: AdminOrderRow;
  currency: string;
  canManageReceipts: boolean;
  busy: boolean;
  onUpdateStatus: (id: string, orderNumber: string, status: string) => Promise<void>;
  onCheckIn: (id: string, orderNumber: string, undo?: boolean) => Promise<void>;
}

export function OrderDrawerActions({
  order,
  currency,
  canManageReceipts,
  busy,
  onUpdateStatus,
  onCheckIn,
}: ActionsProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmUndo, setConfirmUndo] = useState(false);

  useEffect(() => {
    setConfirmCancel(false);
    setConfirmUndo(false);
  }, [order.id, order.status, order.checkedIn]);

  const ordCurrency = order.currency || currency;
  const isReleased = isReleasedStatus(order.status);
  const isGate = order.paymentMethod === "PAY_AT_GATE";
  const canVerify =
    canManageReceipts && (order.status === "PENDING_VERIFICATION" || order.status === "PENDING");
  const totalQty = order.items.reduce((s, it) => s + it.quantity, 0) || 1;

  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
      {canVerify && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, order.orderNumber, "COMPLETED")}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" /> Approve Receipt &amp; Mark Paid
        </button>
      )}

      {!order.checkedIn && !isReleased && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onCheckIn(order.id, order.orderNumber, false)}
          className="w-full py-2.5 theme-btn-primary text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <DoorOpen className="w-4 h-4" />
          {isGate
            ? `Collect ${ordCurrency} ${order.totalAmount.toLocaleString()} & Check In`
            : "Confirm Gate Check-In"}
        </button>
      )}

      {order.checkedIn && !isReleased && !confirmUndo && (
        <button
          type="button"
          onClick={() => setConfirmUndo(true)}
          className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Undo Gate Check-In
        </button>
      )}

      {confirmUndo && (
        <div className="p-3 bg-amber-50 border border-amber-200 theme-radius-sm space-y-2 text-xs">
          <p className="font-semibold text-amber-900">
            Reset gate status back to &ldquo;Not arrived&rdquo;?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onCheckIn(order.id, order.orderNumber, true)}
              className="flex-1 py-1.5 bg-amber-600 text-white font-bold theme-radius-sm cursor-pointer disabled:opacity-50"
            >
              Confirm Undo
            </button>
            <button
              type="button"
              onClick={() => setConfirmUndo(false)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold theme-radius-sm cursor-pointer"
            >
              Keep
            </button>
          </div>
        </div>
      )}

      {canManageReceipts && !isReleased && !confirmCancel && (
        <button
          type="button"
          onClick={() => setConfirmCancel(true)}
          className="w-full py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Ban className="w-3.5 h-3.5" /> Reject / Cancel Order
        </button>
      )}

      {confirmCancel && (
        <div className="p-3 bg-rose-50 border border-rose-200 theme-radius-sm space-y-2 text-xs">
          <p className="font-semibold text-rose-900 flex items-start gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              Cancel order &amp; release {totalQty} ticket{totalQty === 1 ? "" : "s"} back to stock?
            </span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpdateStatus(order.id, order.orderNumber, "CANCELLED")}
              className="flex-1 py-1.5 bg-rose-600 text-white font-bold theme-radius-sm cursor-pointer disabled:opacity-50"
            >
              Yes, Cancel Order
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold theme-radius-sm cursor-pointer"
            >
              Keep
            </button>
          </div>
        </div>
      )}

      {canManageReceipts && isReleased && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateStatus(order.id, order.orderNumber, "COMPLETED")}
          className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reactivate as Paid (If Stock Available)
        </button>
      )}
    </div>
  );
}
