import { verifyPaymentReceipt } from "./payment-verification";

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EVT-${datePart}-${randomPart}`;
}

export async function resolvePaymentVerification(params: {
  paymentMethod: "TELEBIRR" | "CBE" | "PAY_AT_GATE";
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
