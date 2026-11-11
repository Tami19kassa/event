"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import {
  CategoryIcon,
  CATEGORY_ICON_OPTIONS,
  resolveCategoryIconKey,
  type CategoryIconKey,
} from "@/components/ui/CategoryIcon";
import { slugifyCategoryName, type AdminCategoryRow } from "@/lib/categories-admin";

interface EditProps {
  category: AdminCategoryRow;
  busy: boolean;
  onSave: (id: string, payload: { name: string; slug: string; icon: string }) => Promise<void>;
  onCancel: () => void;
}

export function CategoryEditDrawer({ category, busy, onSave, onCancel }: EditProps) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [icon, setIcon] = useState<CategoryIconKey>(() => resolveCategoryIconKey(category.icon));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(category.id, {
      name: name.trim(),
      slug: slugifyCategoryName(slug || name),
      icon,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 theme-radius space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Slug *</label>
            <button
              type="button"
              onClick={() => setSlug(slugifyCategoryName(name))}
              className="text-[11px] font-bold text-[var(--color-secondary-ink,var(--color-secondary))] hover:underline cursor-pointer"
            >
              Sync from name
            </button>
          </div>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div>
        <span className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Vector Icon</span>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {CATEGORY_ICON_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                title={opt.label}
                aria-label={opt.label}
                onClick={() => setIcon(opt.key)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer transition ${
                  icon === opt.key
                    ? "theme-badge shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <CategoryIcon name={opt.key} className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !name.trim()}
              className="px-3.5 py-1.5 text-xs font-bold theme-btn-primary disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

interface DeleteProps {
  category: AdminCategoryRow;
  otherCategories: AdminCategoryRow[];
  busy: boolean;
  onConfirm: (id: string, reassignTo?: string) => Promise<void>;
  onCancel: () => void;
}

export function CategoryDeleteDrawer({ category, otherCategories, busy, onConfirm, onCancel }: DeleteProps) {
  const [reassignTo, setReassignTo] = useState(otherCategories[0]?.id || "__none__");

  return (
    <div className="p-3.5 bg-rose-50/70 border border-rose-200 theme-radius flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {category.totalCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-rose-900">
          <span className="font-bold">{category.totalCount} linked event(s): move to</span>
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-slate-800"
          >
            {otherCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="__none__">Leave Uncategorized</option>
          </select>
        </div>
      ) : (
        <span className="text-xs font-bold text-rose-900">
          Delete &ldquo;{category.name}&rdquo;? No events are linked to this type.
        </span>
      )}

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            await onConfirm(category.id, category.totalCount > 0 ? reassignTo : undefined);
            onCancel();
          }}
          className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {category.totalCount > 0 ? "Move & Delete" : "Confirm Delete"}
        </button>
      </div>
    </div>
  );
}
