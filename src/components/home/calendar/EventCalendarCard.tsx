"use client";

import { Event } from "@/types/event";
import { calculateDaysLeft, formatEventDateBlock } from "@/lib/date-utils";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface Props {
  event: Event;
  onSelect: (event: Event) => void;
}

export function EventCalendarCard({ event, onSelect }: Props) {
  const dateInfo = formatEventDateBlock(event.startDate);
  const countdown = calculateDaysLeft(event.startDate);

  const minPrice =
    event.ticketTiers && event.ticketTiers.length > 0
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(event)}
      onKeyDown={handleKeyDown}
      className="group w-[270px] sm:w-[300px] h-[345px] bg-white rounded-3xl border border-slate-200/90 hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden select-none"
    >
      <div className="relative h-28 bg-slate-900 shrink-0 overflow-hidden">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-center shadow-md min-w-[46px]">
          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--color-primary)] block leading-none">
            {dateInfo.month}
          </span>
          <span className="text-base font-black text-slate-900 leading-tight block">
            {dateInfo.day}
          </span>
        </div>

        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${countdown.colorClass}`}
        >
          {countdown.label}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between min-h-0">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {event.category}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {dateInfo.weekday}, {dateInfo.year}
            </span>
          </div>

          <h3 className="text-base font-black text-slate-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>
        </div>

        <div className="space-y-1 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]" />
            <span className="truncate font-medium">
              {event.location.name || event.location.city}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{dateInfo.time}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Entry</span>
          <span className="text-xs font-black text-slate-900">
            {minPrice === 0 ? "Free Pass" : `ETB ${minPrice.toLocaleString()}`}
          </span>
        </div>

        <span className="px-3.5 py-2 theme-btn-primary text-xs font-bold shadow-xs flex items-center gap-1">
          <span>Take Place</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
