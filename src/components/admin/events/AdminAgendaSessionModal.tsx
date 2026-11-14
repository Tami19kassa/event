"use client";

import { useState, useEffect } from "react";
import { CalendarClock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { makeClientKey, type AgendaItemInput } from "@/lib/event-form-types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session?: AgendaItemInput | null;
  onSave: (session: AgendaItemInput) => void;
}

const QUICK_TIMES = ["08:30 AM", "09:30 AM", "11:00 AM", "12:30 PM", "02:00 PM", "04:30 PM"];

export function AdminAgendaSessionModal({ isOpen, onClose, session, onSave }: Props) {
  const isEditing = Boolean(session);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (session) {
        setTime(session.time || "");
        setTitle(session.title || "");
        setDescription(session.description || "");
      } else {
        setTime("09:00 AM");
        setTitle("");
        setDescription("");
      }
      setError("");
    }
  }, [isOpen, session]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim()) {
      setError("Please specify a time window (e.g. 09:30 AM).");
      return;
    }
    if (!title.trim()) {
      setError("Please specify a session title.");
      return;
    }

    onSave({
      ...(session || {}),
      clientKey: session?.clientKey || makeClientKey("ag"),
      time: time.trim(),
      title: title.trim(),
      description: description.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Session" : "Add Session"}
      subtitle="Schedule timeline, keynotes, breakouts & networking slots"
      icon={<CalendarClock className="w-4 h-4" />}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 theme-radius-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-bold theme-btn-primary theme-radius-sm shadow-xs transition cursor-pointer"
          >
            {isEditing ? "Save Session" : "Add Session"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Time Window *</label>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {QUICK_TIMES.map((qt) => (
                <button
                  key={qt}
                  type="button"
                  onClick={() => setTime(qt)}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  {qt}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            required
            value={time}
            onChange={(e) => { setTime(e.target.value); if (error) setError(""); }}
            placeholder="e.g. 09:00 AM or 09:00 AM - 10:30 AM"
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm font-mono focus:border-slate-400 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Session Title *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
            placeholder="e.g. Opening Keynote & Ribbon Cutting"
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Room / Notes / Track
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Main Auditorium · Followed by audience Q&A session"
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
