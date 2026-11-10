export interface DailyOrderPoint {
  dateKey: string;
  label: string;
  orders: number;
  revenue: number;
  verifiedRevenue: number;
}

export interface PaymentChannelSlice {
  key: "TELEBIRR" | "CBE" | "PAY_AT_GATE" | "FREE";
  label: string;
  count: number;
  amount: number;
}

export function buildDailySeries(
  rows: Array<{ createdAt: Date; totalAmount: number; status: string }>,
  days = 14
): DailyOrderPoint[] {
  const buckets = new Map<string, DailyOrderPoint>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    buckets.set(key, { dateKey: key, label, orders: 0, revenue: 0, verifiedRevenue: 0 });
  }

  for (const row of rows) {
    if (row.status === "CANCELLED" || row.status === "FAILED") continue;
    const key = new Date(row.createdAt).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.revenue += row.totalAmount || 0;
    if (row.status === "COMPLETED") {
      bucket.verifiedRevenue += row.totalAmount || 0;
    }
  }

  return Array.from(buckets.values());
}

export function buildPaymentMix(
  rows: Array<{ paymentMethod: string | null; totalAmount: number; status: string }>
): PaymentChannelSlice[] {
  const map: Record<PaymentChannelSlice["key"], PaymentChannelSlice> = {
    TELEBIRR: { key: "TELEBIRR", label: "Telebirr", count: 0, amount: 0 },
    CBE: { key: "CBE", label: "CBE Bank", count: 0, amount: 0 },
    PAY_AT_GATE: { key: "PAY_AT_GATE", label: "Pay at Gate", count: 0, amount: 0 },
    FREE: { key: "FREE", label: "Free Pass", count: 0, amount: 0 },
  };

  for (const r of rows) {
    if (r.status === "CANCELLED" || r.status === "FAILED") continue;
    const raw = (r.paymentMethod || "TELEBIRR").toUpperCase();
    const key: PaymentChannelSlice["key"] =
      raw === "CBE" || raw === "PAY_AT_GATE" || raw === "FREE" ? raw : "TELEBIRR";
    map[key].count += 1;
    map[key].amount += r.totalAmount || 0;
  }

  return Object.values(map);
}
