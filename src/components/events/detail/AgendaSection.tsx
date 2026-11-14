"use client";

import { useState } from "react";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { Speaker } from "@/types/event";
import { AgendaModal, type AgendaSession } from "./AgendaModal";

interface Props {
  agenda: AgendaSession[];
  eventTitle: string;
  speakers?: Speaker[];
  onSelectSpeaker?: (speaker: Speaker) => void;
}

export function AgendaSection({
  agenda,
  eventTitle,
  speakers = [],
  onSelectSpeaker,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!agenda || agenda.length === 0) return null;

  const previewItems = agenda.slice(0, 3);
  const hasMore = agenda.length > 3;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-display text-slate-900">Agenda Schedule</h2>
          <p className="text-xs text-slate-400">Timetable &amp; session tracks</p>
        </div>
        <button
          type="button"
          data-agenda-modal-trigger="true"
          onClick={() => setModalOpen(true)}
          className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{hasMore ? `All ${agenda.length} sessions` : "Expand schedule"}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {previewItems.map((item, i) => (
          <div
            key={i}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setModalOpen(true);
            }}
            className="group flex gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 theme-radius-card transition cursor-pointer text-left"
          >
            <div className="text-xs font-bold theme-text-secondary w-20 shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{item.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary-ink,var(--color-primary))] transition line-clamp-1">
                {item.title}
              </div>
              {item.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full mt-3 py-2.5 px-4 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 theme-radius-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>View Full Schedule ({agenda.length - 3} more sessions)</span>
        </button>
      )}

      <AgendaModal
        isOpen={modalOpen}
        eventTitle={eventTitle}
        agenda={agenda}
        speakers={speakers}
        onClose={() => setModalOpen(false)}
        onSelectSpeaker={onSelectSpeaker}
      />
    </section>
  );
}
