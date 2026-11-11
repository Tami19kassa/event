import { prisma, withDbRetry } from "./prisma";
import { getPublicPaymentSettings } from "./payment-settings";
import type { AdminEventRow } from "@/components/admin/events/AdminEventsTable";

export interface OrganizerSelectOption {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface AdminEventsSnapshot {
  events: AdminEventRow[];
  currency: string;
}

export async function fetchOrganizerSelectOptions(): Promise<OrganizerSelectOption[]> {
  return withDbRetry(() =>
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "ORGANIZER"] } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
    })
  ).catch(() => []);
}

export async function fetchAdminEventsSnapshot(scope: {
  role: string;
  userId: string;
}): Promise<AdminEventsSnapshot> {
  const where = scope.role === "ADMIN" ? {} : { organizerId: scope.userId };

  const [rows, payments] = await Promise.all([
    withDbRetry(() =>
      prisma.event.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          organizer: { select: { id: true, name: true, email: true } },
          ticketTiers: {
            select: { id: true, price: true, remaining: true, quantity: true },
            orderBy: { sortOrder: "asc" },
          },
          _count: { select: { orders: true } },
        },
        orderBy: { startDate: "desc" },
        take: 200,
      })
    ),
    getPublicPaymentSettings(),
  ]);

  const events: AdminEventRow[] = rows.map((evt) => ({
    id: evt.id,
    title: evt.title,
    slug: evt.slug,
    status: evt.status,
    format: evt.format,
    imageUrl: evt.imageUrl,
    locationCity: evt.locationCity,
    locationName: evt.locationName,
    isFeatured: evt.isFeatured,
    startDate: evt.startDate.toISOString(),
    endDate: evt.endDate.toISOString(),
    attendeesCount: evt.attendeesCount,
    capacity: evt.capacity,
    category: evt.category,
    organizer: evt.organizer,
    _count: evt._count,
    ticketTiers: evt.ticketTiers.map((t) => ({
      id: t.id,
      price: Number(t.price),
      remaining: t.remaining,
      quantity: t.quantity,
    })),
  }));

  return {
    events,
    currency: payments.currency || "ETB",
  };
}
