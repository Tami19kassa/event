import { Calendar, Users, Ticket, Coins } from "lucide-react";

interface MetricsProps {
  totalEvents: number;
  totalAttendees: number;
  totalOrders: number;
  totalRevenue: number;
  activeCount: number;
}

export function DashboardMetrics({
  totalEvents,
  totalAttendees,
  totalOrders,
  totalRevenue,
  activeCount,
}: MetricsProps) {
  const stats = [
    {
      label: "Total Events",
      value: totalEvents.toString(),
      change: `${activeCount} published in Addis catalog`,
      icon: Calendar,
      color: "bg-indigo-500",
    },
    {
      label: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      change: "Across all registered events",
      icon: Users,
      color: "bg-emerald-500",
    },
    {
      label: "Orders Completed",
      value: totalOrders.toLocaleString(),
      change: "Telebirr, CBE & Gate sales",
      icon: Ticket,
      color: "bg-violet-500",
    },
    {
      label: "Gross Revenue",
      value: `ETB ${totalRevenue.toLocaleString()}`,
      change: "Verified tickets in Birr",
      icon: Coins,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
            <div className={`w-10 h-10 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-sm`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
          <div className="text-xs text-slate-400 font-medium">{s.change}</div>
        </div>
      ))}
    </div>
  );
}
