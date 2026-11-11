"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { AdminCategoryRow } from "@/lib/categories-admin";
import { CategoryEditDrawer, CategoryDeleteDrawer } from "./CategoryRowInlinePanels";

interface Props {
  category: AdminCategoryRow;
  otherCategories: AdminCategoryRow[];
  totalLiveAcrossSite: number;
  busy: boolean;
  onSaveEdit: (id: string, payload: { name: string; slug: string; icon: string }) => Promise<void>;
  onDelete: (id: string, reassignTo?: string) => Promise<void>;
}

export function CategoryRowCard({
  category,
  otherCategories,
  totalLiveAcrossSite,
  busy,
  onSaveEdit,
  onDelete,
}: Props) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const sharePct = totalLiveAcrossSite > 0 ? Math.round((category.liveCount / totalLiveAcrossSite) * 100) : 0;

  return (
    <div className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 theme-radius-sm theme-icon-soft border flex items-center justify-center shrink-0">
            <CategoryIcon name={category.icon} className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{category.name}</h3>
              <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                /{category.slug}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
              <span
                className={
                  category.liveCount > 0
                    ? "px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                }
              >
                {category.liveCount} live
              </span>
              {category.draftCount > 0 && (
                <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                  +{category.draftCount} draft / past
                </span>
              )}
              {totalLiveAcrossSite > 0 && category.liveCount > 0 && (
                <span className="text-slate-400 font-medium">{sharePct}% of catalog</span>
              )}
            </div>
            {category.liveCount > 0 && (
              <div className="mt-2 h-1.5 w-44 max-w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(8, sharePct)}%`,
                    background: "var(--color-secondary)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <Link
            href={`/admin/events/new?categoryId=${category.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold theme-badge-secondary border theme-radius-sm hover:brightness-95 transition"
            title="Create new event in this type"
          >
            <Plus className="w-3.5 h-3.5" /> Event
          </Link>
          <Link
            href={`/discover?category=${category.slug}`}
            target="_blank"
            className="p-2 text-slate-400 hover:text-[var(--color-secondary-ink,var(--color-secondary))] hover:bg-slate-100 theme-radius-sm transition"
            title="View public filter page"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMode(mode === "edit" ? "view" : "edit")}
            className={`p-2 theme-radius-sm transition cursor-pointer ${
              mode === "edit" ? "theme-badge" : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            }`}
            title="Edit event type"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "delete" ? "view" : "delete")}
            className={`p-2 theme-radius-sm transition cursor-pointer ${
              mode === "delete" ? "bg-rose-50 text-rose-600" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            }`}
            title="Delete event type"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mode === "edit" && (
        <CategoryEditDrawer
          key={`edit-${category.id}-${category.name}-${category.slug}-${category.icon}`}
          category={category}
          busy={busy}
          onSave={onSaveEdit}
          onCancel={() => setMode("view")}
        />
      )}

      {mode === "delete" && (
        <CategoryDeleteDrawer
          key={`del-${category.id}-${otherCategories.map((c) => c.id).join(",")}`}
          category={category}
          otherCategories={otherCategories}
          busy={busy}
          onConfirm={onDelete}
          onCancel={() => setMode("view")}
        />
      )}
    </div>
  );
}
