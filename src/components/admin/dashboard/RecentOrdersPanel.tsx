import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";

export type RecentOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string | null;
  totalAmount: number;
  currency: string;
  customerName: string | null;
  checkedIn: boolean;
  createdAt: Date | string;
  event?: { title: string; slug: string } | null;
  items?: { quantity: number }[];
};

function getOrderStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "COMPLETED":
      return { label: "Verified Paid", className: "theme-badge-secondary border" };
    case "PENDING_VERIFICATION":
      return { label: "Needs Review", className: "theme-badge border" };
    case "RESERVED_PAY_AT_GATE":
      return { label: "Gate Reserved", className: "theme-badge-accent border" };
    case "PENDING":
      return { label: "Pending", className: "bg-slate-100 text-slate-600 border border-slate-200" };
    case "CANCELLED":
    case "FAILED":
    case "REJECTED":
      return {
        label: status === "CANCELLED" ? "Cancelled" : "Failed",
        className: "bg-rose-50 text-rose-700 border border-rose-200",
      };
    default:
      return { label: status, className: "bg-slate-100 text-slate-600 border border-slate-200" };
  }
}

function formatMethod(method: string | null): string {
  if (method === "PAY_AT_GATE") return "Pay at Gate";
  if (method === "CBE") return "CBE Bank";
  if (method === "TELEBIRR") return "Telebirr";
  if (method === "FREE") return "Free Pass";
  return method || "Telebirr";
}

export function RecentOrdersPanel({
  orders,
  currency,
}: {
  orders: RecentOrderRow[];
  currency: string;
}) {
  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-6 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-display text-slate-900 text-base">Recent Passes &amp; Bookings</h2>
          <p className="text-xs text-slate-400">Latest checkouts, bank receipts &amp; gate holds</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 flex items-center gap-1"
        >
          All orders <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 flex-1">
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No orders received yet.</p>
        ) : (
          orders.map((ord) => {
            const badge = getOrderStatusBadge(ord.status);
            const qty = (ord.items || []).reduce((s, i) => s + i.quantity, 0) || 1;
            const ordCurrency = ord.currency || currency;

            return (
              <div key={ord.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {ord.customerName || "Guest"}
                    </span>
                    {ord.checkedIn && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full theme-badge-secondary border">
                        <UserCheck className="w-3 h-3" /> Checked In
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    <span className="font-semibold text-slate-700">
                      {ord.event?.title || "Event Pass"}
                    </span>
                    {" · "}
                    {qty}x · <span className="font-mono">{ord.orderNumber}</span> ·{" "}
                    {formatMethod(ord.paymentMethod)}
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div className="font-extrabold text-slate-900 text-xs">
                    {ord.totalAmount > 0
                      ? `${ordCurrency} ${ord.totalAmount.toLocaleString()}`
                      : "Free"}
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-full ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
