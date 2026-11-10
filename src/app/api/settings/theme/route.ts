import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getLiveThemeSettings, saveThemeSettings } from "@/lib/settings";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  const settings = await getLiveThemeSettings();
  return NextResponse.json(settings, { headers: NO_STORE_HEADERS });
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
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/settings");
    return NextResponse.json(updated, { headers: NO_STORE_HEADERS });
  } catch (err) {
    console.error("Save theme error:", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
