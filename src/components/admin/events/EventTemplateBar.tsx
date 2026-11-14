"use client";

import { useState } from "react";
import { Sparkles, Building2, Music, Users } from "lucide-react";
import type { EventFormData } from "@/lib/event-form-types";

export interface EventStarterPreset {
  id: string;
  label: string;
  icon: typeof Building2;
  apply: (currency: string) => Partial<EventFormData>;
}

export const EVENT_STARTER_PRESETS: EventStarterPreset[] = [
  {
    id: "expo",
    label: "Trade Expo / Summit",
    icon: Building2,
    apply: () => ({
      format: "IN_PERSON",
      capacity: 400,
      locationName: "Ethiopian Skylight Convention Center",
      locationAddress: "Bole International Airport Rd",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      description:
        "Overview:\nConnect with regional industry leaders, exhibitors, and policymakers.\n\nWho Should Attend:\n• Founders, investors & procurement teams\n• Trade exhibitors & corporate delegations",
      ticketTiers: [
        { clientKey: "t-vis", name: "Visitor Pass", price: 0, quantity: 300, earlyBird: false, description: "Full exhibition hall & panel access" },
        { clientKey: "t-vip", name: "VIP Delegate", price: 1500, quantity: 100, earlyBird: true, description: "Front-row seating, lounge & networking lunch" },
      ],
    }),
  },
  {
    id: "concert",
    label: "Concert / Live Show",
    icon: Music,
    apply: () => ({
      format: "IN_PERSON",
      capacity: 600,
      locationName: "Millennium Hall",
      locationAddress: "Bole Sub-City, Cameroon St",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      description:
        "Live Experience:\nAn unforgettable evening of live sound, curated lighting, and hospitality.\n\nDoors & Entry:\nGates open 1 hour prior to headline performance.",
      ticketTiers: [
        { clientKey: "t-reg", name: "Regular Ticket", price: 500, quantity: 450, earlyBird: true, description: "General standing & main arena access" },
        { clientKey: "t-vip", name: "VIP Table Pass", price: 2000, quantity: 150, earlyBird: false, description: "Priority entry & elevated stage view" },
      ],
    }),
  },
  {
    id: "meetup",
    label: "Free Workshop / Meetup",
    icon: Users,
    apply: () => ({
      format: "HYBRID",
      capacity: 80,
      locationName: "Friendship Park Pavilion",
      locationAddress: "4 Kilo / Unity Corridor",
      locationCity: "Addis Ababa",
      locationCountry: "Ethiopia",
      description:
        "Session Focus:\nHands-on workshop and peer discussion.\n\nTakeaways:\nPractical frameworks, live Q&A, and community networking.",
      ticketTiers: [
        { clientKey: "t-free", name: "Free Seat", price: 0, quantity: 80, earlyBird: false, description: "Confirmed RSVP & gate QR pass" },
      ],
    }),
  },
];

interface Props {
  onApplyPreset: (patch: Partial<EventFormData>, presetLabel: string) => void;
  currency: string;
  hasCustomDetails?: boolean;
}

export function EventTemplateBar({ onApplyPreset, currency, hasCustomDetails = false }: Props) {
  const [pendingPreset, setPendingPreset] = useState<EventStarterPreset | null>(null);

  const handleSelect = (preset: EventStarterPreset) => {
    if (hasCustomDetails) {
      setPendingPreset(preset);
      return;
    }
    onApplyPreset(preset.apply(currency), preset.label);
  };

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2.5 text-xs">
        <div className="w-8 h-8 theme-radius-sm theme-icon-accent border flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-900 block">Quick-Start Templates</span>
          <span className="text-slate-500">Pre-fill venue, format &amp; sample pass tiers in one click.</span>
        </div>
      </div>

      {pendingPreset ? (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-amber-50/80 px-3 py-1.5 theme-radius-sm border border-amber-200">
          <span className="text-amber-900 font-medium">
            Replace venue &amp; tiers with <strong>{pendingPreset.label}</strong>?
          </span>
          <button
            type="button"
            onClick={() => {
              onApplyPreset(pendingPreset.apply(currency), pendingPreset.label);
              setPendingPreset(null);
            }}
            className="px-2.5 py-1 theme-radius-sm theme-btn-primary font-bold cursor-pointer text-xs shadow-2xs"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setPendingPreset(null)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {EVENT_STARTER_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(preset)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 theme-radius-sm border border-slate-200 transition cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
