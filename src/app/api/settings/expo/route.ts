import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  getExpoSlides,
  saveExpoSlides,
  getSponsors,
  saveSponsors,
  getExpoScrollInterval,
  saveExpoScrollInterval,
  HeroSlide,
  SponsorItem,
} from "@/lib/expo-settings";

function isSafeLink(url?: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  );
}

function isSafeMediaUrl(url?: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return true;
  }
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return true;
  }
  const svgMatch = trimmed.match(/^data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)$/i);
  if (svgMatch) {
    const decoded = Buffer.from(svgMatch[1], "base64").toString("utf8");
    return !/(<script|on[a-z]+\s*=|javascript:|<foreignObject)/i.test(decoded);
  }
  return false;
}

function isSafeVideoUrl(url?: string): boolean {
  if (!url) return true;
  if (isSafeLink(url)) return true;
  return /^data:video\/(mp4|webm);base64,[A-Za-z0-9+/=]+$/i.test(url.trim());
}

function sanitizeSlide(raw: any, idx: number): HeroSlide {
  return {
    id: typeof raw?.id === "string" && raw.id.trim() ? raw.id.trim() : `slide-${idx}`,
    title: String(raw?.title || "").slice(0, 200),
    titleHighlight: raw?.titleHighlight ? String(raw.titleHighlight).slice(0, 80) : undefined,
    subtitle: String(raw?.subtitle || "").slice(0, 500),
    detailedDescription: raw?.detailedDescription
      ? String(raw.detailedDescription).slice(0, 12000)
      : undefined,
    badgeText: String(raw?.badgeText || "").slice(0, 100),
    category: String(raw?.category || "Exhibition").slice(0, 80),
    datesText: String(raw?.datesText || "").slice(0, 100),
    venueText: String(raw?.venueText || "").slice(0, 150),
    mediaType: raw?.mediaType === "video" ? "video" : "image",
    videoUrl: isSafeVideoUrl(raw?.videoUrl) ? raw?.videoUrl?.trim() || undefined : undefined,
    posterUrl: isSafeMediaUrl(raw?.posterUrl) ? String(raw?.posterUrl || "") : "",
    visitorCtaText: String(raw?.visitorCtaText || "Get Visitor Pass").slice(0, 60),
    visitorCtaLink: isSafeLink(raw?.visitorCtaLink) ? String(raw?.visitorCtaLink || "/discover") : "/discover",
    exhibitorCtaText: String(raw?.exhibitorCtaText || "Book Exhibition Booth").slice(0, 60),
    exhibitorCtaLink: isSafeLink(raw?.exhibitorCtaLink) ? String(raw?.exhibitorCtaLink || "#exhibit") : "#exhibit",
    isActive: Boolean(raw?.isActive),
  };
}

function sanitizeSponsor(raw: any, idx: number): SponsorItem {
  const validTiers = ["STRATEGIC", "PLATINUM", "GOLD", "MEDIA"] as const;
  const tier = validTiers.includes(raw?.tier) ? raw.tier : "PLATINUM";
  return {
    id: typeof raw?.id === "string" && raw.id.trim() ? raw.id.trim() : `sp-${idx}`,
    name: String(raw?.name || "").slice(0, 150),
    logoText: String(raw?.logoText || raw?.name || "").slice(0, 150),
    logoUrl: isSafeMediaUrl(raw?.logoUrl) ? raw?.logoUrl?.trim() || undefined : undefined,
    tier,
    websiteUrl: isSafeLink(raw?.websiteUrl) ? raw?.websiteUrl?.trim() || undefined : undefined,
  };
}

export async function GET() {
  try {
    const [slides, sponsors, scrollInterval] = await Promise.all([
      getExpoSlides(),
      getSponsors(),
      getExpoScrollInterval(),
    ]);
    return NextResponse.json({ slides, sponsors, scrollInterval });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch expo settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slides, sponsors, scrollInterval } = body;

    let updatedSlides = null;
    let updatedSponsors = null;
    let updatedInterval = null;

    if (Array.isArray(slides)) {
      const sanitizedSlides = slides.slice(0, 20).map(sanitizeSlide);
      updatedSlides = await saveExpoSlides(sanitizedSlides);
    }
    if (Array.isArray(sponsors)) {
      const sanitizedSponsors = sponsors
        .slice(0, 60)
        .map(sanitizeSponsor)
        .filter((s) => s.name.trim().length > 0);
      updatedSponsors = await saveSponsors(sanitizedSponsors);
    }
    if (scrollInterval !== undefined && Number.isFinite(Number(scrollInterval))) {
      const clamped = Math.min(60, Math.max(3, Math.round(Number(scrollInterval))));
      updatedInterval = await saveExpoScrollInterval(clamped);
    }

    revalidatePath("/");
    revalidatePath("/admin/settings/expo");

    return NextResponse.json({
      success: true,
      slides: updatedSlides,
      sponsors: updatedSponsors,
      scrollInterval: updatedInterval,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update expo settings" }, { status: 500 });
  }
}
