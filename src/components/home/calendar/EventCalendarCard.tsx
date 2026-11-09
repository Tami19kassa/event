"use client";

import { Event } from "@/types/event";
import { calculateDaysLeft, formatEventDateBlock } from "@/lib/date-utils";
import { MapPin, Clock, ArrowRight, Users } from "lucide-react";

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

  return (
    <div
      onClick={() => onSelect(event)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
    >
      {/* Accent left highlight on hover */}
      <div
        style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
        className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Left Date Block + Info */}
      <div className="flex items-start gap-4 w-full sm:w-auto">
        {/* Modern Date Calendar Box */}
        <div
          style={{
            backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
            borderColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.2)",
          }}
          className="shrink-0 flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border text-center shadow-2xs group-hover:brightness-95 transition-all duration-200"
        >
          <span
            style={{ color: "var(--color-primary, #4F46E5)" }}
            className="text-[10px] font-black tracking-wider uppercase"
          >
            {dateInfo.month}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {dateInfo.day}
          </span>
          <span className="text-[9px] font-semibold text-slate-500">
            {dateInfo.weekday}
          </span>
        </div>

        {/* Event Details */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${countdown.colorClass}`}>
              {countdown.label}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {event.category}
            </span>
            {event.format === "hybrid" && (
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Hybrid
              </span>
            )}
          </div>

          <h3
            style={{ color: undefined }}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin
                style={{ color: "var(--color-primary, #4F46E5)" }}
                className="w-3.5 h-3.5 shrink-0"
              />
              <span className="truncate max-w-[200px] sm:max-w-[260px]">
                {event.location.name || event.location.city}
              </span>
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{dateInfo.time}</span>
            </span>

            {event.attendeesCount > 0 && (
              <span className="hidden md:flex items-center gap-1 text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span>{event.attendeesCount} taking place</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Pricing & Quick Take Place CTA */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Entry Pass</span>
          <span className="text-sm font-extrabold text-slate-900">
            {minPrice === 0 ? "Free Access" : `ETB ${minPrice.toLocaleString()}`}
          </span>
        </div>

        <button
          type="button"
          style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
          className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 active:scale-95"
        >
          <span>Take Place</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
