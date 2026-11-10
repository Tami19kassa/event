"use client";

import { Search, RefreshCw, Star } from "lucide-react";

export type EventStatusFilter = "ALL" | "PUBLISHED" | "LIVE" | "DRAFT" | "ARCHIVED";

interface Props {
  totalCount: number;
  statusFilter: EventStatusFilter;
  onStatusChange: (status: EventStatusFilter) => void;
  featuredOnly: boolean;
  onToggleFeaturedOnly: () => void;
  search: string;
  onSearchChange: (val: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export function EventsFilterBar({
  totalCount,
  statusFilter,
  onStatusChange,
  featuredOnly,
  onToggleFeaturedOnly,
  search,
  onSearchChange,
  loading,
  onRefresh,
}: Props) {
  const chips: { key: EventStatusFilter; label: string }[] = [
    { key: "ALL", label: `All (${totalCount})` },
    { key: "PUBLISHED", label: "Published" },
    { key: "LIVE", label: "Live" },
    { key: "DRAFT", label: "Drafts" },
    { key: "ARCHIVED", label: "Ended / Cancelled" },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onStatusChange(chip.key)}
            className={`px-3 py-1.5 theme-radius-sm text-xs font-bold transition cursor-pointer ${
              statusFilter === chip.key
                ? "theme-nav-active"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {chip.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onToggleFeaturedOnly}
          className={`inline-flex items-center gap-1 px-3 py-1.5 theme-radius-sm text-xs font-bold border transition cursor-pointer ${
            featuredOnly
              ? "theme-badge-accent"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${featuredOnly ? "fill-current" : ""}`} />
          <span>Featured</span>
        </button>
      </div>

      <div className="flex items-center gap-2 lg:w-80">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, city, venue..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh catalog"
          className="p-2 bg-white border border-slate-200 theme-radius-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
        </button>
      </div>
    </div>
  );
}
