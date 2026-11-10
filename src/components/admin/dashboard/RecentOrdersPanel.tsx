import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      return { label: "Verified", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    case "PENDING_VERIFICATION":
      return { label: "Needs Review", className: "bg-amber-50 text-amber-800 border border-amber-200" };
    case "RESERVED_PAY_AT_GATE":
      return { label: "Gate Reserved", className: "bg-slate-100 text-slate-700 border border-slate-200" };
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
  if (method === "CBE") return "CBE";
  if (method === "TELEBIRR") return "Telebirr";
  if (method === "FREE") return "Free";
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
    <section className="bg-white theme-radius-card border border-slate-200 p-5 shadow-2xs flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <h2 className="font-sans font-bold text-slate-900 text-sm">Recent Bookings</h2>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-[var(--color-primary)] hover:opacity-80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
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
              <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm truncate">
                      {ord.customerName || "Guest"}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      · {qty}x {formatMethod(ord.paymentMethod)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    {ord.event?.title || "Event Pass"} ·{" "}
                    <span className="font-mono text-[11px]">{ord.orderNumber}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className="font-sans font-bold tabular-nums text-slate-900 text-xs">
                    {ord.totalAmount > 0
                      ? `${ordCurrency} ${ord.totalAmount.toLocaleString()}`
                      : "Free"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badge.className}`}
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
