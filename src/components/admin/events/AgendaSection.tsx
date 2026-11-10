"use client";

import { Plus, Trash2, CalendarClock } from "lucide-react";
import type { AgendaItemInput } from "@/lib/event-form-types";

interface Props {
  items: AgendaItemInput[];
  onChange: (next: AgendaItemInput[]) => void;
}

export function AgendaSection({ items, onChange }: Props) {
  const addSlot = () => {
    onChange([...items, { time: "", title: "", description: "" }]);
  };

  const updateSlot = (idx: number, field: keyof AgendaItemInput, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const removeSlot = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="w-5 h-5 text-[var(--color-primary)]" />
          <div>
            <h2 className="font-semibold text-slate-900">Program Agenda &amp; Sessions</h2>
            <p className="text-xs text-slate-400">
              Chronological schedule shown on the public event detail view.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl theme-badge border cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Session
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
          No agenda slots added yet. Click <strong>Add Session</strong> to outline check-in, keynotes, or workshops.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((slot, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-start p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="col-span-12 sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 mb-1">Time Window *</label>
                <input
                  type="text"
                  required
                  value={slot.time}
                  onChange={(e) => updateSlot(i, "time", e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={slot.title}
                  onChange={(e) => updateSlot(i, "title", e.target.value)}
                  placeholder="Opening Keynote & Expo Ribbon Cutting"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-10 sm:col-span-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Summary / Room</label>
                <input
                  type="text"
                  value={slot.description}
                  onChange={(e) => updateSlot(i, "description", e.target.value)}
                  placeholder="Main Hall · Followed by Q&A"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => removeSlot(i)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Remove session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
