import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { revalidateCacheTags } from "./cache-revalidate";
import { defaultCookieSettings, type CookieSettings } from "./cookie-types";

export { defaultCookieSettings, type CookieSettings };

async function readCookieSettingsFromDb(): Promise<CookieSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "cookies" } });
    if (setting?.value) {
      return { ...defaultCookieSettings, ...JSON.parse(setting.value) };
    }
  } catch {
    // Fallback to defaults if DB unreachable
  }
  return defaultCookieSettings;
}

const getCachedCookieSettings = unstable_cache(
  readCookieSettingsFromDb,
  ["site-setting-cookies"],
  { tags: [CACHE_TAGS.cookies], revalidate: 300 }
);

export const getCookieSettings = cache(getCachedCookieSettings);

export async function saveCookieSettings(
  settings: Partial<CookieSettings>
): Promise<CookieSettings> {
  const current = await readCookieSettingsFromDb();
  const updated: CookieSettings = { ...current, ...settings };

  await prisma.siteSetting.upsert({
    where: { key: "cookies" },
    update: { value: JSON.stringify(updated) },
    create: { key: "cookies", value: JSON.stringify(updated) },
  });

  revalidateCacheTags(CACHE_TAGS.cookies);
  return updated;
}
