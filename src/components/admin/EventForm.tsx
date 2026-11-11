"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BasicInfoSection } from "./events/BasicInfoSection";
import { DateTimeFormatSection } from "./events/DateTimeFormatSection";
import { LocationSection } from "./events/LocationSection";
import { TicketTiersSection } from "./events/TicketTiersSection";
import { SpeakersSection } from "./events/SpeakersSection";
import { AgendaSection } from "./events/AgendaSection";
import { EventFormHeader, type EventFormTabKey } from "./events/EventFormHeader";
import { EventFormFooter } from "./events/EventFormFooter";
import { EventTemplateBar } from "./events/EventTemplateBar";
import { EventLivePreviewSidebar } from "./events/EventLivePreviewSidebar";
import { emptyEventForm, getTomorrowMorningSchedule, makeClientKey, slugifyEventTitle, type EventFormData, type TicketTierInput } from "@/lib/event-form-types";
import { buildEventSubmitPayload, computeEventTabIssues, reorderArrayItem, validateEventFormData } from "@/lib/event-form-submit";
import type { OrganizerSelectOption } from "@/lib/events-admin";

interface Props {
  initialData?: Partial<EventFormData> & { id?: string };
  mode: "create" | "edit";
  categories?: Array<{ id: string; name: string }>;
  currency?: string;
  canCreateCategory?: boolean;
  organizerOptions?: OrganizerSelectOption[];
}

export function EventForm({ initialData, mode, categories = [], currency = "ETB", canCreateCategory = false, organizerOptions = [] }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState(categories);
  const [activeTab, setActiveTab] = useState<EventFormTabKey>("basics");
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const initTiers = initialData?.ticketTiers?.length ? initialData.ticketTiers : emptyEventForm.ticketTiers;
  const initSum = initTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
  const [autoSyncCapacity, setAutoSyncCapacity] = useState(mode === "create" || (initialData?.capacity ?? initSum) === initSum);
  const [form, setForm] = useState<EventFormData>({
    ...emptyEventForm,
    ...initialData,
    ticketTiers: initTiers,
    speakers: initialData?.speakers || [],
    agendaItems: initialData?.agendaItems || [],
  });
  const [isDirty, setIsDirty] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (categories?.length) setActiveCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (mode === "create" && !initialData?.startDate) {
      const def = getTomorrowMorningSchedule(form.timezone);
      setForm((prev) => (prev.startDate ? prev : { ...prev, ...def }));
    }
  }, [mode, initialData?.startDate, form.timezone]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const applyTiersUpdate = (nextTiers: TicketTierInput[]) => {
    const total = nextTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
    if (error) setError("");
    setIsDirty(true);
    setForm((prev) => ({ ...prev, ticketTiers: nextTiers, capacity: autoSyncCapacity ? Math.max(1, total) : prev.capacity }));
  };

  const update = (key: keyof EventFormData, value: any) => {
    if (error) setError("");
    setIsDirty(true);
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create" && !slugEdited) next.slug = slugifyEventTitle(String(value || ""));
      return next;
    });
  };

  const applyStarterPreset = (patch: Partial<EventFormData>) => {
    if (error) setError("");
    setIsDirty(true);
    setForm((prev) => {
      const tiers = patch.ticketTiers || prev.ticketTiers;
      const tierSum = tiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
      return {
        ...prev,
        ...patch,
        description: prev.description.trim() ? prev.description : patch.description || "",
        ticketTiers: tiers,
        capacity: autoSyncCapacity ? tierSum : patch.capacity ?? prev.capacity,
      };
    });
  };

  const submitPayload = async (overrideStatus?: EventFormData["status"]) => {
    setAttemptedSubmit(true);
    setError("");
    const validationErr = validateEventFormData(form);
    if (validationErr) { setActiveTab(validationErr.tab); setError(validationErr.error); return; }

    setSaving(true);
    isSubmittingRef.current = true;
    try {
      const res = await fetch(mode === "create" ? "/api/events" : `/api/events/${initialData?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildEventSubmitPayload(form, currency, overrideStatus)),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save event");
      setIsDirty(false);
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      isSubmittingRef.current = false;
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const tierCapacityTotal = form.ticketTiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
  const categoryName = activeCategories.find((c) => c.id === form.categoryId)?.name || "General";

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitPayload(); }} noValidate className="max-w-6xl mx-auto space-y-5 pb-12">
      <EventFormHeader mode={mode} form={form} activeTab={activeTab} tabIssues={computeEventTabIssues(form, attemptedSubmit)} isDirty={isDirty} onSelectTab={setActiveTab} saving={saving} onPublishNow={() => submitPayload("PUBLISHED")} />
      {error && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 theme-radius text-xs sm:text-sm font-medium">{error}</div>}
      {mode === "create" && activeTab === "basics" && (
        <EventTemplateBar
          onApplyPreset={(p) => applyStarterPreset(p)}
          currency={currency}
          hasCustomDetails={Boolean(form.locationName.trim() || form.description.trim())}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          {activeTab === "basics" && (
            <BasicInfoSection
              form={form}
              update={update}
              onSlugChange={(val) => { if (error) setError(""); setSlugEdited(val.trim().length > 0); setIsDirty(true); setForm((p) => ({ ...p, slug: val })); }}
              onResetSlugAuto={() => { if (error) setError(""); setSlugEdited(false); setIsDirty(true); setForm((p) => ({ ...p, slug: slugifyEventTitle(p.title) })); }}
              categories={activeCategories}
              canCreateCategory={canCreateCategory}
              onCategoryAdded={(cat) => setActiveCategories((prev) => [...prev, cat])}
              organizerOptions={organizerOptions}
            />
          )}
          {activeTab === "schedule" && (
            <>
              <DateTimeFormatSection form={form} update={update} tierCapacityTotal={tierCapacityTotal} autoSyncCapacity={autoSyncCapacity} onToggleAutoSync={(sync) => { setAutoSyncCapacity(sync); if (sync) update("capacity", Math.max(1, tierCapacityTotal)); }} />
              <LocationSection form={form} update={update} />
            </>
          )}
          {activeTab === "tickets" && (
            <TicketTiersSection
              tiers={form.ticketTiers}
              currency={currency}
              mode={mode}
              updateTier={(idx, field, val) => { const n = [...form.ticketTiers]; n[idx] = { ...n[idx], [field]: val }; applyTiersUpdate(n); }}
              addTier={() => applyTiersUpdate([...form.ticketTiers, { clientKey: makeClientKey("tier"), name: "VIP Pass", price: 500, quantity: 50, earlyBird: false }])}
              removeTier={(idx) => applyTiersUpdate(form.ticketTiers.filter((_, i) => i !== idx))}
              moveTier={(idx, delta) => applyTiersUpdate(reorderArrayItem(form.ticketTiers, idx, delta))}
              replaceTiers={applyTiersUpdate}
            />
          )}
          {activeTab === "speakers" && <SpeakersSection speakers={form.speakers} onChange={(next) => update("speakers", next)} />}
          {activeTab === "agenda" && <AgendaSection items={form.agendaItems} onChange={(next) => update("agendaItems", next)} />}
          <EventFormFooter activeTab={activeTab} onSelectTab={setActiveTab} mode={mode} isDraft={form.status === "DRAFT"} saving={saving} onPublishNow={() => submitPayload("PUBLISHED")} />
        </div>

        <div className="lg:col-span-4">
          <EventLivePreviewSidebar form={form} currency={currency} categoryName={categoryName} update={update} onJumpTab={setActiveTab} />
        </div>
      </div>
    </form>
  );
}
