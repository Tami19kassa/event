"use client";

import { Search } from "lucide-react";
import type {
  AdminInquiriesSummary,
  InquiryStatus,
  InquiryType,
} from "@/lib/inquiries-admin-helpers";

interface FilterProps {
  summary: AdminInquiriesSummary;
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: "ALL" | InquiryType;
  onTypeFilterChange: (v: "ALL" | InquiryType) => void;
  statusFilter: "ALL" | InquiryStatus;
  onStatusFilterChange: (v: "ALL" | InquiryStatus) => void;
}

export function InquiriesFilterBar({
  summary,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: FilterProps) {
  const statusChips: { key: "ALL" | InquiryStatus; label: string; count: number }[] = [
    { key: "ALL", label: "All Leads", count: summary.totalCount },
    { key: "NEW", label: "New Unread", count: summary.newCount },
    { key: "CONTACTED", label: "Contacted", count: summary.contactedCount },
    { key: "QUALIFIED", label: "Qualified", count: summary.qualifiedCount },
    { key: "ARCHIVED", label: "Archived", count: summary.archivedCount },
  ];

  const typePills: { key: "ALL" | InquiryType; label: string }[] = [
    { key: "ALL", label: "All Types" },
    { key: "EXHIBITOR", label: `Exhibitors (${summary.exhibitorCount})` },
    { key: "SPONSOR", label: `Sponsors (${summary.sponsorCount})` },
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
            placeholder="Search company, contact name, email, phone, booth/tier, expo, or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 theme-radius-sm text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200 theme-radius-sm shrink-0">
          {typePills.map((pill) => {
            const active = typeFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => onTypeFilterChange(pill.key)}
                className={`px-3 py-1.5 text-xs font-bold theme-radius-sm transition cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {statusChips.map((chip) => {
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
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                  active ? "bg-white/20 text-current" : "bg-white text-slate-600 border border-slate-200/80"
                }`}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
