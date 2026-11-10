import { prisma } from "./prisma";

export type CookieSettings = {
  enabled: boolean;
  title: string;
  description: string;
  acceptAllLabel: string;
  rejectAllLabel: string;
  customizeLabel: string;
  privacyPolicyUrl: string;
  showAnalytics: boolean;
  showMarketing: boolean;
};

export const defaultCookieSettings: CookieSettings = {
  enabled: true,
  title: "We value your privacy",
  description:
    "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
  acceptAllLabel: "Accept All",
  rejectAllLabel: "Reject Non-Essential",
  customizeLabel: "Customize",
  privacyPolicyUrl: "/privacy",
  showAnalytics: true,
  showMarketing: true,
};

export async function getCookieSettings(): Promise<CookieSettings> {
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

export async function saveCookieSettings(
  settings: Partial<CookieSettings>
): Promise<CookieSettings> {
  const current = await getCookieSettings();
  const updated: CookieSettings = { ...current, ...settings };

  await prisma.siteSetting.upsert({
    where: { key: "cookies" },
    update: { value: JSON.stringify(updated) },
    create: { key: "cookies", value: JSON.stringify(updated) },
  });

  return updated;
}
