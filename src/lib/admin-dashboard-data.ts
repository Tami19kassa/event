import { prisma, withDbRetry } from "@/lib/prisma";
import type { RecentEventRow } from "@/components/admin/dashboard/RecentEventsPanel";
import type { RecentOrderRow } from "@/components/admin/dashboard/RecentOrdersPanel";
import {
  buildDailySeries,
  buildPaymentMix,
  summarizeDashboardEventAndOrderSlices,
  type DailyOrderPoint,
  type PaymentChannelSlice,
} from "./admin-dashboard-aggregates";

export type { DailyOrderPoint, PaymentChannelSlice };

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
  totalTierCapacity: number;
  totalTierRemaining: number;
  totalTierClaimed: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  publishedMediaCount: number;
  draftMediaCount: number;
  dailyOrders: DailyOrderPoint[];
  paymentMix: PaymentChannelSlice[];
  recentEvents: RecentEventRow[];
  recentOrders: RecentOrderRow[];
}

export async function getAdminDashboardSnapshot(scope: {
  role: string;
  userId: string;
}): Promise<DashboardSnapshot> {
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
    totalTierCapacity: 0,
    totalTierRemaining: 0,
    totalTierClaimed: 0,
    totalInquiriesCount: 0,
    newInquiriesCount: 0,
    publishedMediaCount: 0,
    draftMediaCount: 0,
    dailyOrders: buildDailySeries([], 14),
    paymentMix: buildPaymentMix([]),
    recentEvents: [],
    recentOrders: [],
  };

  try {
    const isAdmin = scope.role === "ADMIN";
    const eventScope = isAdmin ? {} : { organizerId: scope.userId };
    const orderScope = isAdmin ? {} : { event: { organizerId: scope.userId } };
    const tierScope = isAdmin ? {} : { event: { organizerId: scope.userId } };
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setUTCHours(0, 0, 0, 0);
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 13);

    const [eventRows, allOrderSlices, tierAgg, recentEvents, recentOrders, adminCounts] =
      await Promise.all([
        withDbRetry(() =>
          prisma.event.findMany({
            where: eventScope,
            select: { status: true, endDate: true, attendeesCount: true },
          })
        ),
        withDbRetry(() =>
          prisma.order.findMany({
            where: orderScope,
            select: { createdAt: true, totalAmount: true, paymentMethod: true, status: true, checkedIn: true },
            orderBy: { createdAt: "asc" },
          })
        ),
        withDbRetry(() =>
          prisma.ticketTier.aggregate({ where: tierScope, _sum: { quantity: true, remaining: true } })
        ),
        withDbRetry(() =>
          prisma.event.findMany({
            where: eventScope,
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
              id: true, slug: true, title: true, status: true, startDate: true, locationCity: true,
              category: { select: { name: true } },
              ticketTiers: { select: { quantity: true, remaining: true } },
            },
          })
        ),
        withDbRetry(() =>
          prisma.order.findMany({
            where: orderScope,
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
              id: true, orderNumber: true, status: true, paymentMethod: true, totalAmount: true,
              currency: true, customerName: true, checkedIn: true, createdAt: true,
              event: { select: { title: true, slug: true } },
              items: { select: { quantity: true } },
            },
          })
        ),
        isAdmin
          ? withDbRetry(() =>
              Promise.all([
                prisma.inquiry.count(),
                prisma.inquiry.count({ where: { status: "NEW" } }),
                prisma.mediaPost.count({ where: { status: "PUBLISHED" } }),
                prisma.mediaPost.count({ where: { status: "DRAFT" } }),
              ])
            )
          : Promise.resolve<[number, number, number, number]>([0, 0, 0, 0]),
      ]);

    const totals = summarizeDashboardEventAndOrderSlices(eventRows, allOrderSlices, now);
    const totalTierCapacity = tierAgg._sum.quantity || 0;
    const totalTierRemaining = Math.min(totalTierCapacity, tierAgg._sum.remaining || 0);
    const totalTierClaimed = Math.max(0, totalTierCapacity - totalTierRemaining);
    const windowOrders = allOrderSlices.filter((o) => new Date(o.createdAt) >= twoWeeksAgo);
    const [totalInquiriesCount, newInquiriesCount, publishedMediaCount, draftMediaCount] = adminCounts;

    return {
      ...totals,
      totalTierCapacity,
      totalTierRemaining,
      totalTierClaimed,
      totalInquiriesCount,
      newInquiriesCount,
      publishedMediaCount,
      draftMediaCount,
      dailyOrders: buildDailySeries(windowOrders, 14),
      paymentMix: buildPaymentMix(allOrderSlices),
      recentEvents,
      recentOrders,
    };
  } catch (err) {
    console.error("Dashboard DB fetch error:", err);
    return empty;
  }
}
