"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Share2, CalendarPlus, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { ShareEventModal } from "./ShareEventModal";
import { getGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";

export function EventHeroBanner({ event }: { event: Event }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const calendarData = {
    title: event.title,
    description: event.shortDescription || event.description,
    location: `${event.location.name}, ${event.location.city}`,
    startDate: event.startDate,
    endDate: event.endDate,
  };

  const scrollToTickets = () => {
    const el = document.getElementById("tickets-pricing-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="relative h-[42vh] md:h-[52vh] min-h-[340px]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur text-white rounded-full">
                  {event.category}
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur text-white rounded-full capitalize">
                  {event.format}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-3 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }} />
                  {format(startDate, "EEE, MMM d, yyyy")}
                  {startDate.toDateString() !== endDate.toDateString() &&
                    ` – ${format(endDate, "MMM d")}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: "var(--color-accent-on-dark, var(--color-accent))" }} />
                  {format(startDate, "h:mm a")}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" style={{ color: "var(--color-secondary-on-dark, var(--color-secondary))" }} />
                  {event.location.name}, {event.location.city}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2.5 shrink-0 relative">
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCalendarMenuOpen((v) => !v)}
                  className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Calendar</span>
                </button>

                {calendarMenuOpen && (
                  <div
                    className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 text-xs animate-in fade-in"
                    onMouseLeave={() => setCalendarMenuOpen(false)}
                  >
                    <a
                      href={getGoogleCalendarUrl(calendarData)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setCalendarMenuOpen(false)}
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      Google Calendar
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        downloadIcsFile(calendarData, `${event.slug}.ics`);
                        setCalendarMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
                    >
                      Apple / Outlook (.ics)
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={scrollToTickets}
                className="px-4 py-2.5 font-bold theme-btn-primary shadow-lg flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Get Tickets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareEventModal
        isOpen={shareOpen}
        eventTitle={event.title}
        eventSlug={event.slug}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
