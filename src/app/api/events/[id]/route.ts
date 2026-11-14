import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";
import {
  resolveValidOrganizerId,
  syncEventSpeakersAndAgenda,
  syncEventTicketTiers,
} from "@/lib/event-write-helpers";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = new Set(["DRAFT", "PUBLISHED", "LIVE", "ENDED", "CANCELLED"]);
const VALID_FORMATS = new Set(["IN_PERSON", "ONLINE", "HYBRID"]);

const EVENT_FULL_INCLUDE = {
  category: true,
  organizer: { select: { id: true, name: true, email: true } },
  ticketTiers: { orderBy: { sortOrder: "asc" as const } },
  speakers: { orderBy: { sortOrder: "asc" as const } },
  agendaItems: { orderBy: { sortOrder: "asc" as const } },
  _count: { select: { orders: true } },
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const event = await withDbRetry(() =>
      prisma.event.findUnique({
        where: { id },
        include: EVENT_FULL_INCLUDE,
      })
    );
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (event.status !== "PUBLISHED" && event.status !== "LIVE") {
      const session = await getSession();
      const canViewDraft = session && (session.role === "ADMIN" || event.organizerId === session.id);
      if (!canViewDraft) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "ORGANIZER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await withDbRetry(() =>
      prisma.event.findUnique({
        where: { id },
        include: {
          ticketTiers: true,
          _count: { select: { speakers: true, agendaItems: true } },
        },
      })
    );
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (session.role !== "ADMIN" && existing.organizerId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this event" }, { status: 403 });
    }

    const body = await req.json();
    const data: Record<string, any> = {};

    const scalars = [
      "title", "slug", "shortDescription", "description", "imageUrl",
      "timezone", "locationName", "locationAddress", "locationCity", "locationCountry",
    ];
    for (const field of scalars) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    if (typeof body.status === "string" && VALID_STATUSES.has(body.status.toUpperCase())) {
      data.status = body.status.toUpperCase();
    }
    if (typeof body.format === "string") {
      const normalizedFormat = body.format.toUpperCase().replace("-", "_");
      if (VALID_FORMATS.has(normalizedFormat)) data.format = normalizedFormat;
    }
    if (body.startDate !== undefined || body.endDate !== undefined) {
      const nextStart = body.startDate !== undefined ? new Date(body.startDate) : existing.startDate;
      const nextEnd = body.endDate !== undefined ? new Date(body.endDate) : existing.endDate;
      if (Number.isNaN(nextStart.getTime()) || Number.isNaN(nextEnd.getTime()) || nextEnd <= nextStart) {
        return NextResponse.json(
          { error: "End date & time must be after start date & time." },
          { status: 400 }
        );
      }
      if (body.startDate !== undefined) data.startDate = nextStart;
      if (body.endDate !== undefined) data.endDate = nextEnd;
    }
    if (body.capacity !== undefined) data.capacity = Math.max(1, Number(body.capacity));
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
    if (session.role === "ADMIN" && typeof body.organizerId === "string" && body.organizerId.trim()) {
      if (body.organizerId.trim() !== existing.organizerId) {
        const resolved = await resolveValidOrganizerId(body.organizerId);
        if ("error" in resolved) {
          return NextResponse.json({ error: resolved.error }, { status: 400 });
        }
        data.organizerId = resolved.organizerId;
      }
    }

    const event = await withDbRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const updatedEvent = await tx.event.update({ where: { id }, data });
          await syncEventTicketTiers(tx, id, existing.ticketTiers, body.ticketTiers);
          await syncEventSpeakersAndAgenda(
            tx, id, body.speakers, body.agendaItems, existing._count
          );
          return updatedEvent;
        },
        { maxWait: 10000, timeout: 20000 }
      )
    );

    revalidateCacheTags(CACHE_TAGS.events, CACHE_TAGS.categories);
    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/sitemap.xml");

    const updated = await withDbRetry(() =>
      prisma.event.findUnique({
        where: { id },
        include: EVENT_FULL_INCLUDE,
      })
    );
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "An event with this URL slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "ORGANIZER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const event = await withDbRetry(() =>
      prisma.event.findUnique({
        where: { id },
        select: { slug: true, title: true, organizerId: true, _count: { select: { orders: true } } },
      })
    );
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (session.role !== "ADMIN" && event.organizerId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this event" }, { status: 403 });
    }
    if (event._count.orders > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete "${event.title}" because ${event._count.orders} order${event._count.orders === 1 ? "" : "s"} are linked to it. Set its status to Ended or Cancelled instead.`,
        },
        { status: 409 }
      );
    }

    await withDbRetry(() => prisma.event.delete({ where: { id } }));

    revalidateCacheTags(CACHE_TAGS.events, CACHE_TAGS.categories);
    revalidatePath("/");
    revalidatePath("/discover");
    if (event.slug) revalidatePath(`/events/${event.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
