import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { revalidateCacheTags } from "./cache-revalidate";
import { HeroSlide, SponsorItem } from "./expo-types";
import { defaultExpoSlides, defaultSponsors } from "./expo-defaults";

export * from "./expo-types";
export * from "./expo-defaults";

async function readExpoSlidesFromDb(): Promise<HeroSlide[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_hero_slides" } });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((slide: HeroSlide) =>
          slide.videoUrl?.includes("dQw4w9WgXcQ")
            ? { ...slide, mediaType: "image" as const, videoUrl: undefined }
            : slide
        );
      }
    }
  } catch {}
  return defaultExpoSlides;
}

export const getExpoSlides = cache(
  unstable_cache(readExpoSlidesFromDb, ["expo-hero-slides"], {
    tags: [CACHE_TAGS.expo],
    revalidate: 120,
  })
);

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

async function readSponsorsFromDb(): Promise<SponsorItem[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_sponsors" } });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultSponsors;
}

export const getSponsors = cache(
  unstable_cache(readSponsorsFromDb, ["expo-sponsors"], {
    tags: [CACHE_TAGS.expo],
    revalidate: 120,
  })
);

export async function saveSponsors(sponsors: SponsorItem[]): Promise<SponsorItem[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_sponsors" },
    update: { value: JSON.stringify(sponsors) },
    create: { key: "expo_sponsors", value: JSON.stringify(sponsors) },
  });
  revalidateCacheTags(CACHE_TAGS.expo);
  return sponsors;
}

async function readExpoScrollIntervalFromDb(): Promise<number> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_scroll_interval" } });
    if (setting?.value) {
      const val = Number(setting.value);
      if (!isNaN(val) && val >= 3) return val;
    }
  } catch {}
  return 7;
}

export const getExpoScrollInterval = cache(
  unstable_cache(readExpoScrollIntervalFromDb, ["expo-scroll-interval"], {
    tags: [CACHE_TAGS.expo],
    revalidate: 120,
  })
);

export async function saveExpoScrollInterval(seconds: number): Promise<number> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_scroll_interval" },
    update: { value: String(seconds) },
    create: { key: "expo_scroll_interval", value: String(seconds) },
  });
  revalidateCacheTags(CACHE_TAGS.expo);
  return seconds;
}
