import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Check if category has events attached
    const count = await prisma.event.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category because it has ${count} event(s) linked to it. Reassign or delete those events first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { name, slug, icon } = await req.json();

    const data: Record<string, any> = {};
    if (name) data.name = name.trim();
    if (slug) {
      data.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (icon !== undefined) data.icon = icon.trim();

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Update category error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update category" },
      { status: 500 }
    );
  }
}
