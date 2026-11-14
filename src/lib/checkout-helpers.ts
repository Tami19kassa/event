import { verifyPaymentReceipt } from "./payment-verification";

const DEFAULT_SERVER_PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
};

export type ValidatedOrderItem = {
  ticketTierId: string;
  ticketName: string;
  quantity: number;
  unitPrice: number;
};

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EVT-${datePart}-${randomPart}`;
}

export function calculatePromoDiscount(
  subtotal: number,
  promoCode?: string,
  settings?: { promoCode?: string; promoDiscountPercent?: number }
): { discountAmount: number; appliedPromo: string | null } {
  const code = (promoCode || "").trim().toUpperCase();
  if (!code || subtotal <= 0) {
    return { discountAmount: 0, appliedPromo: null };
  }

  let rate = 0;
  if (settings) {
    const validCode = (settings.promoCode || "").trim().toUpperCase();
    if (validCode && code === validCode) {
      rate =
        typeof settings.promoDiscountPercent === "number"
          ? Math.max(0, Math.min(100, settings.promoDiscountPercent)) / 100
          : 0.1;
    }
  } else {
    rate = DEFAULT_SERVER_PROMO_CODES[code] || 0;
  }

  if (rate <= 0) {
    return { discountAmount: 0, appliedPromo: null };
  }

  const discountAmount = Math.round(subtotal * rate * 100) / 100;
  return { discountAmount, appliedPromo: code };
}

export function validateCheckoutItems(
  items: any[],
  ticketTiers: Array<{ id: string; name: string; price: number; remaining: number }>
): { subtotal: number; totalTicketsCount: number; orderItems: ValidatedOrderItem[] } {
  let subtotal = 0;
  let totalTicketsCount = 0;
  const orderItems: ValidatedOrderItem[] = [];

  for (const item of items) {
    const qty = Number(item?.quantity);
    if (!item?.ticketTierId || !Number.isInteger(qty) || qty <= 0) continue;
    if (qty > 20) {
      throw new Error("Maximum 20 tickets per tier in one order.");
    }
    const tier = ticketTiers.find((t) => t.id === item.ticketTierId);
    if (!tier) {
      throw new Error(`Ticket tier "${item.ticketTierId}" does not exist`);
    }
    if (tier.remaining < qty) {
      throw new Error(`Only ${tier.remaining} ticket(s) remaining for "${tier.name}".`);
    }
    subtotal += Number(tier.price) * qty;
    totalTicketsCount += qty;
    orderItems.push({
      ticketTierId: tier.id,
      ticketName: tier.name,
      quantity: qty,
      unitPrice: Number(tier.price),
    });
  }

  if (orderItems.length === 0 || totalTicketsCount > 50) {
    throw new Error("Select between 1 and 50 valid tickets.");
  }

  return { subtotal, totalTicketsCount, orderItems };
}

export async function resolvePaymentVerification(params: {
  paymentMethod: "TELEBIRR" | "CBE" | "PAY_AT_GATE" | "FREE";
  totalAmount: number;
  receiptUrl: string;
}): Promise<{
  status: "COMPLETED" | "PENDING_VERIFICATION" | "RESERVED_PAY_AT_GATE";
  transactionRef: string;
  message: string;
}> {
  const { paymentMethod, totalAmount, receiptUrl } = params;

  if (totalAmount <= 0) {
    return {
      status: "COMPLETED",
      transactionRef: `FREE-${Date.now().toString(36).toUpperCase()}`,
      message: "Free pass confirmed.",
    };
  }

  if (paymentMethod === "FREE") {
    throw new Error("Paid tickets require Telebirr, CBE, or Pay at Gate.");
  }

  if (paymentMethod === "PAY_AT_GATE") {
    return {
      status: "RESERVED_PAY_AT_GATE",
      transactionRef: `GATE-${Date.now().toString(36).toUpperCase()}`,
      message: "Reservation confirmed. Please pay at the event gate on arrival.",
    };
  }

  if (!receiptUrl.trim()) {
    throw new Error(
      `Please provide your ${paymentMethod === "TELEBIRR" ? "Telebirr" : "CBE"} transaction receipt URL or code.`
    );
  }

  const verifyRes = await verifyPaymentReceipt(paymentMethod, receiptUrl, totalAmount);
  if (!verifyRes.success) {
    throw new Error(verifyRes.message || "Invalid or duplicate receipt reference.");
  }

  return {
    status: verifyRes.status as any,
    transactionRef: verifyRes.transactionRef,
    message: verifyRes.message,
  };
}
