import { Event, EventFormat } from "@/types/event";

/**
 * Normalizes a Prisma Event record into the UI Event model
 */
export function mapPrismaEventToUI(dbEvent: any): Event {
  const formatMap: Record<string, EventFormat> = {
    IN_PERSON: "in-person",
    ONLINE: "online",
    HYBRID: "hybrid",
    "in-person": "in-person",
    online: "online",
    hybrid: "hybrid",
  };

  return {
    id: dbEvent.id,
    slug: dbEvent.slug,
    title: dbEvent.title,
    description: dbEvent.description || "",
    shortDescription: dbEvent.shortDescription || "",
    imageUrl:
      dbEvent.imageUrl ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    startDate:
      typeof dbEvent.startDate === "string"
        ? dbEvent.startDate
        : dbEvent.startDate?.toISOString() || new Date().toISOString(),
    endDate:
      typeof dbEvent.endDate === "string"
        ? dbEvent.endDate
        : dbEvent.endDate?.toISOString() || new Date().toISOString(),
    timezone: dbEvent.timezone || "UTC",
    location: {
      name: dbEvent.locationName || "Venue TBD",
      address: dbEvent.locationAddress || undefined,
      city: dbEvent.locationCity || "Global",
      country: dbEvent.locationCountry || "Worldwide",
      lat: dbEvent.locationLat || undefined,
      lng: dbEvent.locationLng || undefined,
    },
    format: formatMap[dbEvent.format] || "in-person",
    category: dbEvent.category?.name || "General",
    tags: [dbEvent.category?.name || "Event", dbEvent.format || "General"].filter(Boolean),
    organizer: {
      id: dbEvent.organizer?.id || "org",
      name: dbEvent.organizer?.name || "Event Organizer",
      logoUrl: dbEvent.organizer?.avatarUrl || undefined,
      verified: true,
    },
    ticketTiers:
      dbEvent.ticketTiers?.map((t: any) => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        currency: t.currency || "ETB",
        quantity: Number(t.quantity),
        remaining: Number(t.remaining),
        description: t.description || undefined,
        earlyBird: Boolean(t.earlyBird),
      })) || [],
    speakers:
      dbEvent.speakers?.map((s: any) => ({
        id: s.id,
        name: s.name,
        title: s.title || "",
        company: s.company || undefined,
        bio: s.bio || "",
        imageUrl:
          s.imageUrl ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      })) || [],
    agenda:
      dbEvent.agendaItems?.map((a: any) => ({
        time: a.time,
        title: a.title,
        description: a.description || undefined,
      })) || [],
    capacity: dbEvent.capacity || 100,
    attendeesCount: dbEvent.attendeesCount || 0,
    isFeatured: Boolean(dbEvent.isFeatured),
    status: (dbEvent.status?.toLowerCase() || "published") as any,
    createdAt:
      typeof dbEvent.createdAt === "string"
        ? dbEvent.createdAt
        : dbEvent.createdAt?.toISOString() || new Date().toISOString(),
  };
}
