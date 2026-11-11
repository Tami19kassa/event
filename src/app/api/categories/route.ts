import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCategories } from "@/lib/events";
import { fetchAdminCategories, slugifyCategoryName } from "@/lib/categories-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

export async function GET(req: NextRequest) {
  try {
    const scope = req.nextUrl.searchParams.get("scope");
    if (scope === "admin") {
      const session = await getSession();
      if (!session || (session.role !== "ADMIN" && session.role !== "ORGANIZER")) {
        return NextResponse.json({ error: "Authorization required" }, { status: 403 });
      }
      const adminCategories = await fetchAdminCategories();
      return NextResponse.json(adminCategories);
    }
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
    const trimmedName = String(name || "").trim();

    if (!trimmedName) {
      return NextResponse.json({ error: "Event type name is required" }, { status: 400 });
    }

    const generatedSlug = slugifyCategoryName(String(slug || trimmedName));
    if (!generatedSlug) {
      return NextResponse.json({ error: "Please provide a valid URL slug" }, { status: 400 });
    }

    const existing = await withDbRetry(() =>
      prisma.category.findUnique({ where: { slug: generatedSlug } })
    );

    if (existing) {
      return NextResponse.json(
        { error: `An event type with slug "/${generatedSlug}" already exists.` },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName.slice(0, 80),
        slug: generatedSlug,
        icon: String(icon || "").trim() || "📌",
      },
    });

    revalidateCacheTags(CACHE_TAGS.categories, CACHE_TAGS.events);
    revalidatePath("/", "layout");
    revalidatePath("/discover");

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    console.error("Create category error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Event type slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message || "Failed to create event type" }, { status: 500 });
  }
}
