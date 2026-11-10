"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, FileText, Ticket, Mic2, CalendarClock } from "lucide-react";
import Link from "next/link";
import { BasicInfoSection } from "./events/BasicInfoSection";
import { DateTimeFormatSection } from "./events/DateTimeFormatSection";
import { LocationSection } from "./events/LocationSection";
import { TicketTiersSection } from "./events/TicketTiersSection";
import { SpeakersSection } from "./events/SpeakersSection";
import { AgendaSection } from "./events/AgendaSection";
import {
  emptyEventForm,
  type EventFormData,
  type TicketTierInput,
  type SpeakerInput,
  type AgendaItemInput,
} from "@/lib/event-form-types";

export type { TicketTierInput, SpeakerInput, AgendaItemInput, EventFormData };

interface Props {
  initialData?: Partial<EventFormData> & { id?: string };
  mode: "create" | "edit";
  categories?: Array<{ id: string; name: string }>;
}

type TabKey = "details" | "tickets" | "speakers" | "agenda";

export function EventForm({ initialData, mode, categories = [] }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState(categories);
  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [form, setForm] = useState<EventFormData>({
    ...emptyEventForm,
    ...initialData,
    ticketTiers: initialData?.ticketTiers?.length ? initialData.ticketTiers : emptyEventForm.ticketTiers,
    speakers: initialData?.speakers || [],
    agendaItems: initialData?.agendaItems || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveCategories(categories);
    } else {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setActiveCategories(data);
        })
        .catch(() => {});
    }
  }, [categories]);

  const update = (key: keyof EventFormData, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create") {
        next.slug = value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
      }
      return next;
    });
  };

  const updateTier = (index: number, field: string, value: any) => {
    setForm((prev) => {
      const tiers = [...prev.ticketTiers];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, ticketTiers: tiers };
    });
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { name: "VIP Pass", price: 500, quantity: 50 }],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate || !form.endDate) {
      setActiveTab("details");
      setError("Please provide an event title, start date, and end date.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/events" : `/api/events/${initialData?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "details" as const, label: "Details & Venue", icon: FileText },
    { key: "tickets" as const, label: `Tickets (${form.ticketTiers.length})`, icon: Ticket },
    { key: "speakers" as const, label: `Speakers (${form.speakers.length})`, icon: Mic2 },
    { key: "agenda" as const, label: `Agenda (${form.agendaItems.length})`, icon: CalendarClock },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/events" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 font-bold theme-btn-primary shadow-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {mode === "create" ? "Publish Event" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                active ? "theme-btn-primary shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      )}

      <div className={activeTab === "details" ? "space-y-6" : "hidden"}>
        <BasicInfoSection form={form} update={update} categories={activeCategories} />
        <DateTimeFormatSection form={form} update={update} />
        <LocationSection form={form} update={update} />
      </div>

      <div className={activeTab === "tickets" ? "space-y-6" : "hidden"}>
        <TicketTiersSection tiers={form.ticketTiers} updateTier={updateTier} addTier={addTier} removeTier={removeTier} />
      </div>

      <div className={activeTab === "speakers" ? "space-y-6" : "hidden"}>
        <SpeakersSection speakers={form.speakers} onChange={(next) => update("speakers", next)} />
      </div>

      <div className={activeTab === "agenda" ? "space-y-6" : "hidden"}>
        <AgendaSection items={form.agendaItems} onChange={(next) => update("agendaItems", next)} />
      </div>
    </form>
  );
}
