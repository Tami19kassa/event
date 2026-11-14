"use client";

import { X, Clock, CalendarDays, User } from "lucide-react";
import type { Speaker } from "@/types/event";

export type AgendaSession = {
  time: string;
  title: string;
  description?: string;
  speakerId?: string;
};

interface Props {
  isOpen: boolean;
  eventTitle: string;
  agenda: AgendaSession[];
  speakers?: Speaker[];
  onClose: () => void;
  onSelectSpeaker?: (speaker: Speaker) => void;
}

export function AgendaModal({
  isOpen,
  eventTitle,
  agenda,
  speakers = [],
  onClose,
  onSelectSpeaker,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white theme-radius-modal max-w-2xl w-full max-h-[90dvh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" /> Full Event Schedule
            </span>
            <h3 className="text-xl sm:text-2xl font-display text-slate-900 leading-tight">
              Agenda &amp; Timeline
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">{eventTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close agenda"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {agenda.map((item, i) => {
            const speaker = item.speakerId ? speakers.find((s) => s.id === item.speakerId) : null;

            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-slate-50/80 border border-slate-200/80 theme-radius-card"
              >
                <div className="flex items-center sm:items-start gap-1.5 text-xs font-bold theme-text-secondary sm:w-28 shrink-0 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.time}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}

                  {speaker && (
                    <button
                      type="button"
                      onClick={() => onSelectSpeaker?.(speaker)}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 theme-badge-secondary border rounded-full text-[11px] font-semibold hover:opacity-80 transition cursor-pointer"
                    >
                      <User className="w-3 h-3" />
                      <span>Speaker: {speaker.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-400 shrink-0">
          <span>{agenda.length} sessions listed · East Africa Time (UTC+3)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 theme-radius-sm transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
