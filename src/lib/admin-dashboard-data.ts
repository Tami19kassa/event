import { prisma } from "@/lib/prisma";
import type { RecentEventRow } from "@/components/admin/dashboard/RecentEventsPanel";
import type { RecentOrderRow } from "@/components/admin/dashboard/RecentOrdersPanel";
import {
  buildDailySeries,
  buildPaymentMix,
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
    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setUTCHours(0, 0, 0, 0);
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 13);

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
      tierAgg,
      totalInquiriesCount,
      newInquiriesCount,
      publishedMediaCount,
      draftMediaCount,
      allOrderSlices,
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
      prisma.ticketTier.aggregate({ _sum: { quantity: true, remaining: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.mediaPost.count({ where: { status: "PUBLISHED" } }),
      prisma.mediaPost.count({ where: { status: "DRAFT" } }),
      prisma.order.findMany({
        select: { createdAt: true, totalAmount: true, paymentMethod: true, status: true },
        orderBy: { createdAt: "asc" },
      }),
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
        take: 5,
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

    const totalTierCapacity = tierAgg._sum.quantity || 0;
    const totalTierRemaining = Math.min(totalTierCapacity, tierAgg._sum.remaining || 0);
    const totalTierClaimed = Math.max(0, totalTierCapacity - totalTierRemaining);
    const windowOrders = allOrderSlices.filter((o) => new Date(o.createdAt) >= twoWeeksAgo);

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
