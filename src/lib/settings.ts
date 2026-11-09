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
  heroStyle: "image" | "gradient" | "solid";
  heroMediaType?: "image" | "video";
  heroVideoUrl?: string | null;
  heroPosterUrl?: string | null;
  heroBadgeText?: string | null;
  heroTitle?: string | null;
  heroTitleHighlight?: string | null;
  heroSubtitle?: string | null;
  heroSearchPlaceholder?: string | null;
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
  gradientTo: "#7C3AED",
  gradientDirection: "to-br",
  borderRadius: "xl",
  buttonStyle: "filled",
  heroStyle: "gradient",
  heroMediaType: "image",
  heroVideoUrl: "",
  heroPosterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600",
  heroBadgeText: "Live Visual Atmosphere",
  heroTitle: "Discover Events That Inspire You",
  heroTitleHighlight: "Inspire",
  heroSubtitle:
    "From tech summits at Millennium Hall to cultural concerts at Friendship Park — explore the vibrant pulse of Addis Ababa.",
  heroSearchPlaceholder: "Search events in Addis Ababa, venues, categories...",
};

export async function getThemeSettings(): Promise<ThemeSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "theme" },
    });

    if (setting?.value) {
      return { ...defaultThemeSettings, ...JSON.parse(setting.value) };
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
  const updated = { ...current, ...settings };

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: JSON.stringify(updated) },
    create: { key: "theme", value: JSON.stringify(updated) },
  });

  return updated;
}
