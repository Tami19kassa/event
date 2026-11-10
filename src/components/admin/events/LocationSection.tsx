"use client";

import { EventFormData } from "../EventForm";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
}

export function LocationSection({ form, update }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-slate-900">Venue & Location</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Venue / Hall Name
          </label>
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => update("locationName", e.target.value)}
            placeholder="e.g. Millennium Hall"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
          <input
            type="text"
            value={form.locationCity}
            onChange={(e) => update("locationCity", e.target.value)}
            placeholder="Addis Ababa"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <input
            type="text"
            value={form.locationAddress}
            onChange={(e) => update("locationAddress", e.target.value)}
            placeholder="e.g. Bole Sub-City, Africa Avenue"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
          <input
            type="text"
            value={form.locationCountry}
            onChange={(e) => update("locationCountry", e.target.value)}
            placeholder="Ethiopia"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>
    </section>
  );
}
