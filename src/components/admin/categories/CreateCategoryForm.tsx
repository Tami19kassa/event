"use client";

import { useState } from "react";
import { Plus, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import {
  CategoryIcon,
  CATEGORY_ICON_OPTIONS,
  type CategoryIconKey,
} from "@/components/ui/CategoryIcon";
import { slugifyCategoryName } from "@/lib/categories-admin";

interface FormProps {
  onCreated: (createdName: string) => void;
  onError: (msg: string) => void;
}

export function CreateCategoryForm({ onCreated, onError }: FormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [icon, setIcon] = useState<CategoryIconKey>("building-2");
  const [submitting, setSubmitting] = useState(false);

  const selectedLabel =
    CATEGORY_ICON_OPTIONS.find((opt) => opt.key === icon)?.label || "General";

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugifyCategoryName(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const cleanSlug = slugifyCategoryName(slug || trimmedName);
    if (!trimmedName || !cleanSlug) {
      onError("Please enter a valid event type name and slug.");
      return;
    }

    setSubmitting(true);
    onError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, slug: cleanSlug, icon }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event type");

      setName("");
      setSlug("");
      setSlugEdited(false);
      onCreated(trimmedName);
    } catch (err: any) {
      onError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5 lg:sticky lg:top-20">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="w-9 h-9 theme-radius-sm theme-icon-soft border flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Add Event Type</h2>
          <p className="text-xs text-slate-400">Appears in Browse by Category &amp; filters.</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50/90 border border-slate-200/80 theme-radius flex flex-col items-center justify-center text-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[var(--color-accent-ink,var(--color-accent))]" />
          Public Tile Preview
        </span>
        <div className="w-12 h-12 theme-radius theme-icon-soft border flex items-center justify-center shadow-2xs">
          <CategoryIcon name={icon} className="w-6 h-6" />
        </div>
        <span className="font-bold text-slate-900 text-sm truncate max-w-full">
          {name.trim() || "Agro & Food Expo"}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          /discover?category={slug || "agro-food-expo"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Type Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Agro & Food Expo"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              URL Slug
            </label>
            {slugEdited && name.trim() && (
              <button
                type="button"
                onClick={() => {
                  setSlugEdited(false);
                  setSlug(slugifyCategoryName(name));
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-secondary-ink,var(--color-secondary))] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Sync
              </button>
            )}
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugEdited(e.target.value.trim().length > 0);
              setSlug(e.target.value);
            }}
            onBlur={() => {
              if (slug.trim()) setSlug(slugifyCategoryName(slug));
            }}
            placeholder="agro-food-expo"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 theme-radius-sm text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sector Vector Icon
            </label>
            <span className="text-[11px] font-semibold text-slate-500">{selectedLabel}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {CATEGORY_ICON_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.key}
                title={opt.label}
                aria-label={opt.label}
                onClick={() => setIcon(opt.key)}
                className={`h-9 theme-radius-sm flex items-center justify-center border transition cursor-pointer ${
                  icon === opt.key
                    ? "theme-badge shadow-2xs"
                    : "bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <CategoryIcon name={opt.key} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="w-full py-2.5 text-sm font-bold theme-btn-primary shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Event Type
        </button>
      </form>
    </div>
  );
}
