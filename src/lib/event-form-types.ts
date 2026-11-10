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
  ticketTiers: [{ name: "General Admission", price: 0, quantity: 100 }],
  speakers: [],
  agendaItems: [],
};
