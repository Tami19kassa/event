import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";
import { fetchAdminMediaSnapshot, mapMediaPost, sanitizeMediaWriteInput } from "@/lib/media-posts";

const EVENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  startDate: true,
  locationCity: true,
} as const;

export async function GET(req: NextRequest) {
  try {
    const scope = req.nextUrl.searchParams.get("scope");
    if (scope === "admin") {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const snapshot = await fetchAdminMediaSnapshot();
      return NextResponse.json(snapshot);
    }

    const rows = await withDbRetry(() =>
      prisma.mediaPost.findMany({
        where: { status: "PUBLISHED" },
        include: { event: { select: EVENT_SELECT } },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        take: 100,
      })
    );

    return NextResponse.json(rows.map(mapMediaPost));
  } catch (err) {
    console.error("Fetch media posts failed:", err);
    return NextResponse.json({ error: "Failed to load media posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = sanitizeMediaWriteInput(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const baseSlug = parsed.data.slug;
    const collision = await withDbRetry(() =>
      prisma.mediaPost.findUnique({ where: { slug: baseSlug }, select: { id: true } })
    );
    const finalSlug = collision
      ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
      : baseSlug;

    const created = await withDbRetry(() =>
      prisma.mediaPost.create({
        data: { ...parsed.data, slug: finalSlug },
        include: { event: { select: EVENT_SELECT } },
      })
    );

    revalidateCacheTags(CACHE_TAGS.media);
    revalidatePath("/");
    revalidatePath("/stories");
    revalidatePath("/admin/media");
    revalidatePath(`/stories/${created.slug}`);
    if (created.event?.slug) revalidatePath(`/events/${created.event.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(mapMediaPost(created), { status: 201 });
  } catch (err: any) {
    console.error("Create media post failed:", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (err.code === "P2003") {
      return NextResponse.json({ error: "Selected linked event not found" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
