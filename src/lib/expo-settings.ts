import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { revalidateCacheTags } from "./cache-revalidate";
import { HeroSlide, SponsorItem } from "./expo-types";
import { defaultExpoSlides, defaultSponsors } from "./expo-defaults";

export * from "./expo-types";
export * from "./expo-defaults";

async function fetchExpoSlidesStrict(): Promise<HeroSlide[]> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_hero_slides" } });
  if (!setting?.value) return defaultExpoSlides;
  try {
    const parsed = JSON.parse(setting.value);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((slide: HeroSlide) =>
        slide.videoUrl?.includes("dQw4w9WgXcQ")
          ? { ...slide, mediaType: "image" as const, videoUrl: undefined }
          : slide
      );
    }
  } catch {}
  return defaultExpoSlides;
}

const getCachedExpoSlides = unstable_cache(fetchExpoSlidesStrict, ["expo-hero-slides"], {
  tags: [CACHE_TAGS.expo],
  revalidate: 120,
});

export const getExpoSlides = cache(async (): Promise<HeroSlide[]> => {
  try {
    return await getCachedExpoSlides();
  } catch {
    return defaultExpoSlides;
  }
});

export const getExpoSlideById = cache(async (id: string): Promise<HeroSlide | null> => {
  const slides = await getExpoSlides();
  return slides.find((s) => s.id === id) || null;
});

export async function saveExpoSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_hero_slides" },
    update: { value: JSON.stringify(slides) },
    create: { key: "expo_hero_slides", value: JSON.stringify(slides) },
  });
  revalidateCacheTags(CACHE_TAGS.expo);
  return slides;
}

async function fetchSponsorsStrict(): Promise<SponsorItem[]> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_sponsors" } });
  if (!setting?.value) return defaultSponsors;
  try {
    const parsed = JSON.parse(setting.value);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return defaultSponsors;
}

const getCachedSponsors = unstable_cache(fetchSponsorsStrict, ["expo-sponsors"], {
  tags: [CACHE_TAGS.expo],
  revalidate: 120,
});

export const getSponsors = cache(async (): Promise<SponsorItem[]> => {
  try {
    return await getCachedSponsors();
  } catch {
    return defaultSponsors;
  }
});

export async function saveSponsors(sponsors: SponsorItem[]): Promise<SponsorItem[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_sponsors" },
    update: { value: JSON.stringify(sponsors) },
    create: { key: "expo_sponsors", value: JSON.stringify(sponsors) },
  });
  revalidateCacheTags(CACHE_TAGS.expo);
  return sponsors;
}

async function fetchExpoScrollIntervalStrict(): Promise<number> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_scroll_interval" } });
  if (!setting?.value) return 7;
  const val = Number(setting.value);
  return !isNaN(val) && val >= 3 ? val : 7;
}

const getCachedExpoScrollInterval = unstable_cache(
  fetchExpoScrollIntervalStrict,
  ["expo-scroll-interval"],
  { tags: [CACHE_TAGS.expo], revalidate: 120 }
);

export const getExpoScrollInterval = cache(async (): Promise<number> => {
  try {
    return await getCachedExpoScrollInterval();
  } catch {
    return 7;
  }
});

export async function saveExpoScrollInterval(seconds: number): Promise<number> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_scroll_interval" },
    update: { value: String(seconds) },
    create: { key: "expo_scroll_interval", value: String(seconds) },
  });
  revalidateCacheTags(CACHE_TAGS.expo);
  return seconds;
}
