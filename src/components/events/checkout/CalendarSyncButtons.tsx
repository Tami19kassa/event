"use client";

import { Calendar, Download } from "lucide-react";
import { getGoogleCalendarUrl, downloadIcsFile, CalendarEventData } from "@/lib/calendar";

interface CalendarSyncButtonsProps {
  eventData: CalendarEventData;
  orderNumber: string;
}

export function CalendarSyncButtons({ eventData, orderNumber }: CalendarSyncButtonsProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 theme-radius-card p-4 mb-5 text-left">
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        Add to your calendar
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          href={getGoogleCalendarUrl(eventData)}
          target="_blank"
          rel="noreferrer"
          className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 theme-radius-sm text-xs font-bold text-slate-800 transition flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          Google Calendar
        </a>
        <button
          type="button"
          onClick={() => downloadIcsFile(eventData, `${orderNumber}-pass.ics`)}
          className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 theme-radius-sm text-xs font-bold text-slate-800 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          Apple / Outlook (.ics)
        </button>
      </div>
    </div>
  );
}
