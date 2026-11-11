"use client";

import { Search } from "lucide-react";
import type {
  AdminOrderEventOption,
  AdminOrderSummary,
  OrderStatusFilter,
} from "@/lib/orders-admin-helpers";

interface FilterProps {
  summary: AdminOrderSummary;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (value: OrderStatusFilter) => void;
  eventId: string;
  onEventIdChange: (value: string) => void;
  events: AdminOrderEventOption[];
}

export function OrdersFilterBar({
  summary,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  eventId,
  onEventIdChange,
  events,
}: FilterProps) {
  const chips: { key: OrderStatusFilter; label: string; count?: number }[] = [
    { key: "ALL", label: "All", count: summary.totalCount },
    { key: "PENDING_VERIFICATION", label: "Verify Receipt", count: summary.pendingReceiptsCount },
    { key: "RESERVED_PAY_AT_GATE", label: "Pay at Gate", count: summary.gatePendingCount },
    { key: "COMPLETED", label: "Verified Paid", count: summary.completedCount },
    { key: "CHECKED_IN", label: "Checked In", count: summary.checkedInCount },
    { key: "UNCHECKED", label: "Not Arrived" },
    { key: "CANCELLED", label: "Cancelled", count: summary.cancelledCount },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => {
          const active = statusFilter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onStatusFilterChange(chip.key)}
              className={`px-3 py-1.5 theme-radius-sm text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 ${
                active
                  ? "theme-nav-active"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{chip.label}</span>
              {typeof chip.count === "number" && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                    active ? "bg-white/20 text-current" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order #, receipt ref, phone, customer, ticket tier, or event..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 theme-radius-sm text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-2xs"
          />
        </div>

        <select
          aria-label="Filter by event"
          value={eventId}
          onChange={(e) => onEventIdChange(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-2xs cursor-pointer md:w-64"
        >
          <option value="ALL">All Events ({events.length})</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
