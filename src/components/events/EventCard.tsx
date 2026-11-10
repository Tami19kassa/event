"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Event } from "@/types/event";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_events") || "[]");
      setIsSaved(saved.includes(event.id));
    } catch {}
  }, [event.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("saved_events") || "[]");
      const nextSaved = isSaved
        ? saved.filter((id: string) => id !== event.id)
        : [...saved, event.id];
      localStorage.setItem("saved_events", JSON.stringify(nextSaved));
      setIsSaved(!isSaved);
    } catch {}
  };

  const prices = event.ticketTiers?.map((t) => t.price) || [];
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const isAlmostSoldOut = event.ticketTiers?.some(
    (t) => t.quantity > 0 && t.remaining / t.quantity < 0.15
  );

  const eventDate = event.startDate ? new Date(event.startDate) : new Date();

  return (
    <Link
      href={`/events/${event.slug}`}
      prefetch={true}
      className="group block bg-white theme-radius overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full active:scale-[0.98]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {event.format !== "in-person" && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-white/95 backdrop-blur-md rounded-full text-slate-800 shadow-sm capitalize">
              {event.format}
            </span>
          )}
          {isAlmostSoldOut && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full shadow-sm">
              Selling fast
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={isSaved ? "Remove from bookmarks" : "Save to bookmarks"}
          onClick={toggleSave}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
            isSaved
              ? "bg-rose-50 text-rose-600 scale-110"
              : "bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isSaved ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <span className="text-[var(--color-primary)] font-semibold uppercase tracking-wider text-[11px]">
              {event.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              {format(eventDate, "MMM d, yyyy")}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors mb-2 text-base leading-snug">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">
              {event.location.city || event.location.name}
              {event.format === "online" ? " · Online Stream" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{event.attendeesCount?.toLocaleString() || 0} attending</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {prices.length === 0 || lowestPrice === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              <>
                <span className="text-xs text-slate-400 font-normal">from </span>
                <span className="text-[var(--color-primary)] font-extrabold">
                  ETB {lowestPrice.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
