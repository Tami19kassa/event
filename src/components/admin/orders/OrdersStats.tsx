"use client";

import { Coins, Clock, DoorOpen, UserCheck } from "lucide-react";
import type { AdminOrderSummary, OrderStatusFilter } from "@/lib/orders-admin-helpers";

interface StatsProps {
  summary: AdminOrderSummary;
  currency: string;
  activeFilter: OrderStatusFilter;
  onSelectFilter: (filter: OrderStatusFilter) => void;
}

export function OrdersStats({
  summary,
  currency,
  activeFilter,
  onSelectFilter,
}: StatsProps) {
  const attendancePct =
    summary.activePassesCount > 0
      ? Math.round((summary.checkedInCount / summary.activePassesCount) * 100)
      : 0;

  const cards: {
    key: OrderStatusFilter;
    label: string;
    value: string;
    sub: string;
    icon: typeof Coins;
    tone: string;
  }[] = [
    {
      key: "COMPLETED",
      label: "Verified Revenue",
      value: `${currency} ${summary.verifiedRevenue.toLocaleString()}`,
      sub: `${summary.completedCount.toLocaleString()} paid order${summary.completedCount === 1 ? "" : "s"}`,
      icon: Coins,
      tone: "theme-icon-soft",
    },
    {
      key: "PENDING_VERIFICATION",
      label: "Receipts to Verify",
      value: summary.pendingReceiptsCount.toLocaleString(),
      sub:
        summary.pendingReceiptsCount > 0
          ? "Click to inspect bank receipts"
          : "All receipts verified",
      icon: Clock,
      tone:
        summary.pendingReceiptsCount > 0
          ? "theme-icon-accent"
          : "bg-slate-50 text-slate-500 border-slate-200",
    },
    {
      key: "RESERVED_PAY_AT_GATE",
      label: "Pay at Gate Holds",
      value: summary.gatePendingCount.toLocaleString(),
      sub:
        summary.gatePendingCount > 0
          ? `${currency} ${summary.gatePendingRevenue.toLocaleString()} to collect`
          : "No pending door holds",
      icon: DoorOpen,
      tone: "theme-icon-secondary",
    },
    {
      key: "CHECKED_IN",
      label: "Gate Attendance",
      value: `${summary.checkedInCount.toLocaleString()} / ${summary.activePassesCount.toLocaleString()}`,
      sub: `${attendancePct}% of active passes checked in`,
      icon: UserCheck,
      tone:
        summary.checkedInCount > 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-500 border-slate-200",
    },
  ];

  return (
    <div data-orders-kpi="true" className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const selected = activeFilter === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectFilter(selected ? "ALL" : card.key)}
            className={`text-left bg-white px-4 py-3 theme-radius-card border shadow-2xs flex items-center justify-between gap-3 transition cursor-pointer ${
              selected
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                {card.label}
              </span>
              <div className="text-base sm:text-lg font-sans font-bold text-slate-900 tabular-nums mt-0.5 truncate">
                {card.value}
              </div>
              <span className="text-[11px] text-slate-400 block truncate">{card.sub}</span>
            </div>
            <div
              className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${card.tone}`}
            >
              <card.icon className="w-4 h-4" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
