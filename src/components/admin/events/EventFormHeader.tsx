"use client";

import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Loader2,
  FileText,
  Calendar,
  Ticket,
  Mic2,
  CalendarClock,
  Globe,
  ExternalLink,
} from "lucide-react";
import type { EventFormData } from "@/lib/event-form-types";

export type EventFormTabKey = "basics" | "schedule" | "tickets" | "speakers" | "agenda";

interface Props {
  mode: "create" | "edit";
  form: EventFormData;
  activeTab: EventFormTabKey;
  tabIssues: Partial<Record<EventFormTabKey, boolean>>;
  isDirty: boolean;
  onSelectTab: (tab: EventFormTabKey) => void;
  saving: boolean;
  onPublishNow: () => void;
}

export function EventFormHeader({
  mode,
  form,
  activeTab,
  tabIssues,
  isDirty,
  onSelectTab,
  saving,
  onPublishNow,
}: Props) {
  const isDraft = form.status === "DRAFT";
  const isPublic = form.status === "PUBLISHED" || form.status === "LIVE";

  const tabs: { key: EventFormTabKey; label: string; icon: typeof FileText }[] = [
    { key: "basics", label: "Basics", icon: FileText },
    { key: "schedule", label: "Date & Venue", icon: Calendar },
    { key: "tickets", label: `Tickets (${form.ticketTiers.length})`, icon: Ticket },
    { key: "speakers", label: `Speakers (${form.speakers.length})`, icon: Mic2 },
    { key: "agenda", label: `Agenda (${form.agendaItems.length})`, icon: CalendarClock },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 theme-radius-sm transition shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Events
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display text-slate-900 leading-tight truncate">
                {mode === "create" ? "Create Event" : form.title || "Edit Event"}
              </h1>
              {isDirty && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  Unsaved edits
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Status: <strong className="text-slate-800">{form.status}</strong> · All times EAT (UTC+3)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && isPublic && form.slug && (
            <Link
              href={`/events/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-[var(--color-secondary)] theme-radius-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold theme-radius-sm cursor-pointer disabled:opacity-50 transition ${
              isDraft
                ? "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50"
                : "theme-btn-primary shadow-sm"
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isDraft ? "Save Draft" : mode === "create" ? "Publish Event" : "Save Changes"}
          </button>
          {isDraft && (
            <button
              type="button"
              disabled={saving}
              onClick={onPublishNow}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold theme-btn-primary shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              Save &amp; Publish
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 theme-radius-card border border-slate-200 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          const hasIssue = Boolean(tabIssues[tab.key]);
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`relative flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-2.5 py-2.5 theme-radius-sm text-xs font-bold transition cursor-pointer ${
                active ? "theme-nav-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {hasIssue && (
                <span
                  className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white shrink-0"
                  title="Needs attention"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
