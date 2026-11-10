export type TicketTierInput = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  remaining?: number;
  description?: string;
  earlyBird?: boolean;
};

export type SpeakerInput = {
  id?: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
};

export type AgendaItemInput = {
  id?: string;
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
  ticketTiers: [{ name: "General Admission", price: 0, quantity: 100, earlyBird: false }],
  speakers: [],
  agendaItems: [],
};

export function slugifyEventTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function addHoursLocalValue(datetimeLocal: string, hours = 3): string {
  if (!datetimeLocal) return "";
  const parsed = new Date(datetimeLocal);
  if (Number.isNaN(parsed.getTime())) return "";
  const bumped = new Date(parsed.getTime() + hours * 3600 * 1000);
  const offset = bumped.getTimezoneOffset();
  const local = new Date(bumped.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
