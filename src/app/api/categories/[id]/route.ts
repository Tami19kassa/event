import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugifyCategoryName } from "@/lib/categories-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const reassignTo = req.nextUrl.searchParams.get("reassignTo");

    const count = await withDbRetry(() =>
      prisma.event.count({ where: { categoryId: id } })
    );

    if (count > 0 && !reassignTo) {
      return NextResponse.json(
        {
          error: `Cannot delete this event type because ${count} event(s) use it. Choose a replacement type to reassign them first.`,
        },
        { status: 400 }
      );
    }

    if (count > 0 && reassignTo) {
      if (reassignTo === id) {
        return NextResponse.json(
          { error: "Cannot reassign events to the same category being deleted." },
          { status: 400 }
        );
      }
      const nextCategoryId = reassignTo === "__none__" ? null : reassignTo;
      if (nextCategoryId) {
        const targetExists = await withDbRetry(() =>
          prisma.category.findUnique({ where: { id: nextCategoryId }, select: { id: true } })
        );
        if (!targetExists) {
          return NextResponse.json({ error: "Target replacement category not found." }, { status: 404 });
        }
      }

      await prisma.$transaction(
        async (tx) => {
          await tx.event.updateMany({
            where: { categoryId: id },
            data: { categoryId: nextCategoryId },
          });
          await tx.category.delete({ where: { id } });
        },
        { maxWait: 10000, timeout: 20000 }
      );
    } else {
      await prisma.category.delete({ where: { id } });
    }

    revalidateCacheTags(CACHE_TAGS.categories, CACHE_TAGS.events);
    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete event type" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { name, slug, icon } = await req.json();

    const data: Record<string, any> = {};
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Event type name cannot be empty." }, { status: 400 });
      }
      data.name = trimmed.slice(0, 80);
    }
    if (slug !== undefined) {
      const normalized = slugifyCategoryName(String(slug));
      if (!normalized) {
        return NextResponse.json({ error: "URL slug cannot be empty." }, { status: 400 });
      }
      data.slug = normalized;
    }
    if (icon !== undefined) {
      data.icon = String(icon).trim() || "tag";
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    revalidateCacheTags(CACHE_TAGS.categories, CACHE_TAGS.events);
    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Update category error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Another event type already uses that slug." }, { status: 409 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to update event type" },
      { status: 500 }
    );
  }
}
