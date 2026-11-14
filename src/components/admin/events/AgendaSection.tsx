"use client";

import { useState } from "react";
import { Plus, CalendarClock, Sparkles } from "lucide-react";
import { makeClientKey, type AgendaItemInput } from "@/lib/event-form-types";
import { AgendaSummaryRow } from "./AgendaSummaryRow";
import { AdminAgendaSessionModal } from "./AdminAgendaSessionModal";

interface Props {
  items: AgendaItemInput[];
  onChange: (next: AgendaItemInput[]) => void;
}

export function AgendaSection({ items, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSaveSession = (savedSession: AgendaItemInput) => {
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < items.length) {
      const next = [...items];
      next[editingIndex] = savedSession;
      onChange(next);
    } else {
      onChange([...items, savedSession]);
    }
  };

  const addStarterSchedule = () => {
    onChange([
      { clientKey: makeClientKey("ag"), time: "08:30 AM", title: "Badge Pickup & Coffee", description: "Main lobby registration desk" },
      { clientKey: makeClientKey("ag"), time: "09:30 AM", title: "Opening Keynote", description: "Main Auditorium" },
      { clientKey: makeClientKey("ag"), time: "12:30 PM", title: "Networking Lunch & Expo Booths", description: "Exhibition Hall" },
    ]);
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
              {items.length} session{items.length === 1 ? "" : "s"} scheduled · Chronological order.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <button
              type="button"
              onClick={addStarterSchedule}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Starter Outline
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenCreate}
            data-add-agenda-modal-trigger
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-btn-primary cursor-pointer hover:brightness-105 transition shadow-2xs"
          >
            <Plus className="w-4 h-4" /> Add Session
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 theme-radius text-xs text-slate-500 space-y-3">
          <p>
            No agenda slots added yet. Add keynote sessions, panels, and networking breaks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={addStarterSchedule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Starter Agenda
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 theme-radius-sm theme-btn-primary text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add First Session
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((slot, i) => (
            <AgendaSummaryRow
              key={slot.id || slot.clientKey || i}
              slot={slot}
              index={i}
              totalCount={items.length}
              onEdit={handleOpenEdit}
              onMove={moveSlot}
              onRemove={removeSlot}
            />
          ))}
        </div>
      )}

      <AdminAgendaSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        session={editingIndex !== null ? items[editingIndex] : null}
        onSave={handleSaveSession}
      />
    </section>
  );
}
