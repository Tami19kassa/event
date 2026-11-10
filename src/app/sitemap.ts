import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/events";
import { getExpoSlides } from "@/lib/expo-settings";
import { getPublishedMediaPosts } from "@/lib/media-posts";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [events, expoSlides, mediaPosts] = await Promise.all([
    getAllEvents(),
    getExpoSlides(),
    getPublishedMediaPosts(),
  ]);

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
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
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

  const storyRoutes: MetadataRoute.Sitemap = mediaPosts
    .filter((p) => p.kind !== "EXTERNAL_LINK")
    .map((post) => ({
      url: `${baseUrl}/stories/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  return [...staticRoutes, ...expoRoutes, ...eventRoutes, ...storyRoutes];
}
