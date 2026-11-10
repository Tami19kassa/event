"use client";

import { Plus, Trash2, CalendarClock, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { makeClientKey, type AgendaItemInput } from "@/lib/event-form-types";

interface Props {
  items: AgendaItemInput[];
  onChange: (next: AgendaItemInput[]) => void;
}

export function AgendaSection({ items, onChange }: Props) {
  const addSlot = () => {
    onChange([...items, { clientKey: makeClientKey("ag"), time: "", title: "", description: "" }]);
  };

  const addStarterSchedule = () => {
    onChange([
      { clientKey: makeClientKey("ag"), time: "08:30 AM", title: "Badge Pickup & Coffee", description: "Main lobby registration desk" },
      { clientKey: makeClientKey("ag"), time: "09:30 AM", title: "Opening Keynote", description: "Main Auditorium" },
      { clientKey: makeClientKey("ag"), time: "12:30 PM", title: "Networking Lunch & Expo Booths", description: "Exhibition Hall" },
    ]);
  };

  const updateSlot = (idx: number, field: keyof AgendaItemInput, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const moveSlot = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const removeSlot = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Program Agenda &amp; Sessions</h2>
            <p className="text-xs text-slate-400">
              Chronological schedule shown on the public event detail view.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-badge-secondary border cursor-pointer hover:brightness-95 transition"
        >
          <Plus className="w-4 h-4" /> Add Session
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 theme-radius text-xs text-slate-500 space-y-3">
          <p>
            No agenda slots added yet. Add individual sessions or start with a 3-slot conference outline.
          </p>
          <button
            type="button"
            onClick={addStarterSchedule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-ink,var(--color-accent))]" />
            Load Starter Agenda
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((slot, i) => {
            const incomplete = !slot.time.trim() || !slot.title.trim();
            return (
              <div
                key={slot.id || slot.clientKey || i}
                className={`p-4 bg-slate-50/90 border theme-radius space-y-3 ${
                  incomplete ? "border-rose-300" : "border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Session #{i + 1}
                    </span>
                    {incomplete && (
                      <span className="text-[11px] font-semibold text-rose-600">
                        Time &amp; Title required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveSlot(i, -1)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === items.length - 1}
                      onClick={() => moveSlot(i, 1)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer ml-1"
                      title="Remove session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Time Window *</label>
                    <input
                      type="text"
                      required
                      value={slot.time}
                      onChange={(e) => updateSlot(i, "time", e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm font-mono"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-5">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Session Title *</label>
                    <input
                      type="text"
                      required
                      value={slot.title}
                      onChange={(e) => updateSlot(i, "title", e.target.value)}
                      placeholder="Opening Keynote & Ribbon Cutting"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Room / Summary</label>
                    <input
                      type="text"
                      value={slot.description}
                      onChange={(e) => updateSlot(i, "description", e.target.value)}
                      placeholder="Main Hall · Followed by Q&A"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
