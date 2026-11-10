"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./events/BasicInfoSection";
import { DateTimeFormatSection } from "./events/DateTimeFormatSection";
import { LocationSection } from "./events/LocationSection";
import { TicketTiersSection } from "./events/TicketTiersSection";
import { SpeakersSection } from "./events/SpeakersSection";
import { AgendaSection } from "./events/AgendaSection";
import { EventFormHeader, type EventFormTabKey } from "./events/EventFormHeader";
import {
  emptyEventForm,
  slugifyEventTitle,
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
  currency?: string;
}

export function EventForm({ initialData, mode, categories = [], currency = "ETB" }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState(categories);
  const [activeTab, setActiveTab] = useState<EventFormTabKey>("details");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [form, setForm] = useState<EventFormData>({
    ...emptyEventForm,
    ...initialData,
    ticketTiers: initialData?.ticketTiers?.length
      ? initialData.ticketTiers
      : emptyEventForm.ticketTiers,
    speakers: initialData?.speakers || [],
    agendaItems: initialData?.agendaItems || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories?.length) {
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
      if (key === "title" && mode === "create" && !slugEdited) {
        next.slug = slugifyEventTitle(String(value || ""));
      }
      return next;
    });
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(val.trim().length > 0);
    setForm((prev) => ({ ...prev, slug: val }));
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
      ticketTiers: [...prev.ticketTiers, { name: "VIP Pass", price: 500, quantity: 50, earlyBird: false }],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const submitPayload = async (overrideStatus?: EventFormData["status"]) => {
    setError("");
    if (!form.title.trim() || !form.startDate || !form.endDate) {
      setActiveTab("details");
      setError("Please provide an event title, start date, and end date.");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setActiveTab("details");
      setError("End date & time must be strictly after start date & time.");
      return;
    }
    if (form.ticketTiers.some((t) => !t.name.trim())) {
      setActiveTab("tickets");
      setError("Every ticket tier must have a tier name.");
      return;
    }

    setSaving(true);
    const payload = {
      ...(overrideStatus ? { ...form, status: overrideStatus } : form),
      ticketTiers: form.ticketTiers.map((t: any) => ({ ...t, currency: t.currency || currency })),
    };

    try {
      const url = mode === "create" ? "/api/events" : `/api/events/${initialData?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save event");
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const tierCapacityTotal = form.ticketTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitPayload();
      }}
      noValidate
      className="max-w-4xl mx-auto space-y-5 pb-12"
    >
      <EventFormHeader
        mode={mode}
        form={form}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        saving={saving}
        onPublishNow={() => submitPayload("PUBLISHED")}
      />

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 theme-radius text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      <div className={activeTab === "details" ? "space-y-5" : "hidden"}>
        <BasicInfoSection
          form={form}
          update={update}
          onSlugChange={handleSlugChange}
          categories={activeCategories}
        />
        <DateTimeFormatSection form={form} update={update} tierCapacityTotal={tierCapacityTotal} />
        <LocationSection form={form} update={update} />
      </div>

      <div className={activeTab === "tickets" ? "space-y-5" : "hidden"}>
        <TicketTiersSection
          tiers={form.ticketTiers}
          currency={currency}
          mode={mode}
          updateTier={updateTier}
          addTier={addTier}
          removeTier={removeTier}
        />
      </div>

      <div className={activeTab === "speakers" ? "space-y-5" : "hidden"}>
        <SpeakersSection speakers={form.speakers} onChange={(next) => update("speakers", next)} />
      </div>

      <div className={activeTab === "agenda" ? "space-y-5" : "hidden"}>
        <AgendaSection items={form.agendaItems} onChange={(next) => update("agendaItems", next)} />
      </div>
    </form>
  );
}
