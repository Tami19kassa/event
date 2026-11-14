"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./BasicInfoSection";
import { DateTimeFormatSection } from "./DateTimeFormatSection";
import { LocationSection } from "./LocationSection";
import { TicketTiersSection } from "./TicketTiersSection";
import { SpeakersSection } from "./SpeakersSection";
import { AgendaSection } from "./AgendaSection";
import { EventTemplateBar } from "./EventTemplateBar";
import { EventModalHeader } from "./EventModalHeader";
import { EventModalFooter } from "./EventModalFooter";
import {
  emptyEventForm,
  getTomorrowMorningSchedule,
  slugifyEventTitle,
  type EventFormData,
  type TicketTierInput,
  type EventFormTabKey,
} from "@/lib/event-form-types";
import { buildEventSubmitPayload, validateEventFormData, reorderArrayItem } from "@/lib/event-form-submit";
import type { OrganizerSelectOption } from "@/lib/events-admin";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Partial<EventFormData> & { id?: string };
  categories: Array<{ id: string; name: string }>;
  currency?: string;
  canCreateCategory?: boolean;
  organizerOptions?: OrganizerSelectOption[];
  onSuccess?: () => void;
}

export function EventModal({
  isOpen,
  onClose,
  mode,
  initialData,
  categories = [],
  currency = "ETB",
  canCreateCategory = false,
  organizerOptions = [],
  onSuccess,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EventFormTabKey>("basics");
  const [activeCategories, setActiveCategories] = useState(categories);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initTiers = initialData?.ticketTiers?.length ? initialData.ticketTiers : emptyEventForm.ticketTiers;
  const initSum = initTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
  const [autoSyncCapacity, setAutoSyncCapacity] = useState(mode === "create" || (initialData?.capacity ?? initSum) === initSum);
  const [form, setForm] = useState<EventFormData>({
    ...emptyEventForm, ...initialData, ticketTiers: initTiers,
    speakers: initialData?.speakers || [], agendaItems: initialData?.agendaItems || [],
  });

  useEffect(() => {
    if (categories?.length) setActiveCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        ...emptyEventForm,
        ...initialData,
        ticketTiers: initialData.ticketTiers?.length ? initialData.ticketTiers : emptyEventForm.ticketTiers,
        speakers: initialData.speakers || [],
        agendaItems: initialData.agendaItems || [],
      });
      setSlugEdited(Boolean(initialData.slug));
    } else {
      setForm({ ...emptyEventForm, ...getTomorrowMorningSchedule(emptyEventForm.timezone) });
      setSlugEdited(false);
    }
    setActiveTab("basics");
    setError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const update = (key: keyof EventFormData, value: any) => {
    if (error) setError("");
    setForm((p) => {
      const next = { ...p, [key]: value };
      if (key === "title" && mode === "create" && !slugEdited) next.slug = slugifyEventTitle(String(value || ""));
      return next;
    });
  };

  const applyTiersUpdate = (next: TicketTierInput[]) => {
    const total = next.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
    setForm((p) => ({ ...p, ticketTiers: next, capacity: autoSyncCapacity ? Math.max(1, total) : p.capacity }));
  };

  const submitPayload = async (overrideStatus?: EventFormData["status"]) => {
    setError("");
    const validationErr = validateEventFormData(form);
    if (validationErr) { setActiveTab(validationErr.tab as EventFormTabKey); setError(validationErr.error); return; }
    setSaving(true);
    try {
      const res = await fetch(mode === "create" ? "/api/events" : `/api/events/${initialData?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildEventSubmitPayload(form, currency, overrideStatus)),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save event");
      onSuccess?.();
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const tierCapacityTotal = form.ticketTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border border-slate-200 theme-radius-modal shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <EventModalHeader
          mode={mode}
          title={form.title}
          status={form.status}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onClose={onClose}
          tierCount={form.ticketTiers.length}
          speakerCount={form.speakers.length}
          agendaCount={form.agendaItems.length}
        />

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/30">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm text-xs font-medium">{error}</div>}

          {mode === "create" && activeTab === "basics" && (
            <EventTemplateBar
              onApplyPreset={(patch) => setForm((p) => ({ ...p, ...patch, ticketTiers: patch.ticketTiers || p.ticketTiers }))}
              currency={currency}
              hasCustomDetails={Boolean(form.locationName.trim() || form.description.trim())}
            />
          )}

          {activeTab === "basics" && (
            <BasicInfoSection
              form={form} update={update}
              onSlugChange={(val) => { setSlugEdited(val.trim().length > 0); setForm((p) => ({ ...p, slug: val })); }}
              onResetSlugAuto={() => { setSlugEdited(false); setForm((p) => ({ ...p, slug: slugifyEventTitle(p.title) })); }}
              categories={activeCategories} canCreateCategory={canCreateCategory}
              onCategoryAdded={(cat) => setActiveCategories((prev) => [...prev, cat])} organizerOptions={organizerOptions}
            />
          )}

          {activeTab === "schedule" && (
            <div className="space-y-4">
              <DateTimeFormatSection form={form} update={update} tierCapacityTotal={tierCapacityTotal} autoSyncCapacity={autoSyncCapacity} onToggleAutoSync={setAutoSyncCapacity} />
              <LocationSection form={form} update={update} />
            </div>
          )}

          {activeTab === "tickets" && (
            <TicketTiersSection
              tiers={form.ticketTiers} currency={currency} mode={mode}
              removeTier={(idx) => applyTiersUpdate(form.ticketTiers.filter((_, i) => i !== idx))}
              moveTier={(idx, delta) => applyTiersUpdate(reorderArrayItem(form.ticketTiers, idx, delta))}
              replaceTiers={applyTiersUpdate}
            />
          )}

          {activeTab === "speakers" && <SpeakersSection speakers={form.speakers} onChange={(next) => update("speakers", next)} />}

          {activeTab === "agenda" && <AgendaSection items={form.agendaItems} onChange={(next) => update("agendaItems", next)} />}
        </div>

        <EventModalFooter
          mode={mode}
          saving={saving}
          onClose={onClose}
          onSaveDraft={() => submitPayload("DRAFT")}
          onSubmit={() => submitPayload(mode === "create" ? "PUBLISHED" : form.status)}
        />
      </div>
    </div>
  );
}
