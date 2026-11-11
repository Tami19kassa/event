"use client";

import { Search } from "lucide-react";

export type CategoryFilter = "ALL" | "ACTIVE" | "EMPTY";

interface Props {
  totalCount: number;
  filter: CategoryFilter;
  onFilterChange: (f: CategoryFilter) => void;
  search: string;
  onSearchChange: (q: string) => void;
}

export function CategoriesFilterBar({
  totalCount,
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: Props) {
  const tabs: { key: CategoryFilter; label: string }[] = [
    { key: "ALL", label: `All (${totalCount})` },
    { key: "ACTIVE", label: "In Use" },
    { key: "EMPTY", label: "Empty (0)" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onFilterChange(tab.key)}
            className={`px-3 py-1.5 theme-radius-sm text-xs font-bold transition cursor-pointer ${
              filter === tab.key
                ? "theme-nav-active"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative sm:w-64">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search types or slugs..."
          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}
