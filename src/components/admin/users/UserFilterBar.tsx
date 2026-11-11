"use client";

import { Search, Users, Shield, Briefcase, Ticket } from "lucide-react";
import type { AdminUsersSummary, UserRoleFilter } from "@/lib/users-admin-helpers";

interface FilterBarProps {
  summary: AdminUsersSummary;
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: UserRoleFilter;
  onRoleFilterChange: (val: UserRoleFilter) => void;
}

export function UserFilterBar({
  summary,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: FilterBarProps) {
  const tabs: Array<{ val: UserRoleFilter; label: string; count: number; icon: typeof Users }> = [
    { val: "ALL", label: "All Users", count: summary.totalCount, icon: Users },
    { val: "ADMIN", label: "Admins", count: summary.adminCount, icon: Shield },
    { val: "ORGANIZER", label: "Organizers", count: summary.organizerCount, icon: Briefcase },
    { val: "ATTENDEE", label: "Attendees", count: summary.attendeeCount, icon: Ticket },
  ];

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search members by name, email address, or account ID..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 theme-radius-sm text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        {tabs.map((tab) => {
          const active = roleFilter === tab.val;
          return (
            <button
              key={tab.val}
              type="button"
              onClick={() => onRoleFilterChange(tab.val)}
              className={`px-2.5 py-1.5 theme-radius-sm text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 ${
                active
                  ? "theme-nav-active"
                  : "bg-slate-50/80 border border-slate-200 text-slate-600 hover:bg-slate-100"
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
