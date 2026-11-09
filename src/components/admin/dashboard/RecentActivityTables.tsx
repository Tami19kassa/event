import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Eye, Clock, CheckCircle2 } from "lucide-react";

interface Props {
  recentEvents: any[];
  recentOrders: any[];
}

export function RecentActivityTables({ recentEvents, recentOrders }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Events */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-base">Recent Events</h2>
          <Link href="/admin/events" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentEvents.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No events created yet.</p>
          ) : (
            recentEvents.map((evt) => (
              <div key={evt.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{evt.title}</h4>
                  <span className="text-[11px] text-slate-400">{evt.locationCity || "Addis Ababa"} · {format(new Date(evt.startDate), "MMM d, yyyy")}</span>
                </div>
                <Link href={`/admin/events/${evt.id}/edit`} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-base">Recent Passes & Bookings</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No orders received yet.</p>
          ) : (
            recentOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{ord.customerName || "Guest"}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{ord.orderNumber} · {ord.paymentMethod || "Telebirr"}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-xs block">ETB {ord.totalAmount?.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold ${ord.status === "COMPLETED" ? "text-emerald-600" : "text-amber-600"}`}>
                    {ord.status === "COMPLETED" ? "Verified" : "Gate Reserved"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
