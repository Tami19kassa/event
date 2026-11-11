"use client";

import { Search, Clapperboard, Film, FileText, Globe } from "lucide-react";
import type {
  AdminMediaSummary,
  MediaEventOption,
  MediaKindFilter,
  MediaStatusFilter,
} from "@/lib/media-admin-helpers";

interface FilterProps {
  summary: AdminMediaSummary;
  search: string;
  onSearchChange: (val: string) => void;
  kindFilter: MediaKindFilter;
  onKindFilterChange: (val: MediaKindFilter) => void;
  statusFilter: MediaStatusFilter;
  onStatusFilterChange: (val: MediaStatusFilter) => void;
  eventId: string;
  onEventIdChange: (val: string) => void;
  events: MediaEventOption[];
}

export function MediaFilterBar({
  summary, search, onSearchChange, kindFilter, onKindFilterChange,
  statusFilter, onStatusFilterChange, eventId, onEventIdChange, events,
}: FilterProps) {
  const kindTabs: { val: MediaKindFilter; label: string; count: number; icon: typeof Clapperboard }[] = [
    { val: "ALL", label: "All Media", count: summary.totalCount, icon: Clapperboard },
    { val: "VIDEO_VLOG", label: "Videos & Vlogs", count: summary.videoCount, icon: Film },
    { val: "ARTICLE", label: "Blog Stories", count: summary.articleCount, icon: FileText },
    { val: "EXTERNAL_LINK", label: "External Links", count: summary.externalCount, icon: Globe },
  ];

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-3 sm:p-3.5 shadow-2xs space-y-2.5">
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search headline, tag, excerpt, slug, or linked event..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 theme-radius-sm text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <select
            aria-label="Filter by linked event"
            value={eventId}
            onChange={(e) => onEventIdChange(e.target.value)}
            className="flex-1 sm:w-48 px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="ALL">All Events ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200 theme-radius-sm">
            {(["ALL", "PUBLISHED", "DRAFT"] as MediaStatusFilter[]).map((s) => {
              const active = statusFilter === s;
              const label = s === "ALL" ? "All" : s === "PUBLISHED" ? "Published" : `Drafts (${summary.draftCount})`;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusFilterChange(s)}
                  className={`px-2.5 py-1 text-xs font-bold theme-radius-sm transition cursor-pointer whitespace-nowrap ${
                    active ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {kindTabs.map((tab) => {
          const active = kindFilter === tab.val;
          return (
            <button
              key={tab.val}
              type="button"
              onClick={() => onKindFilterChange(tab.val)}
              className={`px-2.5 py-1 theme-radius-sm text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 ${
                active ? "theme-nav-active" : "bg-slate-50/80 border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                  active ? "bg-white/20 text-current" : "bg-white text-slate-600 border border-slate-200/80"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
