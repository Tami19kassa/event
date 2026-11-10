import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true } },
        ticketTiers: { orderBy: { sortOrder: "asc" } },
        speakers: { orderBy: { sortOrder: "asc" } },
        agendaItems: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "PUBLISHED" && event.status !== "LIVE") {
      const session = await getSession();
      const canViewDraft =
        session && (session.role === "ADMIN" || event.organizerId === session.id);
      if (!canViewDraft) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
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
    const existing = await prisma.event.findUnique({
      where: { id },
      include: { ticketTiers: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (session.role !== "ADMIN" && existing.organizerId !== session.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this event" }, { status: 403 });
    }

    const body = await req.json();
    const data: Record<string, any> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.description !== undefined) data.description = body.description;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) data.endDate = new Date(body.endDate);
    if (body.timezone !== undefined) data.timezone = body.timezone;
    if (body.format !== undefined) data.format = body.format;
    if (body.status !== undefined) data.status = body.status;
    if (body.capacity !== undefined) data.capacity = Math.max(1, Number(body.capacity));
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.locationName !== undefined) data.locationName = body.locationName;
    if (body.locationAddress !== undefined) data.locationAddress = body.locationAddress;
    if (body.locationCity !== undefined) data.locationCity = body.locationCity;
    if (body.locationCountry !== undefined) data.locationCountry = body.locationCountry;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;

    const event = await prisma.$transaction(async (tx) => {
      const updatedEvent = await tx.event.update({ where: { id }, data });

      if (Array.isArray(body.ticketTiers)) {
        const existingMap = new Map(existing.ticketTiers.map((t) => [t.id, t]));
        const incomingIds = new Set<string>(
          body.ticketTiers
            .filter((t: any) => typeof t?.id === "string" && t.id)
            .map((t: any) => String(t.id))
        );

        await tx.ticketTier.deleteMany({
          where: { eventId: id, id: { notIn: Array.from(incomingIds) } },
        });

        for (let i = 0; i < body.ticketTiers.length; i++) {
          const t = body.ticketTiers[i];
          const qty = Math.max(1, Math.floor(Number(t.quantity) || 100));
          const price = Math.max(0, Number(t.price) || 0);
          const prev = t?.id ? existingMap.get(t.id) : undefined;

          if (prev) {
            const qtyDelta = qty - prev.quantity;
            const nextRemaining = Math.max(0, Math.min(qty, prev.remaining + qtyDelta));
            await tx.ticketTier.update({
              where: { id: prev.id },
              data: {
                name: t.name,
                description: t.description || null,
                price,
                currency: t.currency || prev.currency || "ETB",
                quantity: qty,
                remaining: nextRemaining,
                earlyBird: Boolean(t.earlyBird),
                sortOrder: i,
              },
            });
          } else {
            await tx.ticketTier.create({
              data: {
                eventId: id,
                name: t.name,
                description: t.description || null,
                price,
                currency: t.currency || "ETB",
                quantity: qty,
                remaining: Math.min(qty, Math.max(0, Math.floor(Number(t.remaining ?? qty)))),
                earlyBird: Boolean(t.earlyBird),
                sortOrder: i,
              },
            });
          }
        }
      }

      return updatedEvent;
    });

    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath(`/events/${event.slug}`);

    const updated = await prisma.event.findUnique({
      where: { id },
      include: { ticketTiers: { orderBy: { sortOrder: "asc" } }, category: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({ where: { id }, select: { slug: true } });
    await prisma.event.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/discover");
    if (event?.slug) revalidatePath(`/events/${event.slug}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
