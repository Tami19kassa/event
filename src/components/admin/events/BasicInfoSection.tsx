"use client";

import { FileText, Link2, RotateCcw, ListPlus, UserCheck } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CategoryQuickSelect } from "./CategoryQuickSelect";
import { slugifyEventTitle, type EventFormData } from "@/lib/event-form-types";
import type { OrganizerSelectOption } from "@/lib/events-admin";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
  onSlugChange: (slug: string) => void;
  onResetSlugAuto: () => void;
  categories: Array<{ id: string; name: string }>;
  canCreateCategory: boolean;
  onCategoryAdded: (cat: { id: string; name: string }) => void;
  organizerOptions?: OrganizerSelectOption[];
}

const DESCRIPTION_OUTLINE =
  "Overview:\n• Key purpose and audience benefits.\n\nHighlights:\n• Featured showcases, networking lounges & exhibitor booths.\n\nWho Should Attend:\n• Founders, industry buyers, partners & general guests.";

export function BasicInfoSection({
  form,
  update,
  onSlugChange,
  onResetSlugAuto,
  categories,
  canCreateCategory,
  onCategoryAdded,
  organizerOptions = [],
}: Props) {
  const taglineLen = form.shortDescription.trim().length;

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="w-9 h-9 theme-radius-sm theme-icon-soft border flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Basic Information &amp; Visuals</h2>
          <p className="text-xs text-slate-400">Title, clean URL, event type, card tagline, and 16:10 hero banner.</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Event Title *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="e.g. Addis AI & Cloud Summit 2026"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Public URL Slug *
            </label>
            {form.title.trim() && (
              <button
                type="button"
                onClick={onResetSlugAuto}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-secondary-ink,var(--color-secondary))] hover:underline cursor-pointer"
                title="Regenerate URL slug from title"
              >
                <RotateCcw className="w-3 h-3" /> Sync
              </button>
            )}
          </div>
          <div className="flex items-center border border-slate-200 theme-radius-sm bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--color-primary)] overflow-hidden">
            <span className="pl-3 pr-1 text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0">
              <Link2 className="w-3.5 h-3.5" /> /events/
            </span>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => onSlugChange(e.target.value)}
              onBlur={() => {
                if (form.slug.trim()) onSlugChange(slugifyEventTitle(form.slug));
              }}
              placeholder="addis-ai-summit-2026"
              className="w-full pr-3 py-2.5 bg-transparent text-xs sm:text-sm font-mono text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <CategoryQuickSelect
          categoryId={form.categoryId}
          categories={categories}
          canCreateCategory={canCreateCategory}
          onSelect={(val) => update("categoryId", val)}
          onCategoryAdded={onCategoryAdded}
        />
      </div>

      {organizerOptions.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            Event Owner / Organizer
          </label>
          <select
            value={form.organizerId || ""}
            onChange={(e) => update("organizerId", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {organizerOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name ? `${opt.name} (${opt.email})` : opt.email} · {opt.role}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Short Card Tagline
          </label>
          <span
            className={`text-[11px] font-semibold ${
              taglineLen > 120 ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {taglineLen}/120 ideal
          </span>
        </div>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Concise hook displayed on discovery cards & shares"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Event Description
          </label>
          {!form.description.trim() && (
            <button
              type="button"
              onClick={() => update("description", DESCRIPTION_OUTLINE)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-secondary-ink,var(--color-secondary))] hover:underline cursor-pointer"
            >
              <ListPlus className="w-3.5 h-3.5" /> Insert structure guide
            </button>
          )}
        </div>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={5}
          placeholder="Describe event tracks, exhibitor showcase zones, audience profile, and pass benefits..."
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y leading-relaxed"
        />
      </div>

      <ImageUpload
        label="Event Cover Banner (Recommended 16:10 Landscape)"
        value={form.imageUrl}
        onChange={(url) => update("imageUrl", url)}
        placeholder="https://images.unsplash.com/..."
        previewVariant="banner"
      />
    </section>
  );
}
