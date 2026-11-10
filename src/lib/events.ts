import { prisma } from "./prisma";
import { Event, Category } from "@/types/event";
import { events as mockEvents, categories as mockCategories } from "./mock-data";
import { mapPrismaEventToUI } from "./event-mapper";

export { mapPrismaEventToUI };

/**
 * Fetch all published events from DB, with fallback to mock data
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const dbEvents = await prisma.event.findMany({
      where: {
        status: { in: ["PUBLISHED", "LIVE"] },
      },
      include: {
        category: true,
        organizer: true,
        ticketTiers: { orderBy: { sortOrder: "asc" } },
        speakers: { orderBy: { sortOrder: "asc" } },
        agendaItems: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { startDate: "asc" },
    });

    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.map(mapPrismaEventToUI);
    }
  } catch (error) {
    console.error("Failed to load events from DB, using fallback:", error);
  }

  return mockEvents;
}

/**
 * Fetch featured events for hero/featured sections
 */
export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const dbFeatured = await prisma.event.findMany({
      where: {
        status: { in: ["PUBLISHED", "LIVE"] },
        isFeatured: true,
      },
      include: {
        category: true,
        organizer: true,
        ticketTiers: { orderBy: { sortOrder: "asc" } },
        speakers: { orderBy: { sortOrder: "asc" } },
        agendaItems: { orderBy: { sortOrder: "asc" } },
      },
      take: 6,
    });

    if (dbFeatured && dbFeatured.length > 0) {
      return dbFeatured.map(mapPrismaEventToUI);
    }
  } catch (error) {
    console.error("Failed to load featured events from DB:", error);
  }

  const all = await getAllEvents();
  return all.filter((e) => e.isFeatured);
}

/**
 * Fetch a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const dbEvent = await prisma.event.findFirst({
      where: {
        slug,
        status: { in: ["PUBLISHED", "LIVE"] },
      },
      include: {
        category: true,
        organizer: true,
        ticketTiers: { orderBy: { sortOrder: "asc" } },
        speakers: { orderBy: { sortOrder: "asc" } },
        agendaItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (dbEvent) {
      return mapPrismaEventToUI(dbEvent);
    }
  } catch (error) {
    console.error(`Failed to load event ${slug} from DB:`, error);
  }

  return mockEvents.find((e) => e.slug === slug) || null;
}

/**
 * Fetch categories with event counts
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            events: {
              where: { status: { in: ["PUBLISHED", "LIVE"] } },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || "📌",
        count: c._count?.events || 0,
      }));
    }
  } catch (error) {
    console.error("Failed to load categories from DB:", error);
  }

  return mockCategories;
}
