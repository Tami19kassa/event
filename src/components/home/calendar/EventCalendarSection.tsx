"use client";

import { useState, useMemo } from "react";
import { Event } from "@/types/event";
import { EventCalendarCard } from "./EventCalendarCard";
import { EventCalendarQuickModal } from "./EventCalendarQuickModal";
import { Calendar as CalendarIcon, Search, Sparkles, Filter } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Props {
  events: Event[];
}

export function EventCalendarSection({ events }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [activeModalEvent, setActiveModalEvent] = useState<Event | null>(null);

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [events]);

  const months = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const set = new Set(
      events.map((e) => {
        const d = new Date(e.startDate);
        return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      })
    );
    return ["ALL", ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return events
      .filter((e) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = e.title.toLowerCase().includes(q);
          const matchLoc = (e.location?.name || "").toLowerCase().includes(q) || (e.location?.city || "").toLowerCase().includes(q);
          if (!matchTitle && !matchLoc) return false;
        }

        if (selectedCategory !== "ALL" && e.category !== selectedCategory) {
          return false;
        }

        if (selectedMonth !== "ALL") {
          const d = new Date(e.startDate);
          const mStr = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          if (mStr !== selectedMonth) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, search, selectedCategory, selectedMonth]);

  return (
    <section className="py-12 md:py-18 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" durationMs={500}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div
                style={{
                  backgroundColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.08)",
                  borderColor: "rgba(var(--color-primary-rgb, 79, 70, 229), 0.2)",
                  color: "var(--color-primary, #4F46E5)",
                }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider mb-2"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Live Event & Expo Calendar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Upcoming Trade Shows & Event Schedule
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
                Check dates, venues, live days-left countdowns, and reserve your delegate or visitor pass instantly.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs self-start md:self-auto">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{filteredEvents.length} events scheduled</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event name, venue (e.g. Millennium Hall)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: selectedCategory === cat ? "var(--color-primary, #4F46E5)" : undefined,
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? "text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Month Pills */}
          {months.length > 2 && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Month:
              </span>
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedMonth === m
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {m === "ALL" ? "All Dates" : m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Event Cards */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No events found matching your filter</h4>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or clearing filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("ALL");
                setSelectedMonth("ALL");
              }}
              style={{ color: "var(--color-primary, #4F46E5)" }}
              className="text-xs font-bold hover:underline pt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredEvents.map((evt) => (
              <EventCalendarCard
                key={evt.id}
                event={evt}
                onSelect={(selected) => setActiveModalEvent(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Take Place Modal */}
      <EventCalendarQuickModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />
    </section>
  );
}
