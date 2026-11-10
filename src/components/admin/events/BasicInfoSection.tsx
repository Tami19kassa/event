"use client";

import { FileText, Link2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { EventFormData } from "@/lib/event-form-types";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
  onSlugChange: (slug: string) => void;
  categories: Array<{ id: string; name: string }>;
}

export function BasicInfoSection({ form, update, onSlugChange, categories }: Props) {
  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="w-9 h-9 theme-radius-sm theme-icon-soft border flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Basic Information &amp; Visual</h2>
          <p className="text-xs text-slate-400">Title, category, public URL slug, and hero cover artwork.</p>
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
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="e.g. Addis AI & Cloud Summit 2026"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Public URL Slug *
          </label>
          <div className="flex items-center border border-slate-200 theme-radius-sm bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--color-primary)] overflow-hidden">
            <span className="pl-3 pr-1.5 text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0">
              <Link2 className="w-3.5 h-3.5" /> /events/
            </span>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="addis-ai-summit-2026"
              className="w-full pr-3 py-2.5 bg-transparent text-xs sm:text-sm font-mono text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category / Event Type
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Short Tagline
        </label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Concise summary shown on event discovery cards"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Full Event Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          placeholder="Describe tracks, exhibitor booths, audience profile, and ticket benefits..."
          className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
        />
      </div>

      <ImageUpload
        label="Event Cover Image (Local Upload or Web URL)"
        value={form.imageUrl}
        onChange={(url) => update("imageUrl", url)}
        placeholder="https://images.unsplash.com/..."
      />
    </section>
  );
}
