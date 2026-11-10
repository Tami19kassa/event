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

async function fetchThemeSettingsStrict(): Promise<ThemeSettings> {
  let setting = null;
  try {
    setting = await prisma.siteSetting.findUnique({
      where: { key: "theme" },
    });
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 150));
    setting = await prisma.siteSetting.findUnique({
      where: { key: "theme" },
    });
  }

  if (!setting?.value) {
    return defaultThemeSettings;
  }

  try {
    return {
      ...defaultThemeSettings,
      ...pickThemeFields(JSON.parse(setting.value)),
    };
  } catch (err) {
    console.error("Invalid stored theme JSON, falling back to defaults:", err);
    return defaultThemeSettings;
  }
}

export const getLiveThemeSettings = cache(async (): Promise<ThemeSettings> => {
  try {
    return await fetchThemeSettingsStrict();
  } catch (err) {
    console.error("Failed to load live theme settings:", err);
    return defaultThemeSettings;
  }
});

const getCachedThemeSettings = unstable_cache(
  fetchThemeSettingsStrict,
  ["site-setting-theme"],
  { tags: [CACHE_TAGS.theme], revalidate: 300 }
);

export const getThemeSettings = cache(async (): Promise<ThemeSettings> => {
  try {
    return await getCachedThemeSettings();
  } catch (err) {
    console.error("Failed to load cached theme settings:", err);
    return defaultThemeSettings;
  }
});

export async function saveThemeSettings(
  settings: Partial<ThemeSettings>
): Promise<ThemeSettings> {
  const current = await fetchThemeSettingsStrict();
  const updated = { ...current, ...pickThemeFields(settings) };

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: JSON.stringify(updated) },
    create: { key: "theme", value: JSON.stringify(updated) },
  });

  revalidateCacheTags(CACHE_TAGS.theme);
  return updated;
}
