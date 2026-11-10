import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getThemeSettings, saveThemeSettings } from "@/lib/settings";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

export async function GET() {
  const settings = await getThemeSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await saveThemeSettings(body);
    revalidateCacheTags(CACHE_TAGS.theme);
    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Save theme error:", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
