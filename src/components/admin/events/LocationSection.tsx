"use client";

import { Globe, MapPin } from "lucide-react";
import { ADDIS_VENUE_PRESETS, type EventFormData } from "@/lib/event-form-types";

interface Props {
  form: EventFormData;
  update: (key: keyof EventFormData, value: any) => void;
}

export function LocationSection({ form, update }: Props) {
  const isOnline = form.format === "ONLINE";

  const applyVenuePreset = (preset: (typeof ADDIS_VENUE_PRESETS)[number]) => {
    update("locationName", preset.name);
    update("locationAddress", preset.address);
    update("locationCity", preset.city);
    update("locationCountry", preset.country);
  };

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
          {isOnline ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">
            {isOnline ? "Stream & Digital Access" : form.format === "HYBRID" ? "Venue & Hybrid Stream Location" : "Venue & Location"}
          </h2>
          <p className="text-xs text-slate-400">
            {isOnline
              ? "Specify the broadcast platform and access note for ticket holders."
              : "Pick a popular venue below or enter custom venue coordinates."}
          </p>
        </div>
      </div>

      {!isOnline && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Quick Fill:
          </span>
          {ADDIS_VENUE_PRESETS.map((preset) => {
            const selected = form.locationName === preset.name;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyVenuePreset(preset)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  selected
                    ? "theme-badge-secondary"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {isOnline ? "Platform Name" : "Venue / Hall Name"}
          </label>
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => update("locationName", e.target.value)}
            placeholder={isOnline ? "e.g. Zoom Webinar / YouTube Live" : "e.g. Millennium Hall"}
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {isOnline ? "Primary Region / Hub" : "City"}
          </label>
          <input
            type="text"
            value={form.locationCity}
            onChange={(e) => update("locationCity", e.target.value)}
            placeholder="Addis Ababa"
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {isOnline ? "Access Note / Join Info" : "Street Address"}
          </label>
          <input
            type="text"
            value={form.locationAddress}
            onChange={(e) => update("locationAddress", e.target.value)}
            placeholder={
              isOnline
                ? "Link sent with confirmed ticket code"
                : "e.g. Bole Sub-City, Cameroon St"
            }
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Country
          </label>
          <input
            type="text"
            value={form.locationCountry}
            onChange={(e) => update("locationCountry", e.target.value)}
            placeholder="Ethiopia"
            className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>
    </section>
  );
}
