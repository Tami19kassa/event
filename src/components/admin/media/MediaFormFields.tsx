"use client";

import type { MediaKind, MediaStatus } from "@/lib/media-types";
import { MediaSourceInputs } from "./MediaSourceInputs";

export type MediaFormState = {
  title: string;
  slug: string;
  kind: MediaKind;
  categoryTag: string;
  coverImageUrl: string;
  videoUrl: string;
  externalUrl: string;
  externalLabel: string;
  duration: string;
  excerpt: string;
  content: string;
  eventId: string;
  isFeatured: boolean;
  status: MediaStatus;
};

type EventOption = { id: string; title: string };

type Props = {
  form: MediaFormState;
  events: EventOption[];
  onChange: <K extends keyof MediaFormState>(key: K, val: MediaFormState[K]) => void;
};

export function MediaFormFields({ form, events, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Headline / Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Addis Tech Expo Keynote Recap"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Category / Tag
          </label>
          <input
            type="text"
            value={form.categoryTag}
            onChange={(e) => onChange("categoryTag", e.target.value)}
            placeholder="Expo Recap, Vlog, Press Coverage..."
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <MediaSourceInputs form={form} onChange={onChange} />

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Short Excerpt / Summary
        </label>
        <textarea
          rows={2}
          maxLength={400}
          value={form.excerpt}
          onChange={(e) => onChange("excerpt", e.target.value)}
          placeholder="Concise summary shown on cards and previews..."
          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm resize-none"
        />
      </div>

      {form.kind !== "EXTERNAL_LINK" && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Full Story / Blog Body (Supports ## Headings, **Bold**, and - Bullet Lists)
          </label>
          <textarea
            rows={5}
            value={form.content}
            onChange={(e) => onChange("content", e.target.value)}
            placeholder="Write editorial commentary, speaker notes, or recap details..."
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Link to Event</label>
          <select
            value={form.eventId}
            onChange={(e) => onChange("eventId", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="">None (Standalone)</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Visibility</label>
          <select
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as MediaStatus)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="PUBLISHED">Published (Public)</option>
            <option value="DRAFT">Draft (Hidden)</option>
          </select>
        </div>

        <label className="flex items-center gap-2.5 pt-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => onChange("isFeatured", e.target.checked)}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
          <span className="text-xs font-bold text-slate-800">Feature on Homepage Spotlight</span>
        </label>
      </div>
    </div>
  );
}
