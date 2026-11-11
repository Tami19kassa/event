import {
  localDateTimeToIso,
  slugifyEventTitle,
  type EventFormData,
} from "./event-form-types";
import type { EventFormTabKey } from "@/components/admin/events/EventFormHeader";

export function validateEventFormData(
  form: EventFormData
): { error: string; tab: EventFormTabKey } | null {
  if (!form.title.trim() || !form.slug.trim()) {
    return {
      tab: "basics",
      error: "Please provide both an Event Title and Public URL Slug.",
    };
  }
  if (!form.startDate || !form.endDate || new Date(form.endDate) <= new Date(form.startDate)) {
    return {
      tab: "schedule",
      error: "Please ensure Start and End Date & Time are valid and end is strictly after start.",
    };
  }
  if (form.ticketTiers.length === 0 || form.ticketTiers.some((t) => !t.name.trim())) {
    return {
      tab: "tickets",
      error: "Every ticket tier must have a tier name.",
    };
  }
  const undersoldTier = form.ticketTiers.find(
    (t) => (t.soldCount ?? 0) > 0 && Number(t.quantity) < (t.soldCount ?? 0)
  );
  if (undersoldTier) {
    return {
      tab: "tickets",
      error: `"${undersoldTier.name}" capacity (${undersoldTier.quantity}) cannot be lower than already sold passes (${undersoldTier.soldCount}).`,
    };
  }
  if (form.speakers.some((s) => !s.name.trim())) {
    return {
      tab: "speakers",
      error: "Every added speaker card needs a Full Name (or remove unused speaker rows).",
    };
  }
  if (form.agendaItems.some((a) => !a.time.trim() || !a.title.trim())) {
    return {
      tab: "agenda",
      error: "Every agenda slot needs both Time Window and Session Title (or remove unused rows).",
    };
  }
  return null;
}

export function buildEventSubmitPayload(
  form: EventFormData,
  currency: string,
  overrideStatus?: EventFormData["status"]
) {
  const base = overrideStatus ? { ...form, status: overrideStatus } : form;
  return {
    ...base,
    title: form.title.trim(),
    slug: slugifyEventTitle(form.slug) || slugifyEventTitle(form.title),
    shortDescription: form.shortDescription.trim() || null,
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    locationName: form.locationName.trim() || null,
    locationAddress: form.locationAddress.trim() || null,
    locationCity: form.locationCity.trim() || null,
    locationCountry: form.locationCountry.trim() || null,
    organizerId: form.organizerId?.trim() || undefined,
    startDate: localDateTimeToIso(form.startDate, form.timezone),
    endDate: localDateTimeToIso(form.endDate, form.timezone),
    ticketTiers: form.ticketTiers.map(({ clientKey: _ck, soldCount: _sc, ...t }) => ({
      ...t,
      currency: (t as any).currency || currency,
    })),
    speakers: form.speakers.map(({ clientKey: _ck, ...s }) => s),
    agendaItems: form.agendaItems.map(({ clientKey: _ck, ...a }) => a),
  };
}

export function computeEventTabIssues(
  form: EventFormData,
  attemptedSubmit: boolean
): Partial<Record<EventFormTabKey, boolean>> {
  const badDates =
    !form.startDate || !form.endDate || new Date(form.endDate) <= new Date(form.startDate);
  const badTierQty = form.ticketTiers.some(
    (t) => (t.soldCount ?? 0) > 0 && Number(t.quantity) < (t.soldCount ?? 0)
  );
  return {
    basics: attemptedSubmit && (!form.title.trim() || !form.slug.trim()),
    schedule: attemptedSubmit && badDates,
    tickets:
      badTierQty ||
      (attemptedSubmit &&
        (form.ticketTiers.length === 0 || form.ticketTiers.some((t) => !t.name.trim()))),
    speakers: form.speakers.some((s) => !s.name.trim()),
    agenda: form.agendaItems.some((a) => !a.time.trim() || !a.title.trim()),
  };
}

export function reorderArrayItem<T>(list: T[], idx: number, delta: -1 | 1): T[] {
  const target = idx + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}
