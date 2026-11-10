"use client";

import { Calendar, Star } from "lucide-react";
import { addHoursLocalValue, type EventFormData } from "@/lib/event-form-types";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
  tierCapacityTotal: number;
}

const FORMAT_OPTIONS: { value: EventFormData["format"]; label: string }[] = [
  { value: "IN_PERSON", label: "In-Person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
];

export function DateTimeFormatSection({ form, update, tierCapacityTotal }: Props) {
  const handleStartChange = (nextStart: string) => {
    update("startDate", nextStart);
    if (nextStart && (!form.endDate || new Date(form.endDate) <= new Date(nextStart))) {
      update("endDate", addHoursLocalValue(nextStart, 3));
    }
  };

  const invalidRange =
    Boolean(form.startDate && form.endDate) && new Date(form.endDate) <= new Date(form.startDate);

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Schedule, Format &amp; Visibility</h2>
          <p className="text-xs text-slate-400">Dates (EAT), delivery format, venue cap, and homepage pinning.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Start Date &amp; Time *
          </label>
          <input
            type="datetime-local"
            required
            value={form.startDate}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            End Date &amp; Time *
          </label>
          <input
            type="datetime-local"
            required
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className={`w-full px-3.5 py-2.5 border theme-radius-sm text-sm focus:outline-none focus:ring-2 ${
              invalidRange
                ? "border-rose-400 focus:ring-rose-500"
                : "border-slate-200 focus:ring-[var(--color-primary)]"
            }`}
          />
          {invalidRange && (
            <p className="text-[11px] font-semibold text-rose-600 mt-1">
              End time must be after start time.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Attendance Format
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 theme-radius-sm">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("format", opt.value)}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  form.format === opt.value
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Publishing Status
          </label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="PUBLISHED">Published (Public)</option>
            <option value="LIVE">Live Now</option>
            <option value="ENDED">Ended</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Venue Max Capacity
            </label>
            {tierCapacityTotal > 0 && form.capacity !== tierCapacityTotal && (
              <button
                type="button"
                onClick={() => update("capacity", tierCapacityTotal)}
                className="text-[11px] font-bold text-[var(--color-secondary-ink,var(--color-secondary))] hover:underline cursor-pointer"
              >
                Match tiers ({tierCapacityTotal})
              </button>
            )}
          </div>
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => update("capacity", Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <label className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 theme-radius-sm cursor-pointer">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
              form.isFeatured ? "theme-icon-accent" : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            <Star className={`w-4 h-4 ${form.isFeatured ? "fill-current" : ""}`} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Feature in Homepage Highlights
            </span>
            <span className="text-[11px] text-slate-500">
              Promotes this event to the flagship Featured Highlights strip on the homepage.
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => update("isFeatured", e.target.checked)}
          className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer shrink-0"
        />
      </label>
    </section>
  );
}
