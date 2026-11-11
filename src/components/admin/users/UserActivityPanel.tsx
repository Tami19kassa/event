"use client";

import { Calendar, ShoppingBag } from "lucide-react";
import type { AdminUserItem, UserActivityDetail } from "@/lib/users-admin-helpers";

interface ActivityProps {
  user: AdminUserItem;
  detail: UserActivityDetail | null;
}

export function UserActivityPanel({ user, detail }: ActivityProps) {
  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
        <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        <span>Hosted Events ({user.organizedEventsCount})</span>
      </div>
      {detail?.recentEvents.length ? (
        <ul className="space-y-1.5">
          {detail.recentEvents.map((ev) => (
            <li
              key={ev.id}
              className="text-xs p-2.5 bg-slate-50 theme-radius-sm border border-slate-100 flex items-center justify-between gap-2"
            >
              <span className="font-semibold text-slate-800 truncate">{ev.title}</span>
              <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">{ev.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400">No hosted events assigned.</p>
      )}

      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pt-2">
        <ShoppingBag className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        <span>Ticket Orders ({user.ordersCount})</span>
      </div>
      {detail?.recentOrders.length ? (
        <ul className="space-y-1.5">
          {detail.recentOrders.map((ord) => (
            <li
              key={ord.id}
              className="text-xs p-2.5 bg-slate-50 theme-radius-sm border border-slate-100 flex items-center justify-between gap-2"
            >
              <span className="font-semibold text-slate-800 truncate">
                {ord.orderNumber} · {ord.eventTitle}
              </span>
              <span className="text-[11px] font-bold text-slate-700 shrink-0">
                {ord.currency} {ord.totalAmount}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400">No ticket orders linked to this user.</p>
      )}
    </div>
  );
}
