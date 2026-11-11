export type OrderStatusFilter =
  | "ALL"
  | "PENDING_VERIFICATION"
  | "RESERVED_PAY_AT_GATE"
  | "COMPLETED"
  | "CHECKED_IN"
  | "UNCHECKED"
  | "CANCELLED";

export interface AdminOrderItemRow {
  id: string;
  ticketTierId: string | null;
  ticketName: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  eventId: string;
  status: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  paymentMethod: string | null;
  receiptUrl: string | null;
  transactionRef: string | null;
  verifiedAt: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
  event: { id: string; title: string; slug: string; startDate: string } | null;
  items: AdminOrderItemRow[];
}

export interface AdminOrderEventOption {
  id: string;
  title: string;
  startDate: string;
}

export interface AdminOrderSummary {
  totalCount: number;
  verifiedRevenue: number;
  completedCount: number;
  pendingReceiptsCount: number;
  gatePendingCount: number;
  gatePendingRevenue: number;
  checkedInCount: number;
  activePassesCount: number;
  cancelledCount: number;
}

const RELEASED_STATUSES = new Set(["CANCELLED", "FAILED", "REJECTED"]);

export function isReleasedStatus(status: string): boolean {
  return RELEASED_STATUSES.has(status.toUpperCase());
}

export function extractOrderNumber(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    if (trimmed.includes("://")) {
      const q = new URL(trimmed).searchParams.get("scan");
      if (q) return q.trim().toUpperCase();
    }
  } catch {}
  const match = trimmed.match(/EVT-[A-Z0-9-]+/i);
  return (match ? match[0] : trimmed).toUpperCase();
}

export function isSafeHttpUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function filterAdminOrders(
  orders: AdminOrderRow[],
  options: { search: string; statusFilter: OrderStatusFilter; eventId: string }
): AdminOrderRow[] {
  const q = options.search.trim().toLowerCase();
  const statusFilter = options.statusFilter.toUpperCase();
  const eventId = options.eventId;

  return orders.filter((o) => {
    if (eventId !== "ALL" && o.eventId !== eventId) return false;

    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
      (o.transactionRef && o.transactionRef.toLowerCase().includes(q)) ||
      (o.event?.title && o.event.title.toLowerCase().includes(q)) ||
      o.items.some((it) => it.ticketName.toLowerCase().includes(q));

    if (!matchSearch) return false;

    const s = o.status.toUpperCase();
    if (statusFilter === "ALL") return true;
    if (statusFilter === "CHECKED_IN") return o.checkedIn;
    if (statusFilter === "UNCHECKED") return !o.checkedIn && !RELEASED_STATUSES.has(s);
    if (statusFilter === "CANCELLED") return RELEASED_STATUSES.has(s);
    return s === statusFilter;
  });
}

export function findScannedOrder(orders: AdminOrderRow[], scanCode: string): AdminOrderRow | null {
  const q = scanCode.trim().toUpperCase();
  if (!q) return null;
  const digits = q.replace(/\s+/g, "");
  return (
    orders.find((o) => o.orderNumber.toUpperCase() === q) ||
    orders.find((o) => (o.transactionRef || "").toUpperCase() === q) ||
    orders.find((o) => (o.customerPhone || "").replace(/\s+/g, "").endsWith(digits)) ||
    null
  );
}

export function downloadOrdersCsvFile(orders: AdminOrderRow[], fallbackCurrency: string) {
  const blob = new Blob([buildOrdersCsv(orders, fallbackCurrency)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatAdminOrderTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Addis_Ababa",
    });
  } catch {
    return iso;
  }
}

function escapeCsvCell(val: unknown): string {
  let str = val == null ? "" : String(val);
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function buildOrdersCsv(orders: AdminOrderRow[], fallbackCurrency: string): string {
  const headers = [
    "Order #", "Date", "Attendee", "Email", "Phone", "Event",
    "Tickets", "Method", "Status", "Total", "Currency", "Transaction Ref", "Checked In", "Checked In At",
  ];
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const o of orders) {
    const tickets = o.items.map((i) => `${i.quantity}x ${i.ticketName}`).join("; ");
    lines.push([
      o.orderNumber, o.createdAt, o.customerName || "Guest", o.customerEmail,
      o.customerPhone || "", o.event?.title || "", tickets, o.paymentMethod || "",
      o.status, o.totalAmount, o.currency || fallbackCurrency, o.transactionRef || "",
      o.checkedIn ? "YES" : "NO", o.checkedInAt || "",
    ].map(escapeCsvCell).join(","));
  }
  return lines.join("\r\n");
}
