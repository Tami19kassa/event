export type TicketTierInput = {
  id?: string;
  clientKey?: string;
  name: string;
  price: number;
  quantity: number;
  remaining?: number;
  soldCount?: number;
  description?: string;
  earlyBird?: boolean;
};

export type SpeakerInput = {
  id?: string;
  clientKey?: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
};

export type AgendaItemInput = {
  id?: string;
  clientKey?: string;
  time: string;
  title: string;
  description: string;
};

export type EventFormData = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  timezone: string;
  format: "IN_PERSON" | "ONLINE" | "HYBRID";
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "ENDED" | "CANCELLED";
  capacity: number;
  isFeatured: boolean;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
  categoryId: string;
  ticketTiers: TicketTierInput[];
  speakers: SpeakerInput[];
  agendaItems: AgendaItemInput[];
};

export const emptyEventForm: EventFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  startDate: "",
  endDate: "",
  timezone: "Africa/Addis_Ababa",
  format: "IN_PERSON",
  status: "DRAFT",
  capacity: 100,
  isFeatured: false,
  locationName: "",
  locationAddress: "",
  locationCity: "Addis Ababa",
  locationCountry: "Ethiopia",
  categoryId: "",
  ticketTiers: [{ clientKey: "tier-default", name: "General Admission", price: 0, quantity: 100, earlyBird: false }],
  speakers: [],
  agendaItems: [],
};

export const ADDIS_VENUE_PRESETS = [
  { label: "Millennium Hall", name: "Millennium Hall", address: "Bole Sub-City, Cameroon St", city: "Addis Ababa", country: "Ethiopia" },
  { label: "Skylight Center", name: "Ethiopian Skylight Convention Center", address: "Bole International Airport Rd", city: "Addis Ababa", country: "Ethiopia" },
  { label: "UNECA Center", name: "UNECA Conference Center", address: "Menelik II Ave", city: "Addis Ababa", country: "Ethiopia" },
  { label: "Friendship Park", name: "Friendship Park", address: "4 Kilo / Unity Corridor", city: "Addis Ababa", country: "Ethiopia" },
  { label: "Addis Expo Hall (AICC)", name: "Addis International Convention Center", address: "Lemi Kura / CMC Area", city: "Addis Ababa", country: "Ethiopia" },
] as const;

export function makeClientKey(prefix = "item"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugifyEventTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function formatInEventTimezone(
  dateInput: Date | string,
  timeZone = "Africa/Addis_Ababa"
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";
    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
  } catch {
    return date.toISOString().slice(0, 16);
  }
}

export function localDateTimeToIso(
  localValue: string,
  timeZone = "Africa/Addis_Ababa"
): string {
  if (!localValue) return "";
  if (timeZone === "Africa/Addis_Ababa") {
    const parsed = new Date(`${localValue}:00+03:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  const fallback = new Date(localValue);
  return Number.isNaN(fallback.getTime()) ? localValue : fallback.toISOString();
}

export function addHoursLocalValue(datetimeLocal: string, hours = 3): string {
  if (!datetimeLocal) return "";
  const match = datetimeLocal.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return "";
  const utcMs = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5])
  );
  const bumped = new Date(utcMs + hours * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${bumped.getUTCFullYear()}-${pad(bumped.getUTCMonth() + 1)}-${pad(bumped.getUTCDate())}T${pad(bumped.getUTCHours())}:${pad(bumped.getUTCMinutes())}`;
}

export function getTomorrowMorningSchedule(timeZone = "Africa/Addis_Ababa") {
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  const dayPrefix = formatInEventTimezone(tomorrow, timeZone).slice(0, 10);
  const startDate = `${dayPrefix}T09:00`;
  return { startDate, endDate: addHoursLocalValue(startDate, 8) };
}
