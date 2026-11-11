import { prisma, withDbRetry } from "./prisma";
import {
  normalizeRole,
  type AdminUserItem,
  type AdminUsersSummary,
  type UserActivityDetail,
} from "./users-admin-helpers";

const USER_LIST_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  passwordHash: true,
  createdAt: true,
  _count: {
    select: {
      organizedEvents: true,
      orders: true,
    },
  },
} as const;

export function mapAdminUser(row: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatarUrl: string | null;
  passwordHash: string | null;
  createdAt: Date;
  _count: { organizedEvents: number; orders: number };
}): AdminUserItem {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: normalizeRole(row.role),
    avatarUrl: row.avatarUrl,
    hasPassword: Boolean(row.passwordHash),
    createdAt: row.createdAt.toISOString(),
    organizedEventsCount: row._count.organizedEvents,
    ordersCount: row._count.orders,
  };
}

export async function fetchAdminUsersSnapshot(limit = 300): Promise<{
  users: AdminUserItem[];
  summary: AdminUsersSummary;
}> {
  const [totalCount, adminCount, organizerCount, attendeeCount, buyersCount, rows] =
    await Promise.all([
      withDbRetry(() => prisma.user.count()),
      withDbRetry(() => prisma.user.count({ where: { role: "ADMIN" } })),
      withDbRetry(() => prisma.user.count({ where: { role: "ORGANIZER" } })),
      withDbRetry(() => prisma.user.count({ where: { role: "ATTENDEE" } })),
      withDbRetry(() => prisma.user.count({ where: { orders: { some: {} } } })),
      withDbRetry(() =>
        prisma.user.findMany({
          select: USER_LIST_SELECT,
          orderBy: [{ createdAt: "desc" }],
          take: limit,
        })
      ),
    ]);

  return {
    users: rows.map(mapAdminUser),
    summary: {
      totalCount,
      adminCount,
      organizerCount,
      attendeeCount,
      buyersCount,
    },
  };
}

export async function fetchUserActivityDetail(id: string): Promise<UserActivityDetail | null> {
  const row = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_LIST_SELECT,
        organizedEvents: {
          select: { id: true, slug: true, title: true, status: true, startDate: true },
          orderBy: { startDate: "desc" },
          take: 5,
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            currency: true,
            createdAt: true,
            event: { select: { title: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })
  );

  if (!row) return null;

  return {
    ...mapAdminUser(row),
    recentEvents: row.organizedEvents.map((ev) => ({
      id: ev.id,
      slug: ev.slug,
      title: ev.title,
      status: ev.status,
      startDate: ev.startDate.toISOString(),
    })),
    recentOrders: row.orders.map((ord) => ({
      id: ord.id,
      orderNumber: ord.orderNumber,
      status: ord.status,
      totalAmount: ord.totalAmount,
      currency: ord.currency,
      createdAt: ord.createdAt.toISOString(),
      eventTitle: ord.event.title,
    })),
  };
}
