"use client";

import { ImageUpload } from "@/components/ui/ImageUpload";
import { EventFormData } from "../EventForm";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
  categories: Array<{ id: string; name: string }>;
}

export function BasicInfoSection({ form, update, categories }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-slate-900">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Event Title *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="e.g. Addis AI & Cloud Summit 2026"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            URL Slug *
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Category / Event Type
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Short Tagline
        </label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Brief summary for event cards"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Full Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
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
