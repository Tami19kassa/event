import { prisma } from "./prisma";

export type ThemeSettings = {
  siteName: string;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeType: "solid" | "gradient";
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  buttonStyle: "filled" | "soft" | "outline";
};

export const defaultThemeSettings: ThemeSettings = {
  siteName: "Utopia",
  logoUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  primaryColor: "#4F46E5",
  secondaryColor: "#0D9488",
  accentColor: "#F59E0B",
  themeType: "solid",
  gradientFrom: "#4F46E5",
  gradientTo: "#0D9488",
  gradientDirection: "to-br",
  borderRadius: "xl",
  buttonStyle: "filled",
};

function pickThemeFields(raw: Partial<ThemeSettings>): Partial<ThemeSettings> {
  const keys: Array<keyof ThemeSettings> = [
    "siteName", "logoUrl", "logoDarkUrl", "faviconUrl",
    "primaryColor", "secondaryColor", "accentColor",
    "themeType", "gradientFrom", "gradientTo", "gradientDirection",
    "borderRadius", "buttonStyle",
  ];
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (raw[k] !== undefined) out[k] = raw[k];
  }
  return out as Partial<ThemeSettings>;
}

export async function getThemeSettings(): Promise<ThemeSettings> {
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

export async function saveThemeSettings(
  settings: Partial<ThemeSettings>
): Promise<ThemeSettings> {
  const current = await getThemeSettings();
  const updated = { ...current, ...pickThemeFields(settings) };

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: JSON.stringify(updated) },
    create: { key: "theme", value: JSON.stringify(updated) },
  });

  return updated;
}
