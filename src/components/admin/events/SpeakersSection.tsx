"use client";

import { useState } from "react";
import { Plus, Mic2 } from "lucide-react";
import type { SpeakerInput } from "@/lib/event-form-types";
import { SpeakerSummaryCard } from "./SpeakerSummaryCard";
import { AdminSpeakerModal } from "./AdminSpeakerModal";

interface Props {
  speakers: SpeakerInput[];
  onChange: (next: SpeakerInput[]) => void;
}

export function SpeakersSection({ speakers, onChange }: Props) {
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

  const handleSaveSpeaker = (savedSpeaker: SpeakerInput) => {
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < speakers.length) {
      const next = [...speakers];
      next[editingIndex] = savedSpeaker;
      onChange(next);
    } else {
      onChange([...speakers, savedSpeaker]);
    }
  };

  const moveSpeaker = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= speakers.length) return;
    const next = [...speakers];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const removeSpeaker = (idx: number) => {
    onChange(speakers.filter((_, i) => i !== idx));
  };

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Featured Speakers &amp; Panelists</h2>
            <p className="text-xs text-slate-400">
              {speakers.length} featured presenter{speakers.length === 1 ? "" : "s"} · Displayed on public event page.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          data-add-speaker-modal-trigger
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-btn-primary cursor-pointer hover:brightness-105 transition shadow-2xs"
        >
          <Plus className="w-4 h-4" /> Add Speaker
        </button>
      </div>

      {speakers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 theme-radius text-xs text-slate-500 space-y-3">
          <p>
            No speakers attached yet. Add keynote presenters, panelists, or workshop facilitators.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 theme-radius-sm theme-btn-primary text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Speaker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {speakers.map((sp, i) => (
            <SpeakerSummaryCard
              key={sp.id || sp.clientKey || i}
              speaker={sp}
              index={i}
              totalCount={speakers.length}
              onEdit={handleOpenEdit}
              onMove={moveSpeaker}
              onRemove={removeSpeaker}
            />
          ))}
        </div>
      )}

      <AdminSpeakerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        speaker={editingIndex !== null ? speakers[editingIndex] : null}
        onSave={handleSaveSpeaker}
      />
    </section>
  );
}
