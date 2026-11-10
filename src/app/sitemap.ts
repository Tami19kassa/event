import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/events";
import { getExpoSlides } from "@/lib/expo-settings";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [events, expoSlides] = await Promise.all([getAllEvents(), getExpoSlides()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.createdAt ? new Date(event.createdAt) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const expoRoutes: MetadataRoute.Sitemap = expoSlides
    .filter((s) => s.isActive)
    .map((slide) => ({
      url: `${baseUrl}/expo/${slide.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  return [...staticRoutes, ...expoRoutes, ...eventRoutes];
}
