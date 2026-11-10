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
    const setting = await prisma.siteSetting.findUnique({ where: { key: "payment_settings" } });
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

export function extractTransactionRef(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  const telebirrMatch = trimmed.match(/\/receipt\/([a-zA-Z0-9_-]+)/i);
  if (telebirrMatch) return telebirrMatch[1].toUpperCase();
  const cbeMatch = trimmed.match(/mbreciept\.cbe\.com\.et\/([a-zA-Z0-9_-]+)/i);
  if (cbeMatch) return cbeMatch[1];
  const codeMatch = trimmed.match(/^[a-zA-Z0-9_-]{8,40}$/);
  return codeMatch ? codeMatch[0] : "";
}

function buildSafeReceiptUrl(method: "TELEBIRR" | "CBE", rawInput: string, ref: string): string {
  const trimmed = rawInput.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (method === "TELEBIRR" && host !== "transactioninfo.ethiotelecom.et") {
      throw new Error("Invalid Telebirr URL domain. Use transactioninfo.ethiotelecom.et or paste the receipt ID.");
    }
    if (method === "CBE" && !["mbreciept.cbe.com.et", "mb.cbe.com.et", "apps.cbe.com.et"].includes(host)) {
      throw new Error("Invalid CBE receipt domain. Use an official CBE receipt link or paste the reference ID.");
    }
  }
  return method === "TELEBIRR"
    ? `https://transactioninfo.ethiotelecom.et/receipt/${encodeURIComponent(ref)}`
    : `https://mbreciept.cbe.com.et/${encodeURIComponent(ref)}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ");
}

function receiptMatchesAmountAndReceiver(text: string, expectedAmount: number, account: string): boolean {
  const cleanAccount = account.replace(/\D/g, "");
  const suffix = cleanAccount.length >= 4 ? cleanAccount.slice(-Math.min(8, cleanAccount.length)) : "";
  const last4 = cleanAccount.slice(-4);
  const digitsOnlyText = text.replace(/\D/g, "");
  const accountMatch = Boolean(suffix && (digitsOnlyText.includes(suffix) || text.includes(last4)));

  const numRegex = /(?:^|[^0-9.])(\d[\d,]*(?:\.\d{1,2})?)(?=[^0-9.]|$)/g;
  let amountMatch = false;
  let m: RegExpExecArray | null;
  while ((m = numRegex.exec(text)) !== null) {
    const val = parseFloat(m[1].replace(/,/g, ""));
    if (!Number.isNaN(val) && Math.abs(val - expectedAmount) < 0.01) {
      amountMatch = true;
      break;
    }
  }
  return accountMatch && amountMatch;
}

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
      message: "Invalid receipt URL or transaction code (minimum 8 alphanumeric characters required).",
    };
  }

  let safeUrl: string;
  try {
    safeUrl = buildSafeReceiptUrl(method, receiptUrlOrRef, transactionRef);
  } catch (err: any) {
    return { success: false, status: "REJECTED", transactionRef, message: err.message };
  }

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
  const targetAccount = method === "TELEBIRR" ? settings.telebirrNumber : settings.cbeAccount;

  try {
    const res = await fetch(safeUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: AbortSignal.timeout(4500),
    });

    if (res.ok) {
      const html = await res.text();
      if (!html.includes("502 Bad Gateway")) {
        const plainText = stripHtml(html);
        const settled = /\b(completed|successful|success|settled)\b/i.test(plainText);
        if (settled && receiptMatchesAmountAndReceiver(plainText, expectedAmount, targetAccount)) {
          return {
            success: true,
            status: "COMPLETED",
            transactionRef,
            message: `${method === "TELEBIRR" ? "Telebirr" : "CBE"} transaction amount and receiver verified.`,
          };
        }
      }
    }
  } catch {
    // External bank viewer timeout or temporary outage — queue for admin verification
  }

  return {
    success: true,
    status: "PENDING_VERIFICATION",
    transactionRef,
    message: `${method === "TELEBIRR" ? "Telebirr" : "CBE"} receipt submitted and queued for admin verification.`,
  };
}
