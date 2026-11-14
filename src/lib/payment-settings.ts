import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma, withDbRetry } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import { defaultPaymentSettings, type PaymentSettings } from "./payment-types";

export { defaultPaymentSettings, type PaymentSettings };

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const setting = await withDbRetry(() =>
      prisma.siteSetting.findUnique({ where: { key: "payment_settings" } })
    );
    if (setting?.value) {
      return { ...defaultPaymentSettings, ...JSON.parse(setting.value) };
    }
  } catch {}
  return defaultPaymentSettings;
}

export function sanitizePaymentUpdate(
  input: Partial<PaymentSettings>,
  current: PaymentSettings
): PaymentSettings {
  const cleanStr = (val: unknown, fallback: string, maxLen: number) =>
    typeof val === "string" && val.trim() ? val.trim().slice(0, maxLen) : fallback;

  const rawCurrency =
    typeof input.currency === "string"
      ? input.currency.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5)
      : current.currency;

  const rawPromoCode =
    typeof input.promoCode === "string"
      ? input.promoCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 20)
      : current.promoCode ?? "";

  let rawDiscountPercent = current.promoDiscountPercent ?? 0;
  if (typeof input.promoDiscountPercent === "number" && !Number.isNaN(input.promoDiscountPercent)) {
    rawDiscountPercent = Math.max(0, Math.min(100, Math.round(input.promoDiscountPercent)));
  } else if (typeof input.promoDiscountPercent === "string" && input.promoDiscountPercent !== "") {
    const parsed = Number(input.promoDiscountPercent);
    if (!Number.isNaN(parsed)) {
      rawDiscountPercent = Math.max(0, Math.min(100, Math.round(parsed)));
    }
  }

  return {
    cbeAccount: cleanStr(input.cbeAccount, current.cbeAccount, 40),
    cbeAccountName: cleanStr(input.cbeAccountName, current.cbeAccountName, 120),
    telebirrNumber: cleanStr(input.telebirrNumber, current.telebirrNumber, 40),
    telebirrAccountName: cleanStr(input.telebirrAccountName, current.telebirrAccountName, 120),
    allowPayAtGate:
      typeof input.allowPayAtGate === "boolean" ? input.allowPayAtGate : current.allowPayAtGate,
    currency: rawCurrency.length >= 3 ? rawCurrency : current.currency || "ETB",
    promoCode: rawPromoCode,
    promoDiscountPercent: rawDiscountPercent,
  };
}

export async function savePaymentSettings(
  settings: Partial<PaymentSettings>
): Promise<PaymentSettings> {
  const current = await getPaymentSettings();
  const updated = sanitizePaymentUpdate(settings, current);
  await withDbRetry(() =>
    prisma.siteSetting.upsert({
      where: { key: "payment_settings" },
      update: { value: JSON.stringify(updated) },
      create: { key: "payment_settings", value: JSON.stringify(updated) },
    })
  );
  return updated;
}

const getCachedPaymentSettings = unstable_cache(
  getPaymentSettings,
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
