"use client";

import { ArrowLeft, ArrowRight, Save, Globe, Loader2 } from "lucide-react";
import type { EventFormTabKey } from "./EventFormHeader";

const ORDER: EventFormTabKey[] = ["basics", "schedule", "tickets", "speakers", "agenda"];
const LABELS: Record<EventFormTabKey, string> = {
  basics: "Basics",
  schedule: "Date & Venue",
  tickets: "Tickets",
  speakers: "Speakers",
  agenda: "Agenda",
};

interface Props {
  activeTab: EventFormTabKey;
  onSelectTab: (tab: EventFormTabKey) => void;
  mode: "create" | "edit";
  isDraft: boolean;
  saving: boolean;
  onPublishNow: () => void;
}

export function EventFormFooter({
  activeTab,
  onSelectTab,
  mode,
  isDraft,
  saving,
  onPublishNow,
}: Props) {
  const idx = ORDER.indexOf(activeTab);
  const prevTab = idx > 0 ? ORDER[idx - 1] : null;
  const nextTab = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <div className="bg-white theme-radius-card border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        {prevTab && (
          <button
            type="button"
            onClick={() => onSelectTab(prevTab)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 theme-radius-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {LABELS[prevTab]}
          </button>
        )}
        {nextTab && (
          <button
            type="button"
            onClick={() => onSelectTab(nextTab)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold theme-badge-secondary border theme-radius-sm hover:brightness-95 transition cursor-pointer"
          >
            Next: {LABELS[nextTab]}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="submit"
          disabled={saving}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold theme-radius-sm cursor-pointer disabled:opacity-50 transition ${
            isDraft
              ? "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50"
              : "theme-btn-primary shadow-xs"
          }`}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {isDraft ? "Save Draft" : mode === "create" ? "Publish Event" : "Save Changes"}
        </button>

        {isDraft && (
          <button
            type="button"
            disabled={saving}
            onClick={onPublishNow}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold theme-btn-primary shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            Save &amp; Publish
          </button>
        )}
      </div>
    </div>
  );
}
