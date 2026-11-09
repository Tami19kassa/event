"use client";

import { EventFormData } from "../EventForm";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
}

export function DateTimeFormatSection({ form, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-slate-900">Date, Format & Status</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            required
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            required
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Format</label>
          <select
            value={form.format}
            onChange={(e) => update("format", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="IN_PERSON">In-person</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="LIVE">Live</option>
            <option value="ENDED">Ended</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => update("capacity", Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => update("isFeatured", e.target.checked)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Featured event (featured prominently on homepage)
      </label>
    </section>
  );
}
