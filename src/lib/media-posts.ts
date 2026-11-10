import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { sanitizePublicHttpUrl } from "./theme-types";
import {
  normalizeMediaSlug,
  sanitizeAssetOrVideoUrl,
  type MediaKind,
  type MediaPostItem,
  type MediaStatus,
} from "./media-types";

const EVENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  startDate: true,
  locationCity: true,
} as const;

export function mapMediaPost(row: any): MediaPostItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    kind: (row.kind as MediaKind) || "VIDEO_VLOG",
    categoryTag: row.categoryTag || "",
    coverImageUrl: row.coverImageUrl || "",
    videoUrl: row.videoUrl || "",
    externalUrl: row.externalUrl || "",
    externalLabel: row.externalLabel || "",
    duration: row.duration || "",
    isFeatured: Boolean(row.isFeatured),
    status: (row.status as MediaStatus) || "PUBLISHED",
    publishedAt:
      row.publishedAt instanceof Date
        ? row.publishedAt.toISOString()
        : String(row.publishedAt || new Date().toISOString()),
    eventId: row.eventId || null,
    event: row.event
      ? {
          id: row.event.id,
          slug: row.event.slug,
          title: row.event.title,
          startDate:
            row.event.startDate instanceof Date
              ? row.event.startDate.toISOString()
              : String(row.event.startDate),
          locationCity: row.event.locationCity || null,
        }
      : null,
  };
}

async function readPublishedMediaPosts(): Promise<MediaPostItem[]> {
  try {
    const rows = await prisma.mediaPost.findMany({
      where: { status: "PUBLISHED" },
      include: { event: { select: EVENT_SELECT } },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 60,
    });
    return rows.map(mapMediaPost);
  } catch (err) {
    console.error("Failed to load media posts:", err);
    return [];
  }
}

export const getPublishedMediaPosts = cache(
  unstable_cache(readPublishedMediaPosts, ["media-posts-published"], {
    tags: [CACHE_TAGS.media],
    revalidate: 60,
  })
);

export const getHomepageMediaPosts = cache(async (limit = 4): Promise<MediaPostItem[]> => {
  const all = await getPublishedMediaPosts();
  return all.slice(0, limit);
});

export const getMediaPostBySlug = cache(async (slug: string): Promise<MediaPostItem | null> => {
  try {
    const row = await prisma.mediaPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { event: { select: EVENT_SELECT } },
    });
    return row ? mapMediaPost(row) : null;
  } catch {
    return null;
  }
});

export const getEventMediaPosts = cache(async (eventId: string): Promise<MediaPostItem[]> => {
  const all = await getPublishedMediaPosts();
  return all.filter((p) => p.eventId === eventId).slice(0, 3);
});

const VALID_KINDS = new Set<MediaKind>(["VIDEO_VLOG", "ARTICLE", "EXTERNAL_LINK"]);
const VALID_STATUS = new Set<MediaStatus>(["DRAFT", "PUBLISHED"]);

export function sanitizeMediaWriteInput(raw: Record<string, any>) {
  const title = typeof raw.title === "string" ? raw.title.trim().slice(0, 160) : "";
  if (!title) {
    return { error: "Title is required." } as const;
  }

  const kind: MediaKind = VALID_KINDS.has(raw.kind) ? raw.kind : "VIDEO_VLOG";
  const status: MediaStatus = VALID_STATUS.has(raw.status) ? raw.status : "PUBLISHED";
  const slug = normalizeMediaSlug(typeof raw.slug === "string" && raw.slug.trim() ? raw.slug : title);
  const videoUrl = sanitizeAssetOrVideoUrl(raw.videoUrl);
  const externalUrl = sanitizePublicHttpUrl(raw.externalUrl);

  if (kind === "VIDEO_VLOG" && !videoUrl) {
    return { error: "Provide a YouTube/Vimeo link or upload an MP4/WebM video clip." } as const;
  }
  if (kind === "EXTERNAL_LINK" && !externalUrl) {
    return { error: "Provide a valid https:// or http:// external URL." } as const;
  }

  return {
    data: {
      title,
      slug,
      kind,
      status,
      excerpt: typeof raw.excerpt === "string" ? raw.excerpt.trim().slice(0, 400) || null : null,
      content: typeof raw.content === "string" ? raw.content.trim().slice(0, 25000) || null : null,
      categoryTag:
        typeof raw.categoryTag === "string" ? raw.categoryTag.trim().slice(0, 40) || null : null,
      coverImageUrl: sanitizeAssetOrVideoUrl(raw.coverImageUrl) || null,
      videoUrl: videoUrl || null,
      externalUrl: externalUrl || null,
      externalLabel:
        typeof raw.externalLabel === "string" ? raw.externalLabel.trim().slice(0, 60) || null : null,
      duration: typeof raw.duration === "string" ? raw.duration.trim().slice(0, 20) || null : null,
      isFeatured: Boolean(raw.isFeatured),
      eventId: typeof raw.eventId === "string" && raw.eventId.trim() ? raw.eventId.trim() : null,
    },
  } as const;
}
