import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { defaultPaymentSettings, type PaymentSettings } from "./payment-types";

export { defaultPaymentSettings, type PaymentSettings };

async function fetchPublicPaymentSettingsStrict(): Promise<PaymentSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "payment_settings" } });
  if (!setting?.value) return defaultPaymentSettings;
  try {
    return { ...defaultPaymentSettings, ...JSON.parse(setting.value) };
  } catch {
    return defaultPaymentSettings;
  }
}

const getCachedPaymentSettings = unstable_cache(
  fetchPublicPaymentSettingsStrict,
  ["site-setting-payments"],
  { tags: [CACHE_TAGS.payments], revalidate: 300 }
);

export const getPublicPaymentSettings = cache(async (): Promise<PaymentSettings> => {
  try {
    return await getCachedPaymentSettings();
  } catch {
    return defaultPaymentSettings;
  }
});
