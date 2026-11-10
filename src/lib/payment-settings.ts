import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { defaultPaymentSettings, type PaymentSettings } from "./payment-types";

export { defaultPaymentSettings, type PaymentSettings };

async function readPublicPaymentSettings(): Promise<PaymentSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "payment_settings" } });
    if (setting?.value) {
      return { ...defaultPaymentSettings, ...JSON.parse(setting.value) };
    }
  } catch {
    // Fallback to defaults if DB unavailable
  }
  return defaultPaymentSettings;
}

const getCachedPaymentSettings = unstable_cache(
  readPublicPaymentSettings,
  ["site-setting-payments"],
  { tags: [CACHE_TAGS.payments], revalidate: 300 }
);

export const getPublicPaymentSettings = cache(getCachedPaymentSettings);
