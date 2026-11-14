"use client";

import { X, Calendar, Ticket, Mic2, CalendarClock, FileText } from "lucide-react";
import type { EventFormTabKey } from "@/lib/event-form-types";

interface Props {
  mode: "create" | "edit";
  title: string;
  status: string;
  activeTab: EventFormTabKey;
  onSelectTab: (tab: EventFormTabKey) => void;
  onClose: () => void;
  tierCount: number;
  speakerCount: number;
  agendaCount: number;
}

export function EventModalHeader({
  mode,
  title,
  status,
  activeTab,
  onSelectTab,
  onClose,
  tierCount,
  speakerCount,
  agendaCount,
}: Props) {
  const tabs = [
    { key: "basics" as const, label: "Basics", icon: FileText },
    { key: "schedule" as const, label: "Date & Venue", icon: Calendar },
    { key: "tickets" as const, label: `Tickets (${tierCount})`, icon: Ticket },
    { key: "speakers" as const, label: `Speakers (${speakerCount})`, icon: Mic2 },
    { key: "agenda" as const, label: `Agenda (${agendaCount})`, icon: CalendarClock },
  ];

  return (
    <div className="shrink-0 bg-white border-b border-slate-100">
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {mode === "create" ? "Create New Event" : title || "Edit Event"}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            Fill details across tabs below · Fast modal workflow
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 theme-radius-sm transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex bg-slate-50/60 px-4 pt-1 gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              data-modal-tab={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                active
                  ? "border-[var(--color-primary)] text-[var(--color-primary-ink,var(--color-primary))] bg-white theme-radius-t-sm"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
