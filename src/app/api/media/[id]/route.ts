import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";
import { mapMediaPost, sanitizeMediaWriteInput } from "@/lib/media-posts";

const EVENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  startDate: true,
  locationCity: true,
} as const;

type Params = { params: Promise<{ id: string }> };

function revalidateMediaPaths(slugA?: string | null, slugB?: string | null, evtA?: string | null, evtB?: string | null) {
  revalidateCacheTags(CACHE_TAGS.media);
  revalidatePath("/");
  revalidatePath("/stories");
  revalidatePath("/admin/media");
  if (slugA) revalidatePath(`/stories/${slugA}`);
  if (slugB && slugB !== slugA) revalidatePath(`/stories/${slugB}`);
  if (evtA) revalidatePath(`/events/${evtA}`);
  if (evtB && evtB !== evtA) revalidatePath(`/events/${evtB}`);
  revalidatePath("/sitemap.xml");
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, any> = {};

    if (typeof body?.isFeatured === "boolean") data.isFeatured = body.isFeatured;
    if (body?.status === "DRAFT" || body?.status === "PUBLISHED") data.status = body.status;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid toggle fields provided." }, { status: 400 });
    }

    const updated = await withDbRetry(() =>
      prisma.mediaPost.update({
        where: { id },
        data,
        include: { event: { select: EVENT_SELECT } },
      })
    );

    revalidateMediaPaths(updated.slug, null, updated.event?.slug, null);
    return NextResponse.json(mapMediaPost(updated));
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Media post not found" }, { status: 404 });
    console.error("Patch media post failed:", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const existing = await withDbRetry(() =>
      prisma.mediaPost.findUnique({ where: { id }, include: { event: { select: { slug: true } } } })
    );
    if (!existing) return NextResponse.json({ error: "Media post not found" }, { status: 404 });

    const body = await req.json();
    const parsed = sanitizeMediaWriteInput(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const updated = await withDbRetry(() =>
      prisma.mediaPost.update({
        where: { id },
        data: parsed.data,
        include: { event: { select: EVENT_SELECT } },
      })
    );

    revalidateMediaPaths(existing.slug, updated.slug, existing.event?.slug, updated.event?.slug);
    return NextResponse.json(mapMediaPost(updated));
  } catch (err: any) {
    console.error("Update media post failed:", err);
    if (err.code === "P2002") return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    if (err.code === "P2003") return NextResponse.json({ error: "Selected linked event not found" }, { status: 400 });
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await withDbRetry(() =>
      prisma.mediaPost.delete({ where: { id }, include: { event: { select: { slug: true } } } })
    );

    revalidateMediaPaths(deleted.slug, null, deleted.event?.slug, null);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Media post not found" }, { status: 404 });
    console.error("Delete media post failed:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
