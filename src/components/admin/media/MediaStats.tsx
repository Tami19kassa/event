"use client";

import { Clapperboard, Globe, Film, Star } from "lucide-react";
import type {
  AdminMediaSummary,
  MediaKindFilter,
  MediaStatusFilter,
} from "@/lib/media-admin-helpers";

interface StatsProps {
  summary: AdminMediaSummary;
  kindFilter: MediaKindFilter;
  statusFilter: MediaStatusFilter;
  onSelectKind: (k: MediaKindFilter) => void;
  onSelectStatus: (s: MediaStatusFilter) => void;
}

export function MediaStats({
  summary,
  kindFilter,
  statusFilter,
  onSelectKind,
  onSelectStatus,
}: StatsProps) {
  const cards = [
    {
      id: "ALL",
      label: "Total Stories",
      value: summary.totalCount.toLocaleString(),
      sub: `${summary.articleCount} ${summary.articleCount === 1 ? "article" : "articles"} · ${summary.externalCount} ${summary.externalCount === 1 ? "link" : "links"}`,
      icon: Clapperboard,
      tone: "theme-icon-soft",
      selected: kindFilter === "ALL" && statusFilter === "ALL",
      onClick: () => {
        onSelectKind("ALL");
        onSelectStatus("ALL");
      },
    },
    {
      id: "PUBLISHED",
      label: "Published Live",
      value: summary.publishedCount.toLocaleString(),
      sub: `${summary.draftCount.toLocaleString()} saved in drafts`,
      icon: Globe,
      tone:
        summary.publishedCount > 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-500 border-slate-200",
      selected: statusFilter === "PUBLISHED",
      onClick: () => {
        onSelectKind("ALL");
        onSelectStatus(statusFilter === "PUBLISHED" ? "ALL" : "PUBLISHED");
      },
    },
    {
      id: "VIDEO_VLOG",
      label: "Videos & Vlogs",
      value: summary.videoCount.toLocaleString(),
      sub: "YouTube, Vimeo & MP4 reels",
      icon: Film,
      tone: "theme-icon-secondary",
      selected: kindFilter === "VIDEO_VLOG",
      onClick: () => {
        onSelectStatus("ALL");
        onSelectKind(kindFilter === "VIDEO_VLOG" ? "ALL" : "VIDEO_VLOG");
      },
    },
    {
      id: "FEATURED",
      label: "Lead Homepage Pins",
      value: summary.featuredCount.toLocaleString(),
      sub: "Prioritized first on homepage",
      icon: Star,
      tone: "theme-icon-accent",
      selected: false,
      onClick: () => {
        onSelectKind("ALL");
        onSelectStatus("PUBLISHED");
      },
    },
  ];

  return (
    <div data-media-kpi="true" className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
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
