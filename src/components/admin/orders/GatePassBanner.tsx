"use client";

import { DoorOpen, AlertTriangle, CheckCircle2, Eye, ShieldCheck, X, QrCode } from "lucide-react";
import { findScannedOrder, isReleasedStatus, type AdminOrderRow } from "@/lib/orders-admin-helpers";
import { OrderStatusBadge } from "./OrderBadges";

interface BannerProps {
  orders: AdminOrderRow[];
  scanCode: string;
  currency: string;
  canManageReceipts: boolean;
  actionInProgress: string | null;
  onClearScan: () => void;
  onCheckIn: (orderId: string, orderNumber: string) => void;
  onApproveReceipt: (orderId: string, orderNumber: string) => void;
  onInspectOrder: (order: AdminOrderRow) => void;
}

export function GatePassBanner({
  orders,
  scanCode,
  currency,
  canManageReceipts,
  actionInProgress,
  onClearScan,
  onCheckIn,
  onApproveReceipt,
  onInspectOrder,
}: BannerProps) {
  if (!scanCode.trim()) return null;

  const scannedOrder = findScannedOrder(orders, scanCode);
  const ordCurrency = scannedOrder?.currency || currency;
  const isBlocked = scannedOrder ? isReleasedStatus(scannedOrder.status) : false;
  const isPendingReceipt = scannedOrder?.status === "PENDING_VERIFICATION";

  const surfaceClass = !scannedOrder || isBlocked
    ? "bg-rose-50/70 border-rose-200"
    : isPendingReceipt
    ? "bg-amber-50/70 border-amber-200"
    : scannedOrder.checkedIn
    ? "bg-emerald-50/60 border-emerald-200"
    : "bg-white border-[var(--color-primary)]/35";

  return (
    <div data-gate-banner="true" className={`theme-radius-card border-2 px-4 py-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${surfaceClass}`}>
      {!scannedOrder ? (
        <div className="flex items-center gap-2.5 text-rose-800 text-xs sm:text-sm font-semibold">
          <div className="w-8 h-8 theme-radius-sm bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span>Pass or reference &ldquo;{scanCode}&rdquo; was not found in active orders.</span>
        </div>
      ) : (
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 theme-radius-sm theme-icon-soft border flex items-center justify-center shrink-0 mt-0.5">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-sm">{scannedOrder.orderNumber}</span>
              <OrderStatusBadge status={scannedOrder.status} />
              {scannedOrder.checkedIn && !isBlocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Already Admitted
                </span>
              )}
            </div>
            <div className="text-slate-700 font-semibold truncate">
              {scannedOrder.customerName || "Guest"} · {scannedOrder.event?.title} ·{" "}
              {scannedOrder.items.map((i) => `${i.quantity}x ${i.ticketName}`).join(", ")}
            </div>
            {isPendingReceipt && !isBlocked && (
              <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                Payment receipt unverified — confirm transfer before admitting.
              </div>
            )}
            {isBlocked && (
              <div className="text-rose-700 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Cancelled or voided booking — entry blocked.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
        {scannedOrder && (
          <button type="button" onClick={() => onInspectOrder(scannedOrder)} className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold theme-radius-sm inline-flex items-center gap-1.5 cursor-pointer">
            <Eye className="w-3.5 h-3.5" /> Inspect
          </button>
        )}
        {scannedOrder && isPendingReceipt && canManageReceipts && !isBlocked && (
          <button type="button" disabled={actionInProgress === scannedOrder.id} onClick={() => onApproveReceipt(scannedOrder.id, scannedOrder.orderNumber)} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold theme-radius-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            <ShieldCheck className="w-3.5 h-3.5" /> Verify Receipt
          </button>
        )}
        {scannedOrder && !scannedOrder.checkedIn && !isBlocked && (
          <button
            type="button"
            disabled={actionInProgress === scannedOrder.id}
            onClick={() => onCheckIn(scannedOrder.id, scannedOrder.orderNumber)}
            className={`px-3.5 py-1.5 font-bold text-xs theme-radius-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isPendingReceipt
                ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                : "theme-btn-primary"
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            {scannedOrder.status === "RESERVED_PAY_AT_GATE"
              ? `Collect ${ordCurrency} ${scannedOrder.totalAmount.toLocaleString()} & Admit`
              : "Confirm Gate Entry"}
          </button>
        )}
        <button type="button" onClick={onClearScan} aria-label="Clear scan" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white theme-radius-sm cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
