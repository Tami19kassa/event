import { Event, Category } from "@/types/event";
import { categories } from "./mock-categories";
import { primaryMockEvents } from "./mock-events-primary";
import { secondaryMockEvents } from "./mock-events-secondary";

export { categories };

export const events: Event[] = [...primaryMockEvents, ...secondaryMockEvents];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getFeaturedEvents(): Event[] {
  return events.filter((e) => e.isFeatured);
}

export function getEventsByCategory(category: string): Event[] {
  return events.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );
}
