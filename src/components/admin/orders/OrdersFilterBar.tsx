"use client";

import { QrCode, Search, ArrowRight } from "lucide-react";
import {
  extractOrderNumber,
  type AdminOrderEventOption,
  type AdminOrderSummary,
  type OrderStatusFilter,
} from "@/lib/orders-admin-helpers";

interface FilterProps {
  summary: AdminOrderSummary;
  search: string;
  onSearchChange: (value: string) => void;
  onLookupPass: (code: string) => void;
  onOpenCamera: () => void;
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
  onLookupPass,
  onOpenCamera,
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

  const handleInputChange = (val: string) => {
    if (/(\?scan=|\/admin\/orders\?|^EVT-[A-Z0-9-]{6,}$)/i.test(val.trim())) {
      const code = extractOrderNumber(val);
      onSearchChange(code);
      onLookupPass(code);
      return;
    }
    onSearchChange(val);
  };

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-3 sm:p-3.5 shadow-2xs space-y-2.5">
      <div className="flex flex-col md:flex-row gap-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) onLookupPass(extractOrderNumber(search));
          }}
          className="relative flex-1 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search or scan EVT pass, receipt ref, phone, customer, or event..."
              className="w-full pl-10 pr-24 py-2 bg-slate-50/70 border border-slate-200 theme-radius-sm text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {search.trim() && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 theme-badge border text-[11px] font-bold theme-radius-sm inline-flex items-center gap-1 cursor-pointer hover:brightness-95"
              >
                Check Pass <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <select
            aria-label="Filter by event"
            value={eventId}
            onChange={(e) => onEventIdChange(e.target.value)}
            className="flex-1 md:w-52 px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="ALL">All Events ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenCamera}
            className="px-3.5 py-2 theme-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {chips.map((chip) => {
          const active = statusFilter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onStatusFilterChange(chip.key)}
              className={`px-2.5 py-1 theme-radius-sm text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 ${
                active
                  ? "theme-nav-active"
                  : "bg-slate-50/80 border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{chip.label}</span>
              {typeof chip.count === "number" && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                    active ? "bg-white/20 text-current" : "bg-white text-slate-600 border border-slate-200/80"
                  }`}
                >
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
