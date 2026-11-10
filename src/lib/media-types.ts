import { extractYouTubeId, getYouTubeThumbnail } from "./youtube";

export type MediaKind = "VIDEO_VLOG" | "ARTICLE" | "EXTERNAL_LINK";
export type MediaStatus = "DRAFT" | "PUBLISHED";

export type MediaEventRef = {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  locationCity?: string | null;
};

export type MediaPostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  kind: MediaKind;
  categoryTag: string;
  coverImageUrl: string;
  videoUrl: string;
  externalUrl: string;
  externalLabel: string;
  duration: string;
  isFeatured: boolean;
  status: MediaStatus;
  publishedAt: string;
  eventId: string | null;
  event: MediaEventRef | null;
};

export function normalizeMediaSlug(raw: string): string {
  const clean = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  return clean || `story-${Date.now().toString(36)}`;
}

export function extractExternalDomain(url?: string | null): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export function resolveMediaPoster(post: Pick<MediaPostItem, "coverImageUrl" | "videoUrl">): string {
  if (post.coverImageUrl?.trim()) return post.coverImageUrl.trim();
  const ytId = extractYouTubeId(post.videoUrl);
  if (ytId) return getYouTubeThumbnail(ytId);
  return "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=750&fit=crop";
}

export function sanitizeAssetOrVideoUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/uploads/")) return trimmed.slice(0, 500);
  if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(trimmed)) {
    return trimmed;
  }
  if (/^data:video\/(?:mp4|webm);base64,[a-zA-Z0-9+/=]+$/.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString().slice(0, 500);
    }
  } catch {}
  return "";
}
