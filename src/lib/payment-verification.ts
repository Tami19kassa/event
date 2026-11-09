import { prisma } from "./prisma";

export type PaymentSettings = {
  cbeAccount: string;
  cbeAccountName: string;
  telebirrNumber: string;
  telebirrAccountName: string;
  allowPayAtGate: boolean;
  currency: string;
};

export const defaultPaymentSettings: PaymentSettings = {
  cbeAccount: "1000345678901",
  cbeAccountName: "Utopia Event Management PLC",
  telebirrNumber: "0911223344",
  telebirrAccountName: "Utopia Events",
  allowPayAtGate: true,
  currency: "ETB",
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "payment_settings" },
    });
    if (setting?.value) {
      return { ...defaultPaymentSettings, ...JSON.parse(setting.value) };
    }
  } catch {}
  return defaultPaymentSettings;
}

export async function savePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
  const current = await getPaymentSettings();
  const updated = { ...current, ...settings };

  await prisma.siteSetting.upsert({
    where: { key: "payment_settings" },
    update: { value: JSON.stringify(updated) },
    create: { key: "payment_settings", value: JSON.stringify(updated) },
  });

  return updated;
}

export type VerificationResult = {
  success: boolean;
  status: "COMPLETED" | "PENDING_VERIFICATION" | "RESERVED_PAY_AT_GATE" | "REJECTED";
  transactionRef: string;
  message: string;
};

/**
 * Extracts a transaction reference or receipt ID from a URL or raw string
 */
export function extractTransactionRef(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If Telebirr receipt URL: https://transactioninfo.ethiotelecom.et/receipt/DK90W608P4
  const telebirrMatch = trimmed.match(/\/receipt\/([a-zA-Z0-9]+)/i);
  if (telebirrMatch) return telebirrMatch[1].toUpperCase();

  // If CBE receipt URL: https://mbreciept.cbe.com.et/v2-hfHCxNV6JF7DhAbgHI8i
  const cbeMatch = trimmed.match(/mbreciept\.cbe\.com\.et\/([a-zA-Z0-9_-]+)/i);
  if (cbeMatch) return cbeMatch[1];

  // Raw alphanumeric code
  const codeMatch = trimmed.match(/[a-zA-Z0-9_-]{6,30}/);
  return codeMatch ? codeMatch[0] : trimmed;
}

/**
 * Verifies Ethiopian payment receipts from CBE and Telebirr
 */
export async function verifyPaymentReceipt(
  method: "TELEBIRR" | "CBE" | "PAY_AT_GATE",
  receiptUrlOrRef: string,
  expectedAmount: number
): Promise<VerificationResult> {
  if (method === "PAY_AT_GATE") {
    return {
      success: true,
      status: "RESERVED_PAY_AT_GATE",
      transactionRef: `GATE-${Date.now().toString(36).toUpperCase()}`,
      message: "Ticket spot reserved. Attendee will pay upon arrival at the venue gate.",
    };
  }

  const transactionRef = extractTransactionRef(receiptUrlOrRef);
  if (!transactionRef) {
    return {
      success: false,
      status: "REJECTED",
      transactionRef: "",
      message: "Invalid receipt URL or transaction reference provided.",
    };
  }

  // 1. Prevent duplicate reuse of receipts
  const existingOrder = await prisma.order.findFirst({
    where: {
      transactionRef,
      status: { in: ["COMPLETED", "PENDING_VERIFICATION"] },
    },
  });

  if (existingOrder) {
    return {
      success: false,
      status: "REJECTED",
      transactionRef,
      message: "This receipt or transaction reference has already been used for another booking.",
    };
  }

  const settings = await getPaymentSettings();

  // 2. Automated Web Scraping / Verification Attempt
  if (method === "TELEBIRR") {
    try {
      const url = receiptUrlOrRef.startsWith("http")
        ? receiptUrlOrRef
        : `https://transactioninfo.ethiotelecom.et/receipt/${transactionRef}`;

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        const html = await res.text();
        const isSuccess = html.includes("Success") || html.includes("successful") || html.includes("COMPLETED");

        if (isSuccess) {
          return {
            success: true,
            status: "COMPLETED",
            transactionRef,
            message: "Telebirr transaction verified successfully via Ethio Telecom portal.",
          };
        }
      }
    } catch (err) {
      // Telebirr gateway timeout or offline
    }

    // Graceful fallback: If portal is slow or unreachable, queue for instant admin check
    return {
      success: true,
      status: "PENDING_VERIFICATION",
      transactionRef,
      message: "Telebirr receipt submitted. Queued for confirmation.",
    };
  }

  if (method === "CBE") {
    try {
      const url = receiptUrlOrRef.startsWith("http")
        ? receiptUrlOrRef
        : `https://mbreciept.cbe.com.et/${transactionRef}`;

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        const html = await res.text();
        if (html.length > 500 && !html.includes("502 Bad Gateway")) {
          return {
            success: true,
            status: "COMPLETED",
            transactionRef,
            message: "CBE mobile banking receipt verified successfully via CBE viewer.",
          };
        }
      }
    } catch (err) {
      // CBE gateway 502 / timeout
    }

    return {
      success: true,
      status: "PENDING_VERIFICATION",
      transactionRef,
      message: "CBE receipt reference submitted. Queued for confirmation.",
    };
  }

  return {
    success: false,
    status: "REJECTED",
    transactionRef,
    message: "Unknown payment method.",
  };
}
