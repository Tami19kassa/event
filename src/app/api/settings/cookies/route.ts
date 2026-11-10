import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getCookieSettings, saveCookieSettings, CookieSettings } from "@/lib/cookie-settings";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

function isSafePolicyUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.startsWith("/") || trimmed.startsWith("https://") || trimmed.startsWith("http://");
}

export async function GET() {
  const settings = await getCookieSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const patch: Partial<CookieSettings> = {};

    if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
    if (typeof body.showAnalytics === "boolean") patch.showAnalytics = body.showAnalytics;
    if (typeof body.showMarketing === "boolean") patch.showMarketing = body.showMarketing;
    if (typeof body.title === "string" && body.title.trim()) {
      patch.title = body.title.trim().slice(0, 120);
    }
    if (typeof body.description === "string" && body.description.trim()) {
      patch.description = body.description.trim().slice(0, 600);
    }
    if (typeof body.acceptAllLabel === "string" && body.acceptAllLabel.trim()) {
      patch.acceptAllLabel = body.acceptAllLabel.trim().slice(0, 40);
    }
    if (typeof body.rejectAllLabel === "string" && body.rejectAllLabel.trim()) {
      patch.rejectAllLabel = body.rejectAllLabel.trim().slice(0, 40);
    }
    if (typeof body.customizeLabel === "string" && body.customizeLabel.trim()) {
      patch.customizeLabel = body.customizeLabel.trim().slice(0, 40);
    }
    if (typeof body.privacyPolicyUrl === "string" && isSafePolicyUrl(body.privacyPolicyUrl)) {
      patch.privacyPolicyUrl = body.privacyPolicyUrl.trim().slice(0, 200);
    }

    const updated = await saveCookieSettings(patch);
    revalidateCacheTags(CACHE_TAGS.cookies);
    revalidatePath("/", "layout");
    revalidatePath("/privacy");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Save cookie settings error:", err);
    return NextResponse.json({ error: "Failed to update cookie settings" }, { status: 500 });
  }
}
