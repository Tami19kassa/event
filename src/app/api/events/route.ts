import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { mapPrismaEventToUI } from "@/lib/event-mapper";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";
import { sanitizeAgendaInput, sanitizeSpeakersInput } from "@/lib/event-write-helpers";

const VALID_STATUSES = new Set(["DRAFT", "PUBLISHED", "LIVE", "ENDED", "CANCELLED"]);
const VALID_FORMATS = new Set(["IN_PERSON", "ONLINE", "HYBRID"]);

export async function GET(req: NextRequest) {
  try {
    const isUIFormat = req.nextUrl.searchParams.get("format") === "ui";
    const statusParam = req.nextUrl.searchParams.get("status");
    const pageParam = req.nextUrl.searchParams.get("page");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = Math.min(200, Math.max(1, Number(limitParam) || 100));
    const page = Math.max(1, Number(pageParam) || 1);
    const session = await getSession();

    const where: any = {};
    if (!session) {
      where.status = { in: ["PUBLISHED", "LIVE"] };
    } else if (session.role === "ADMIN") {
      if (statusParam) where.status = statusParam;
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

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        include: {
          category: true,
          organizer: { select: { id: true, name: true, email: true, avatarUrl: true } },
          ticketTiers: { orderBy: { sortOrder: "asc" } },
          speakers: { orderBy: { sortOrder: "asc" } },
          agendaItems: { orderBy: { sortOrder: "asc" } },
          _count: { select: { orders: true } },
        },
        orderBy: { startDate: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const payload = isUIFormat ? events.map(mapPrismaEventToUI) : events;
    return NextResponse.json(payload, {
      headers: {
        "X-Total-Count": String(total),
        "X-Page": String(page),
        "X-Limit": String(limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ORGANIZER" && session.role !== "ADMIN")) {
    return NextResponse.json(
      { error: "Authentication required: Only registered Organizers and Administrators can create events." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      title, slug, shortDescription, description, imageUrl,
      startDate, endDate, timezone, format, status, capacity, isFeatured,
      locationName, locationAddress, locationCity, locationCountry, categoryId,
      ticketTiers, speakers, agendaItems,
    } = body;

    if (!title?.trim() || !startDate || !endDate) {
      return NextResponse.json({ error: "Title, start date, and end date are required." }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return NextResponse.json(
        { error: "End date & time must be after start date & time." },
        { status: 400 }
      );
    }

    const baseSlug = String(slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const safeSlug = baseSlug || `event-${Date.now()}`;

    const rawFormat = typeof format === "string" ? format.toUpperCase().replace("-", "_") : "IN_PERSON";
    const safeFormat = VALID_FORMATS.has(rawFormat) ? rawFormat : "IN_PERSON";
    const rawStatus = typeof status === "string" ? status.toUpperCase() : "DRAFT";
    const safeStatus = VALID_STATUSES.has(rawStatus) ? rawStatus : "DRAFT";

    const cleanTiers = Array.isArray(ticketTiers)
      ? ticketTiers
          .filter((t: any) => typeof t?.name === "string" && t.name.trim())
          .map((t: any, i: number) => {
            const qty = Math.max(1, Math.floor(Number(t.quantity) || 100));
            const rem = Math.min(qty, Math.max(0, Math.floor(Number(t.remaining ?? qty))));
            return {
              name: String(t.name).trim().slice(0, 100),
              description: typeof t.description === "string" ? t.description.trim() || null : null,
              price: Math.max(0, Number(t.price) || 0),
              currency: typeof t.currency === "string" && t.currency.trim() ? t.currency.trim() : "ETB",
              quantity: qty,
              remaining: rem,
              earlyBird: Boolean(t.earlyBird),
              sortOrder: i,
            };
          })
      : [];

    const sanitizedSpeakers = sanitizeSpeakersInput(speakers);
    const sanitizedAgenda = sanitizeAgendaInput(agendaItems);

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug: safeSlug,
        shortDescription: shortDescription?.trim() || null,
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        startDate: start,
        endDate: end,
        timezone: timezone || "Africa/Addis_Ababa",
        format: safeFormat,
        status: safeStatus,
        capacity: Math.max(1, Number(capacity) || 100),
        isFeatured: Boolean(isFeatured),
        locationName: locationName?.trim() || null,
        locationAddress: locationAddress?.trim() || null,
        locationCity: locationCity?.trim() || null,
        locationCountry: locationCountry?.trim() || null,
        categoryId: categoryId || null,
        organizerId: session.id,
        ticketTiers: cleanTiers.length ? { create: cleanTiers } : undefined,
        speakers: sanitizedSpeakers.length ? { create: sanitizedSpeakers } : undefined,
        agendaItems: sanitizedAgenda.length ? { create: sanitizedAgenda } : undefined,
      },
      include: { ticketTiers: true, category: true, speakers: true, agendaItems: true },
    });

    revalidateCacheTags(CACHE_TAGS.events, CACHE_TAGS.categories);
    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "An event with this URL slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
