export type EventFormat = "in-person" | "online" | "hybrid";

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  remaining: number;
  description?: string;
  earlyBird?: boolean;
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  company?: string;
  bio: string;
  imageUrl: string;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: {
    name: string;
    address?: string;
    city: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  format: EventFormat;
  category: string;
  tags: string[];
  organizer: {
    id: string;
    name: string;
    logoUrl?: string;
    verified: boolean;
  };
  ticketTiers: TicketTier[];
  speakers: Speaker[];
  agenda?: {
    time: string;
    title: string;
    description?: string;
    speakerId?: string;
  }[];
  capacity: number;
  attendeesCount: number;
  isFeatured?: boolean;
  status: "draft" | "published" | "live" | "ended";
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
};
