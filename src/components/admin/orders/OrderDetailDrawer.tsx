"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Copy, Check } from "lucide-react";
import {
  formatAdminOrderTime,
  isSafeHttpUrl,
  type AdminOrderRow,
} from "@/lib/orders-admin-helpers";
import { OrderMethodBadge, OrderStatusBadge } from "./OrderBadges";
import { OrderDrawerActions } from "./OrderDrawerActions";

interface DrawerProps {
  order: AdminOrderRow | null;
  currency: string;
  canManageReceipts: boolean;
  actionInProgress: string | null;
  onClose: () => void;
  onUpdateStatus: (id: string, orderNumber: string, status: string) => Promise<void>;
  onCheckIn: (id: string, orderNumber: string, undo?: boolean) => Promise<void>;
}

export function OrderDetailDrawer({
  order,
  currency,
  canManageReceipts,
  actionInProgress,
  onClose,
  onUpdateStatus,
  onCheckIn,
}: DrawerProps) {
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    setCopiedRef(false);
  }, [order?.id]);

  useEffect(() => {
    if (!order) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order, onClose]);

  if (!order) return null;

  const ordCurrency = order.currency || currency;
  const hasSafeReceipt = isSafeHttpUrl(order.receiptUrl);

  const handleCopyRef = async () => {
    if (!order.transactionRef) return;
    try {
      await navigator.clipboard.writeText(order.transactionRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Order Details
            </span>
            <h2 className="font-mono font-bold text-base text-slate-900">{order.orderNumber}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-2 hover:bg-slate-100 theme-radius-sm text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          <div className="flex items-center justify-between gap-2 bg-slate-50 p-3.5 theme-radius border border-slate-200">
            <OrderStatusBadge status={order.status} />
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Booked At</span>
              <span className="text-xs font-semibold text-slate-700">
                {formatAdminOrderTime(order.createdAt)}
              </span>
            </div>
          </div>

          <section className="space-y-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Attendee
            </h3>
            <div className="font-bold text-slate-900">{order.customerName || "Guest"}</div>
            <a
              href={`mailto:${order.customerEmail}`}
              className="text-xs text-[var(--color-primary)] hover:underline block"
            >
              {order.customerEmail}
            </a>
            {order.customerPhone && (
              <a
                href={`tel:${order.customerPhone}`}
                className="text-xs font-mono text-slate-700 hover:underline block"
              >
                {order.customerPhone}
              </a>
            )}
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {order.event?.title || "Event Pass"}
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 theme-radius overflow-hidden">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-2.5 flex items-center justify-between text-xs bg-white"
                >
                  <span className="font-medium text-slate-800">
                    {item.quantity}x {item.ticketName}
                  </span>
                  <span className="font-mono font-semibold text-slate-700">
                    {item.unitPrice > 0
                      ? `${ordCurrency} ${(item.quantity * item.unitPrice).toLocaleString()}`
                      : "Free"}
                  </span>
                </div>
              ))}
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs bg-slate-50 font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span>Total</span>
                  <OrderMethodBadge method={order.paymentMethod} totalAmount={order.totalAmount} />
                </span>
                <span className="font-sans font-bold tabular-nums">
                  {order.totalAmount > 0
                    ? `${ordCurrency} ${order.totalAmount.toLocaleString()}`
                    : "Free"}
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-2.5 border-t border-slate-100 pt-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Payment Reference &amp; Receipt
            </h3>
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 theme-radius-sm">
              <span className="font-mono text-xs text-slate-800 truncate">
                {order.transactionRef || "No reference stored"}
              </span>
              {order.transactionRef && (
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedRef ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedRef ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            {hasSafeReceipt && order.receiptUrl && (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3.5 py-2.5 border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold text-xs theme-radius-sm inline-flex items-center justify-center gap-1.5 hover:bg-[var(--color-primary)]/10 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Official Bank Receipt
              </a>
            )}
          </section>
        </div>

        <OrderDrawerActions
          order={order}
          currency={currency}
          canManageReceipts={canManageReceipts}
          busy={actionInProgress === order.id}
          onUpdateStatus={onUpdateStatus}
          onCheckIn={onCheckIn}
        />
      </aside>
    </div>
  );
}
