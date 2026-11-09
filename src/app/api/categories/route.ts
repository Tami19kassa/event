import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCategories } from "@/lib/events";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const { name, slug, icon } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Category slug "${generatedSlug}" is already taken.` },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        icon: icon?.trim() || "📌",
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    console.error("Create category error:", err);
    return NextResponse.json({ error: err.message || "Failed to create category" }, { status: 500 });
  }
}
