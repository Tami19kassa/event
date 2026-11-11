"use client";

import { ShoppingBag } from "lucide-react";
import type { AdminOrderRow } from "@/lib/orders-admin-helpers";
import { OrderRow } from "./OrderRow";

interface TableProps {
  orders: AdminOrderRow[];
  currency: string;
  canManageReceipts: boolean;
  actionInProgress: string | null;
  onCheckIn: (id: string, ref: string) => void;
  onApprove: (id: string, ref: string) => void;
  onInspect: (order: AdminOrderRow) => void;
}

export function OrdersTable({
  orders,
  currency,
  canManageReceipts,
  actionInProgress,
  onCheckIn,
  onApprove,
  onInspect,
}: TableProps) {
  return (
    <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
      {orders.length === 0 ? (
        <div className="p-14 text-center space-y-2 text-slate-400">
          <ShoppingBag className="w-9 h-9 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No matching orders</h3>
          <p className="text-xs">Try clearing your search query or switching filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-bold">Order &amp; Method</th>
                <th className="px-5 py-3.5 font-bold">Attendee</th>
                <th className="px-5 py-3.5 font-bold">Event &amp; Passes</th>
                <th className="px-5 py-3.5 font-bold">Payment</th>
                <th className="px-5 py-3.5 font-bold">Total ({currency})</th>
                <th className="px-5 py-3.5 font-bold">Gate</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <OrderRow
                  key={ord.id}
                  order={ord}
                  currency={currency}
                  canManageReceipts={canManageReceipts}
                  actionInProgress={actionInProgress}
                  onCheckIn={onCheckIn}
                  onApprove={onApprove}
                  onInspect={onInspect}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
