import { prisma, withDbRetry } from "@/lib/prisma";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import type {
  AdminOrderEventOption,
  AdminOrderRow,
  AdminOrderSummary,
} from "@/lib/orders-admin-helpers";

export interface AdminOrdersSnapshot {
  orders: AdminOrderRow[];
  events: AdminOrderEventOption[];
  summary: AdminOrderSummary;
  currency: string;
}

export async function fetchAdminOrdersSnapshot(params: {
  role: string;
  userId: string;
  limit?: number;
}): Promise<AdminOrdersSnapshot> {
  const { role, userId, limit = 250 } = params;
  const isAdmin = role === "ADMIN";
  const orderWhere = isAdmin ? {} : { event: { organizerId: userId } };
  const eventWhere = isAdmin ? {} : { organizerId: userId };

  const [
    payments,
    totalCount,
    completedAgg,
    pendingReceiptsCount,
    gateAgg,
    checkedInCount,
    cancelledCount,
    rows,
    eventRows,
  ] = await Promise.all([
    getPublicPaymentSettings(),
    withDbRetry(() => prisma.order.count({ where: orderWhere })),
    withDbRetry(() =>
      prisma.order.aggregate({
        where: { ...orderWhere, status: "COMPLETED" },
        _sum: { totalAmount: true },
        _count: { _all: true },
      })
    ),
    withDbRetry(() =>
      prisma.order.count({ where: { ...orderWhere, status: "PENDING_VERIFICATION" } })
    ),
    withDbRetry(() =>
      prisma.order.aggregate({
        where: { ...orderWhere, status: "RESERVED_PAY_AT_GATE", checkedIn: false },
        _sum: { totalAmount: true },
        _count: { _all: true },
      })
    ),
    withDbRetry(() => prisma.order.count({ where: { ...orderWhere, checkedIn: true } })),
    withDbRetry(() =>
      prisma.order.count({
        where: { ...orderWhere, status: { in: ["CANCELLED", "FAILED", "REJECTED"] } },
      })
    ),
    withDbRetry(() =>
      prisma.order.findMany({
        where: orderWhere,
        include: {
          event: { select: { id: true, title: true, slug: true, startDate: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    ),
    withDbRetry(() =>
      prisma.event.findMany({
        where: eventWhere,
        select: { id: true, title: true, startDate: true },
        orderBy: { startDate: "desc" },
        take: 100,
      })
    ),
  ]);

  return {
    currency: payments.currency || "ETB",
    summary: {
      totalCount,
      verifiedRevenue: Number(completedAgg._sum.totalAmount || 0),
      completedCount: completedAgg._count._all || 0,
      pendingReceiptsCount,
      gatePendingCount: gateAgg._count._all || 0,
      gatePendingRevenue: Number(gateAgg._sum.totalAmount || 0),
      checkedInCount,
      activePassesCount: Math.max(0, totalCount - cancelledCount),
      cancelledCount,
    },
    events: eventRows.map((ev) => ({
      id: ev.id,
      title: ev.title,
      startDate: ev.startDate.toISOString(),
    })),
    orders: rows.map((ord) => ({
      id: ord.id,
      orderNumber: ord.orderNumber,
      eventId: ord.eventId,
      status: ord.status,
      totalAmount: Number(ord.totalAmount || 0),
      currency: ord.currency || payments.currency || "ETB",
      customerEmail: ord.customerEmail,
      customerName: ord.customerName,
      customerPhone: ord.customerPhone,
      paymentMethod: ord.paymentMethod,
      receiptUrl: ord.receiptUrl,
      transactionRef: ord.transactionRef,
      verifiedAt: ord.verifiedAt ? ord.verifiedAt.toISOString() : null,
      checkedIn: ord.checkedIn,
      checkedInAt: ord.checkedInAt ? ord.checkedInAt.toISOString() : null,
      createdAt: ord.createdAt.toISOString(),
      event: ord.event
        ? {
            id: ord.event.id,
            title: ord.event.title,
            slug: ord.event.slug,
            startDate: ord.event.startDate.toISOString(),
          }
        : null,
      items: ord.items.map((item) => ({
        id: item.id,
        ticketTierId: item.ticketTierId,
        ticketName: item.ticketName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice || 0),
      })),
    })),
  };
}
