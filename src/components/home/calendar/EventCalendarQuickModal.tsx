"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { X, MapPin, Calendar, Users, ExternalLink, Ticket, Info } from "lucide-react";
import { calculateDaysLeft, formatEventDateBlock } from "@/lib/date-utils";
import { EventCalendarBookingForm } from "./EventCalendarBookingForm";
import Link from "next/link";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export function EventCalendarQuickModal({ event, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"book" | "details">("book");

  // Prevent background scroll bleed while modal is open
  useEffect(() => {
    if (!event) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [event]);

  if (!event) return null;

  const dateInfo = formatEventDateBlock(event.startDate);
  const countdown = calculateDaysLeft(event.startDate);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overscroll-none"
    >
      <div className="bg-white theme-radius-modal max-w-lg w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="relative shrink-0 border-b border-slate-100 pb-3 px-5 pt-3 sm:px-6 sm:pt-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-10">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${countdown.colorClass}`}>
              {countdown.label}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {event.category}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-display text-slate-900 leading-snug pr-8 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 font-medium">
              <Calendar style={{ color: "var(--color-primary, #4F46E5)" }} className="w-3.5 h-3.5" />
              <span>{dateInfo.month} {dateInfo.day}, {dateInfo.year} ({dateInfo.time})</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <MapPin style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }} className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{event.location.name || event.location.city}</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 border-b border-slate-100">
            <button
              onClick={() => setActiveTab("book")}
              style={{
                borderColor: activeTab === "book" ? "var(--color-primary, #4F46E5)" : "transparent",
                color: activeTab === "book" ? "var(--color-primary, #4F46E5)" : undefined,
              }}
              className={`pb-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === "book" ? "" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Take Place (Instant Pass)</span>
            </button>
            <button
              onClick={() => setActiveTab("details")}
              style={{
                borderColor: activeTab === "details" ? "var(--color-primary, #4F46E5)" : "transparent",
                color: activeTab === "details" ? "var(--color-primary, #4F46E5)" : undefined,
              }}
              className={`pb-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === "details" ? "" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Event Details</span>
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {activeTab === "book" ? (
            <EventCalendarBookingForm event={event} onSuccessClose={onClose} />
          ) : (
            <div className="p-5 sm:p-6 space-y-4">
              {/* Event Cover Photo if available */}
              {event.imageUrl && (
                <div className="theme-radius-sm overflow-hidden h-40 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About This Event</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description || event.shortDescription}
                </p>
              </div>

              <div className="bg-slate-50 p-4 theme-radius-sm border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Organizer</span>
                  <span className="font-bold text-slate-900">{event.organizer.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Venue Address</span>
                  <span className="font-bold text-slate-900">{event.location.address || event.location.city}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Total Capacity</span>
                  <span className="font-bold text-slate-900">{event.capacity} Attendees</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/events/${event.slug}`}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs theme-radius flex items-center justify-center gap-1.5 transition"
                >
                  <span>View Full Event Page & Speakers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
