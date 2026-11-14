"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Event, Speaker } from "@/types/event";
import { SpeakerCard } from "./SpeakerCard";
import { SpeakerBioModal } from "./SpeakerBioModal";
import { AgendaSection } from "./AgendaSection";
import { VenueSection } from "./VenueSection";

export function EventDetailsContent({ event }: { event: Event }) {
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);

  const isLongDesc = (event.description || "").length > 420;
  const displayDescription =
    isLongDesc && !descExpanded
      ? `${event.description.slice(0, 420).trim()}...`
      : event.description;

  return (
    <div className="space-y-10">
      {/* About Section */}
      <section>
        <h2 className="text-xl font-display text-slate-900 mb-3">About this event</h2>
        <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-600 leading-relaxed text-sm md:text-base">
          {displayDescription}
        </div>
        {isLongDesc && (
          <button
            type="button"
            onClick={() => setDescExpanded((v) => !v)}
            className="mt-3 text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{descExpanded ? "Show less" : "Read full description"}</span>
            {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </section>

      {/* Agenda Section with Modal */}
      {event.agenda && event.agenda.length > 0 && (
        <AgendaSection
          agenda={event.agenda}
          eventTitle={event.title}
          speakers={event.speakers}
          onSelectSpeaker={(speaker) => setActiveSpeaker(speaker)}
        />
      )}

      {/* Speakers Section with Bio Modal */}
      {event.speakers.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-display text-slate-900">Featured Speakers</h2>
              <p className="text-xs text-slate-400">Industry leaders &amp; keynote presenters</p>
            </div>
            <span className="text-xs font-bold theme-badge border px-2.5 py-1 rounded-full">
              {event.speakers.length} {event.speakers.length === 1 ? "speaker" : "speakers"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {event.speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onSelect={(s) => setActiveSpeaker(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Venue Location Section */}
      <VenueSection
        location={event.location}
        isOnline={event.format === "online"}
      />

      {/* Organizer Section */}
      <section>
        <h2 className="text-xl font-display text-slate-900 mb-3">Official Organizer</h2>
        <div className="flex items-center justify-between gap-4 p-4 border border-slate-200 theme-radius-card bg-white shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 theme-radius-sm theme-badge border flex items-center justify-center font-display text-lg font-bold">
              {event.organizer.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <span>{event.organizer.name}</span>
                {event.organizer.verified && (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
                )}
              </div>
              <span className="text-xs text-slate-400">Verified Platform Host</span>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Bio Modal */}
      <SpeakerBioModal
        speaker={activeSpeaker}
        onClose={() => setActiveSpeaker(null)}
      />
    </div>
  );
}
