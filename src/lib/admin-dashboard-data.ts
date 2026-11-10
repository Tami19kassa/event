import { prisma } from "@/lib/prisma";
import type { RecentEventRow } from "@/components/admin/dashboard/RecentEventsPanel";
import type { RecentOrderRow } from "@/components/admin/dashboard/RecentOrdersPanel";

export interface DashboardSnapshot {
  totalEventsCount: number;
  publishedEventsCount: number;
  draftEventsCount: number;
  upcomingEventsCount: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  gatePendingCount: number;
  checkedInOrdersCount: number;
  verifiedRevenue: number;
  pendingGateRevenue: number;
  totalAttendees: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  publishedMediaCount: number;
  draftMediaCount: number;
  recentEvents: RecentEventRow[];
  recentOrders: RecentOrderRow[];
}

export async function getAdminDashboardSnapshot(): Promise<DashboardSnapshot> {
  const empty: DashboardSnapshot = {
    totalEventsCount: 0,
    publishedEventsCount: 0,
    draftEventsCount: 0,
    upcomingEventsCount: 0,
    completedOrdersCount: 0,
    pendingVerificationCount: 0,
    gatePendingCount: 0,
    checkedInOrdersCount: 0,
    verifiedRevenue: 0,
    pendingGateRevenue: 0,
    totalAttendees: 0,
    totalInquiriesCount: 0,
    newInquiriesCount: 0,
    publishedMediaCount: 0,
    draftMediaCount: 0,
    recentEvents: [],
    recentOrders: [],
  };

  try {
    const now = new Date();
    const [
      totalEventsCount,
      publishedEventsCount,
      draftEventsCount,
      upcomingEventsCount,
      completedOrdersCount,
      pendingVerificationCount,
      gatePendingCount,
      checkedInOrdersCount,
      revenueAgg,
      gateRevenueAgg,
      attendeeAgg,
      totalInquiriesCount,
      newInquiriesCount,
      publishedMediaCount,
      draftMediaCount,
      recentEvents,
      recentOrders,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: { in: ["PUBLISHED", "LIVE"] } } }),
      prisma.event.count({ where: { status: "DRAFT" } }),
      prisma.event.count({
        where: { status: { in: ["PUBLISHED", "LIVE"] }, endDate: { gte: now } },
      }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.order.count({ where: { status: "RESERVED_PAY_AT_GATE", checkedIn: false } }),
      prisma.order.count({ where: { checkedIn: true } }),
      prisma.order.aggregate({ where: { status: "COMPLETED" }, _sum: { totalAmount: true } }),
      prisma.order.aggregate({
        where: { status: "RESERVED_PAY_AT_GATE", checkedIn: false },
        _sum: { totalAmount: true },
      }),
      prisma.event.aggregate({ _sum: { attendeesCount: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.mediaPost.count({ where: { status: "PUBLISHED" } }),
      prisma.mediaPost.count({ where: { status: "DRAFT" } }),
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          startDate: true,
          locationCity: true,
          category: { select: { name: true } },
          ticketTiers: { select: { quantity: true, remaining: true } },
        },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentMethod: true,
          totalAmount: true,
          currency: true,
          customerName: true,
          checkedIn: true,
          createdAt: true,
          event: { select: { title: true, slug: true } },
          items: { select: { quantity: true } },
        },
      }),
    ]);

    return {
      totalEventsCount,
      publishedEventsCount,
      draftEventsCount,
      upcomingEventsCount,
      completedOrdersCount,
      pendingVerificationCount,
      gatePendingCount,
      checkedInOrdersCount,
      verifiedRevenue: revenueAgg._sum.totalAmount || 0,
      pendingGateRevenue: gateRevenueAgg._sum.totalAmount || 0,
      totalAttendees: attendeeAgg._sum.attendeesCount || 0,
      totalInquiriesCount,
      newInquiriesCount,
      publishedMediaCount,
      draftMediaCount,
      recentEvents,
      recentOrders,
    };
  } catch (err) {
    console.error("Dashboard DB fetch error:", err);
    return empty;
  }
}
