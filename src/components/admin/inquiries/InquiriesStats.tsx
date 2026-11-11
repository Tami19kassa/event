"use client";

import { Sparkles, Building2, Award, CheckCircle2 } from "lucide-react";
import type {
  AdminInquiriesSummary,
  InquiryStatus,
  InquiryType,
} from "@/lib/inquiries-admin-helpers";

interface StatsProps {
  summary: AdminInquiriesSummary;
  activeTypeFilter: "ALL" | InquiryType;
  activeStatusFilter: "ALL" | InquiryStatus;
  onSelectType: (type: "ALL" | InquiryType) => void;
  onSelectStatus: (status: "ALL" | InquiryStatus) => void;
}

export function InquiriesStats({
  summary,
  activeTypeFilter,
  activeStatusFilter,
  onSelectType,
  onSelectStatus,
}: StatsProps) {
  const cards = [
    {
      id: "NEW",
      label: "New Unread",
      value: summary.newCount.toLocaleString(),
      sub: summary.newCount > 0 ? "Awaiting first response" : "Inbox caught up",
      icon: Sparkles,
      tone: summary.newCount > 0 ? "theme-icon-soft" : "bg-slate-50 text-slate-500 border-slate-200",
      selected: activeStatusFilter === "NEW" && activeTypeFilter === "ALL",
      onClick: () => {
        onSelectType("ALL");
        onSelectStatus(activeStatusFilter === "NEW" ? "ALL" : "NEW");
      },
    },
    {
      id: "EXHIBITOR",
      label: "Exhibitor Leads",
      value: summary.exhibitorCount.toLocaleString(),
      sub: `${summary.totalCount > 0 ? Math.round((summary.exhibitorCount / summary.totalCount) * 100) : 0}% booth inquiries`,
      icon: Building2,
      tone: "theme-icon-secondary",
      selected: activeTypeFilter === "EXHIBITOR",
      onClick: () => {
        onSelectStatus("ALL");
        onSelectType(activeTypeFilter === "EXHIBITOR" ? "ALL" : "EXHIBITOR");
      },
    },
    {
      id: "SPONSOR",
      label: "Sponsor Leads",
      value: summary.sponsorCount.toLocaleString(),
      sub: `${summary.contactedCount.toLocaleString()} currently in contact`,
      icon: Award,
      tone: "theme-icon-accent",
      selected: activeTypeFilter === "SPONSOR",
      onClick: () => {
        onSelectStatus("ALL");
        onSelectType(activeTypeFilter === "SPONSOR" ? "ALL" : "SPONSOR");
      },
    },
    {
      id: "QUALIFIED",
      label: "Qualified Deals",
      value: summary.qualifiedCount.toLocaleString(),
      sub: `${summary.archivedCount.toLocaleString()} archived`,
      icon: CheckCircle2,
      tone:
        summary.qualifiedCount > 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-500 border-slate-200",
      selected: activeStatusFilter === "QUALIFIED" && activeTypeFilter === "ALL",
      onClick: () => {
        onSelectType("ALL");
        onSelectStatus(activeStatusFilter === "QUALIFIED" ? "ALL" : "QUALIFIED");
      },
    },
  ];

  return (
    <div data-inquiries-kpi="true" className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={card.onClick}
          className={`text-left bg-white px-4 py-3 theme-radius-card border shadow-2xs flex items-center justify-between gap-3 transition cursor-pointer ${
            card.selected
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
          <div className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${card.tone}`}>
            <card.icon className="w-4 h-4" />
          </div>
        </button>
      ))}
    </div>
  );
}
