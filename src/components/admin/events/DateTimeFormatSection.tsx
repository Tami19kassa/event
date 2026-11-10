"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { addHoursLocalValue, type EventFormData } from "@/lib/event-form-types";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
  tierCapacityTotal: number;
  autoSyncCapacity: boolean;
  onToggleAutoSync: (val: boolean) => void;
}

const FORMAT_OPTIONS: { value: EventFormData["format"]; label: string }[] = [
  { value: "IN_PERSON", label: "In-Person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
];

const DURATION_PRESETS = [
  { label: "+2h", hours: 2 },
  { label: "+4h", hours: 4 },
  { label: "+8h Day", hours: 8 },
  { label: "2-Day", hours: 32 },
  { label: "3-Day", hours: 56 },
];

export function DateTimeFormatSection({
  form,
  update,
  tierCapacityTotal,
  autoSyncCapacity,
  onToggleAutoSync,
}: Props) {
  const handleStartChange = (nextStart: string) => {
    update("startDate", nextStart);
    if (nextStart && (!form.endDate || new Date(form.endDate) <= new Date(nextStart))) {
      update("endDate", addHoursLocalValue(nextStart, 3));
    }
  };

  const applyDuration = (hours: number) => {
    if (!form.startDate) return;
    update("endDate", addHoursLocalValue(form.startDate, hours));
  };

  const invalidRange =
    Boolean(form.startDate && form.endDate) && new Date(form.endDate) <= new Date(form.startDate);

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Schedule, Format &amp; Capacity</h2>
            <p className="text-xs text-slate-400">Addis Ababa Time (EAT · UTC+3), delivery format, and attendance cap.</p>
          </div>
        </div>

        {form.startDate && (
          <div className="flex flex-wrap items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {DURATION_PRESETS.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => applyDuration(d.hours)}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                title={`Set end date ${d.hours} hours after start`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Venue Max Capacity
            </label>
            <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncCapacity}
                onChange={(e) => onToggleAutoSync(e.target.checked)}
                className="w-3.5 h-3.5 accent-[var(--color-secondary)] cursor-pointer"
              />
              Auto-sync tiers ({tierCapacityTotal})
            </label>
          </div>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => {
                onToggleAutoSync(false);
                update("capacity", Math.max(1, Number(e.target.value) || 1));
              }}
              className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {!autoSyncCapacity && tierCapacityTotal > form.capacity && (
            <p className="text-[11px] font-semibold text-amber-600 mt-1">
              Note: Ticket tiers total ({tierCapacityTotal}) exceeds venue cap ({form.capacity}).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
