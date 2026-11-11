"use client";

import { Users, Shield, Briefcase, Ticket } from "lucide-react";
import type { AdminUsersSummary, UserRoleFilter } from "@/lib/users-admin-helpers";

interface StatsProps {
  summary: AdminUsersSummary;
  roleFilter: UserRoleFilter;
  onSelectRole: (r: UserRoleFilter) => void;
}

export function UserStats({ summary, roleFilter, onSelectRole }: StatsProps) {
  const staffCount = summary.adminCount + summary.organizerCount;
  const cards: Array<{
    id: UserRoleFilter;
    label: string;
    value: string;
    sub: string;
    icon: typeof Users;
    tone: string;
  }> = [
    {
      id: "ALL",
      label: "Total Accounts",
      value: summary.totalCount.toLocaleString(),
      sub: `${staffCount} dashboard ${staffCount === 1 ? "member" : "members"}`,
      icon: Users,
      tone: "theme-icon-soft",
    },
    {
      id: "ADMIN",
      label: "Platform Admins",
      value: summary.adminCount.toLocaleString(),
      sub: "Full system control",
      icon: Shield,
      tone: "theme-badge",
    },
    {
      id: "ORGANIZER",
      label: "Event Organizers",
      value: summary.organizerCount.toLocaleString(),
      sub: "Events & gate access",
      icon: Briefcase,
      tone: "theme-icon-secondary",
    },
    {
      id: "ATTENDEE",
      label: "Attendees",
      value: summary.attendeeCount.toLocaleString(),
      sub: `${summary.buyersCount} with ticket orders`,
      icon: Ticket,
      tone: "theme-icon-accent",
    },
  ];

  return (
    <div data-users-kpi="true" className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const selected = roleFilter === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectRole(selected && card.id !== "ALL" ? "ALL" : card.id)}
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
            <div className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${card.tone}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
