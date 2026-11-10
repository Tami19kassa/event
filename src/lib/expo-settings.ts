import { prisma } from "./prisma";
import { HeroSlide, SponsorItem } from "./expo-types";
import { defaultExpoSlides, defaultSponsors } from "./expo-defaults";

export * from "./expo-types";
export * from "./expo-defaults";

export async function getExpoSlides(): Promise<HeroSlide[]> {
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

export async function getExpoSlideById(id: string): Promise<HeroSlide | null> {
  const slides = await getExpoSlides();
  return slides.find((s) => s.id === id) || null;
}

export async function saveExpoSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_hero_slides" },
    update: { value: JSON.stringify(slides) },
    create: { key: "expo_hero_slides", value: JSON.stringify(slides) },
  });
  return slides;
}

export async function getSponsors(): Promise<SponsorItem[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_sponsors" } });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultSponsors;
}

export async function saveSponsors(sponsors: SponsorItem[]): Promise<SponsorItem[]> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_sponsors" },
    update: { value: JSON.stringify(sponsors) },
    create: { key: "expo_sponsors", value: JSON.stringify(sponsors) },
  });
  return sponsors;
}

export async function getExpoScrollInterval(): Promise<number> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "expo_scroll_interval" } });
    if (setting?.value) {
      const val = Number(setting.value);
      if (!isNaN(val) && val >= 3) return val;
    }
  } catch {}
  return 7;
}

export async function saveExpoScrollInterval(seconds: number): Promise<number> {
  await prisma.siteSetting.upsert({
    where: { key: "expo_scroll_interval" },
    update: { value: String(seconds) },
    create: { key: "expo_scroll_interval", value: String(seconds) },
  });
  return seconds;
}
