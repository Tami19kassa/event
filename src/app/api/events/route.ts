import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { mapPrismaEventToUI } from "@/lib/events";

export async function GET(req: NextRequest) {
  try {
    const isUIFormat = req.nextUrl.searchParams.get("format") === "ui";
    const statusParam = req.nextUrl.searchParams.get("status");
    const session = await getSession();

    const where: any = {};
    if (!session) {
      where.status = { in: ["PUBLISHED", "LIVE"] };
    } else if (session.role === "ADMIN") {
      if (statusParam) {
        where.status = statusParam;
      }
    } else if (session.role === "ORGANIZER") {
      if (statusParam === "PUBLISHED" || statusParam === "LIVE") {
        where.status = statusParam;
      } else {
        where.OR = [
          { status: { in: ["PUBLISHED", "LIVE"] } },
          { organizerId: session.id },
        ];
      }
    } else {
      where.status = { in: ["PUBLISHED", "LIVE"] };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true, avatarUrl: true } },
        ticketTiers: true,
        speakers: true,
        agendaItems: true,
        _count: { select: { orders: true } },
      },
      orderBy: { startDate: "desc" },
    });

    if (isUIFormat) {
      return NextResponse.json(events.map(mapPrismaEventToUI));
    }

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ORGANIZER" && session.role !== "ADMIN")) {
    return NextResponse.json(
      { error: "Authentication required: Only registered Organizers and Administrators can create and publish events." },
      { status: 401 }
    );
  }

  const organizerId = session.id;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      description,
      imageUrl,
      startDate,
      endDate,
      timezone,
      format,
      status,
      capacity,
      isFeatured,
      locationName,
      locationAddress,
      locationCity,
      locationCountry,
      categoryId,
      ticketTiers,
    } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, startDate and endDate are required" },
        { status: 400 }
      );
    }

    // Auto-generate unique slug if not provided
    const safeSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${Math.floor(Math.random() * 1000)}`;

    const event = await prisma.event.create({
      data: {
        title,
        slug: safeSlug,
        shortDescription: shortDescription || null,
        description: description || null,
        imageUrl: imageUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timezone: timezone || "UTC",
        format: format ? format.toUpperCase().replace("-", "_") : "IN_PERSON",
        status: status || "PUBLISHED",
        capacity: capacity || 100,
        isFeatured: isFeatured || false,
        locationName: locationName || null,
        locationAddress: locationAddress || null,
        locationCity: locationCity || null,
        locationCountry: locationCountry || null,
        categoryId: categoryId || null,
        organizerId: organizerId || null,
        ticketTiers: ticketTiers?.length
          ? {
              create: ticketTiers.map((t: any, i: number) => {
                const qty = Math.max(1, Math.floor(Number(t.quantity) || 100));
                const rem = Math.min(qty, Math.max(0, Math.floor(Number(t.remaining ?? qty))));
                return {
                  name: t.name,
                  description: t.description || null,
                  price: Math.max(0, Number(t.price) || 0),
                  currency: t.currency || "ETB",
                  quantity: qty,
                  remaining: rem,
                  earlyBird: Boolean(t.earlyBird),
                  sortOrder: i,
                };
              }),
            }
          : undefined,
      },
      include: { ticketTiers: true, category: true },
    });

    revalidatePath("/");
    revalidatePath("/discover");

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
