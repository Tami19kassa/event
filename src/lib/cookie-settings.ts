import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma, withDbRetry } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { revalidateCacheTags } from "./cache-revalidate";
import { defaultCookieSettings, type CookieSettings } from "./cookie-types";

export { defaultCookieSettings, type CookieSettings };

async function fetchCookieSettingsStrict(): Promise<CookieSettings> {
  const setting = await withDbRetry(() =>
    prisma.siteSetting.findUnique({ where: { key: "cookies" } })
  );
  if (!setting?.value) return defaultCookieSettings;
  try {
    return { ...defaultCookieSettings, ...JSON.parse(setting.value) };
  } catch {
    return defaultCookieSettings;
  }
}

export const getLiveCookieSettings = cache(async (): Promise<CookieSettings> => {
  try {
    return await fetchCookieSettingsStrict();
  } catch {
    return defaultCookieSettings;
  }
});

const getCachedCookieSettings = unstable_cache(
  fetchCookieSettingsStrict,
  ["site-setting-cookies"],
  { tags: [CACHE_TAGS.cookies], revalidate: 300 }
);

export const getCookieSettings = cache(async (): Promise<CookieSettings> => {
  try {
    return await getCachedCookieSettings();
  } catch {
    return defaultCookieSettings;
  }
});

export async function saveCookieSettings(
  settings: Partial<CookieSettings>
): Promise<CookieSettings> {
  const current = await fetchCookieSettingsStrict();
  const updated: CookieSettings = { ...current, ...settings };

  await withDbRetry(() =>
    prisma.siteSetting.upsert({
      where: { key: "cookies" },
      update: { value: JSON.stringify(updated) },
      create: { key: "cookies", value: JSON.stringify(updated) },
    })
  );

  revalidateCacheTags(CACHE_TAGS.cookies);
  return updated;
}
