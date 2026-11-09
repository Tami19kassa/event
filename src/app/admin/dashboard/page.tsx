import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { RecentActivityTables } from "@/components/admin/dashboard/RecentActivityTables";

export default async function AdminDashboardPage() {
  let totalEvents = 0;
  let totalOrders = 0;
  let totalRevenue = 0;
  let totalAttendees = 0;
  let recentEvents: any[] = [];
  let recentOrders: any[] = [];

  try {
    const [eventCount, orderCount, revenueAgg, attendeeAgg, eventsList, ordersList] =
      await Promise.all([
        prisma.event.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          where: { status: "COMPLETED" },
          _sum: { totalAmount: true },
        }),
        prisma.event.aggregate({
          _sum: { attendeesCount: true },
        }),
        prisma.event.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { ticketTiers: true },
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { event: { select: { title: true } } },
        }),
      ]);

    totalEvents = eventCount;
    totalOrders = orderCount;
    totalRevenue = revenueAgg._sum.totalAmount || 0;
    totalAttendees = attendeeAgg._sum.attendeesCount || 0;
    recentEvents = eventsList;
    recentOrders = ordersList;
  } catch (err) {
    console.error("Dashboard DB fetch error:", err);
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Platform Overview
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor ticketing, revenue, attendance, and recent activity in Addis Ababa.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      <DashboardMetrics
        totalEvents={totalEvents}
        totalAttendees={totalAttendees}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        activeCount={recentEvents.length}
      />

      <RecentActivityTables
        recentEvents={recentEvents}
        recentOrders={recentOrders}
      />
    </div>
  );
}
