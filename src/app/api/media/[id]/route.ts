import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
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

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.mediaPost.findUnique({
      where: { id },
      include: { event: { select: { slug: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Media post not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = sanitizeMediaWriteInput(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const updated = await prisma.mediaPost.update({
      where: { id },
      data: parsed.data,
      include: { event: { select: EVENT_SELECT } },
    });

    revalidateCacheTags(CACHE_TAGS.media);
    revalidatePath("/");
    revalidatePath("/stories");
    revalidatePath(`/stories/${existing.slug}`);
    revalidatePath(`/stories/${updated.slug}`);
    if (existing.event?.slug) revalidatePath(`/events/${existing.event.slug}`);
    if (updated.event?.slug) revalidatePath(`/events/${updated.event.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(mapMediaPost(updated));
  } catch (err: any) {
    console.error("Update media post failed:", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
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
    const deleted = await prisma.mediaPost.delete({
      where: { id },
      include: { event: { select: { slug: true } } },
    });

    revalidateCacheTags(CACHE_TAGS.media);
    revalidatePath("/");
    revalidatePath("/stories");
    revalidatePath(`/stories/${deleted.slug}`);
    if (deleted.event?.slug) revalidatePath(`/events/${deleted.event.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete media post failed:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
