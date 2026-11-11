import type { MediaKind, MediaPostItem, MediaStatus } from "@/lib/media-types";

export type MediaKindFilter = "ALL" | MediaKind;
export type MediaStatusFilter = "ALL" | MediaStatus;

export interface MediaEventOption {
  id: string;
  title: string;
}

export interface AdminMediaSummary {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  videoCount: number;
  articleCount: number;
  externalCount: number;
  featuredCount: number;
}

export function filterAdminMediaPosts(
  posts: MediaPostItem[],
  options: {
    search: string;
    kindFilter: MediaKindFilter;
    statusFilter: MediaStatusFilter;
    eventId: string;
  }
): MediaPostItem[] {
  const q = options.search.trim().toLowerCase();
  return posts.filter((p) => {
    if (options.kindFilter !== "ALL" && p.kind !== options.kindFilter) return false;
    if (options.statusFilter !== "ALL" && p.status !== options.statusFilter) return false;
    if (options.eventId !== "ALL" && p.eventId !== options.eventId) return false;

    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.categoryTag.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      Boolean(p.event?.title && p.event.title.toLowerCase().includes(q))
    );
  });
}

export function formatAdminMediaDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Africa/Addis_Ababa",
    });
  } catch {
    return iso;
  }
}
