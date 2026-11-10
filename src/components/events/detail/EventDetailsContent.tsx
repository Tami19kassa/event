import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Event } from "@/types/event";

export function EventDetailsContent({ event }: { event: Event }) {
  return (
    <div className="space-y-10">
      {/* About */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">About this event</h2>
        <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-600 leading-relaxed text-sm md:text-base">
          {event.description}
        </div>
      </section>

      {/* Agenda */}
      {event.agenda && event.agenda.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Agenda Schedule</h2>
          <div className="space-y-3">
            {event.agenda.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
                <div className="text-xs font-bold text-[var(--color-primary)] w-20 shrink-0 uppercase tracking-wider">
                  {item.time}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Featured Speakers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.speakers.map((speaker) => (
              <div key={speaker.id} className="flex gap-4 p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs">
                <Image
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  width={64}
                  height={64}
                  className="rounded-2xl object-cover w-16 h-16 shrink-0"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{speaker.name}</div>
                  <div className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">
                    {speaker.title}{speaker.company && ` · ${speaker.company}`}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{speaker.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Venue Location */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">Venue & Hall</h2>
        <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-2xs">
          <div className="font-bold text-slate-900 text-base">{event.location.name}</div>
          {event.location.address && (
            <div className="text-xs text-slate-500 mt-1">{event.location.address}</div>
          )}
          <div className="text-xs text-slate-600 font-medium mt-0.5">
            {event.location.city}, {event.location.country}
          </div>
          {event.format !== "online" && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${event.location.name} ${event.location.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:opacity-80 mt-3"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </section>

      {/* Organizer */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">Official Organizer</h2>
        <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs">
          <div className="w-12 h-12 rounded-2xl theme-badge border flex items-center justify-center font-black text-lg">
            {event.organizer.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              {event.organizer.name}
              {event.organizer.verified && (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
              )}
            </div>
            <span className="text-xs text-slate-400">Verified Platform Host</span>
          </div>
        </div>
      </section>
    </div>
  );
}
