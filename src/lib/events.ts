import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma, withDbRetry } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { Event, Category } from "@/types/event";
import { events as mockEvents, categories as mockCategories } from "./mock-data";
import { mapPrismaEventToUI } from "./event-mapper";

export { mapPrismaEventToUI };

const EVENT_RELATIONS = {
  category: true,
  organizer: true,
  ticketTiers: { orderBy: { sortOrder: "asc" as const } },
  speakers: { orderBy: { sortOrder: "asc" as const } },
  agendaItems: { orderBy: { sortOrder: "asc" as const } },
};

async function readAllEventsFromDb(): Promise<Event[]> {
  try {
    const dbEvents = await prisma.event.findMany({
      where: { status: { in: ["PUBLISHED", "LIVE"] } },
      include: EVENT_RELATIONS,
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

export const getAllEvents = cache(
  unstable_cache(readAllEventsFromDb, ["events-all"], {
    tags: [CACHE_TAGS.events],
    revalidate: 60,
  })
);

async function readFeaturedEventsFromDb(): Promise<Event[]> {
  try {
    const dbFeatured = await prisma.event.findMany({
      where: {
        status: { in: ["PUBLISHED", "LIVE"] },
        isFeatured: true,
      },
      include: EVENT_RELATIONS,
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

export const getFeaturedEvents = cache(
  unstable_cache(readFeaturedEventsFromDb, ["events-featured"], {
    tags: [CACHE_TAGS.events],
    revalidate: 60,
  })
);

async function readEventBySlugFromDb(slug: string): Promise<Event | null> {
  try {
    const dbEvent = await prisma.event.findFirst({
      where: {
        slug,
        status: { in: ["PUBLISHED", "LIVE"] },
      },
      include: EVENT_RELATIONS,
    });

    if (dbEvent) {
      return mapPrismaEventToUI(dbEvent);
    }
  } catch (error) {
    console.error(`Failed to load event ${slug} from DB:`, error);
  }

  return mockEvents.find((e) => e.slug === slug) || null;
}

export const getEventBySlug = cache(
  unstable_cache(readEventBySlugFromDb, ["event-by-slug"], {
    tags: [CACHE_TAGS.events],
    revalidate: 60,
  })
);

async function readCategoriesFromDb(): Promise<Category[]> {
  try {
    const dbCategories = await withDbRetry(() =>
      prisma.category.findMany({
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
      })
    );

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

export const getCategories = cache(
  unstable_cache(readCategoriesFromDb, ["categories-all"], {
    tags: [CACHE_TAGS.categories, CACHE_TAGS.events],
    revalidate: 60,
  })
);

export type FooterVenueItem = { name: string; city?: string };

const DEFAULT_VENUES: FooterVenueItem[] = [
  { name: "Millennium Hall", city: "Addis Ababa" },
  { name: "Ethiopian Skylight Convention Center", city: "Addis Ababa" },
  { name: "Friendship Park", city: "Addis Ababa" },
  { name: "UNECA Conference Center", city: "Addis Ababa" },
];

export function extractTopVenues(allEvents: Event[], limit = 4): FooterVenueItem[] {
  const skipped = new Set(["online", "virtual", "tba", "remote", "zoom", "google meet"]);
  const counts = new Map<string, { name: string; city?: string; count: number }>();

  for (const ev of allEvents) {
    if (ev.format === "online") continue;
    const rawName = ev.location?.name?.trim();
    if (!rawName || skipped.has(rawName.toLowerCase())) continue;
    const key = rawName.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { name: rawName, city: ev.location?.city?.trim(), count: 1 });
    }
  }

  const ranked: FooterVenueItem[] = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map(({ name, city }) => ({ name, city }));

  const seen = new Set(ranked.map((v) => v.name.toLowerCase()));
  for (const fallback of DEFAULT_VENUES) {
    if (ranked.length >= limit) break;
    if (!seen.has(fallback.name.toLowerCase())) {
      ranked.push(fallback);
      seen.add(fallback.name.toLowerCase());
    }
  }

  return ranked.slice(0, limit);
}
