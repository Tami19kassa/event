import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { revalidateCacheTags } from "./cache-revalidate";
import {
  defaultThemeSettings,
  pickThemeFields,
  type ThemeSettings,
} from "./theme-types";

export { defaultThemeSettings, type ThemeSettings };

async function readThemeSettingsFromDb(): Promise<ThemeSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "theme" },
    });

    if (setting?.value) {
      return { ...defaultThemeSettings, ...pickThemeFields(JSON.parse(setting.value)) };
    }
  } catch {
    // DB not ready yet
  }
  return defaultThemeSettings;
}

const getCachedThemeSettings = unstable_cache(
  readThemeSettingsFromDb,
  ["site-setting-theme"],
  { tags: [CACHE_TAGS.theme], revalidate: 300 }
);

export const getThemeSettings = cache(getCachedThemeSettings);

export async function saveThemeSettings(
  settings: Partial<ThemeSettings>
): Promise<ThemeSettings> {
  const current = await readThemeSettingsFromDb();
  const updated = { ...current, ...pickThemeFields(settings) };

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: JSON.stringify(updated) },
    create: { key: "theme", value: JSON.stringify(updated) },
  });

  revalidateCacheTags(CACHE_TAGS.theme);
  return updated;
}
