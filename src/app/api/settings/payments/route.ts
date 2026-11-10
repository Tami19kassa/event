import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPaymentSettings, savePaymentSettings } from "@/lib/payment-verification";
import { getSession } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { revalidateCacheTags } from "@/lib/cache-revalidate";

export async function GET() {
  const settings = await getPaymentSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await savePaymentSettings(body);
    revalidateCacheTags(CACHE_TAGS.payments);
    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Save payment settings error:", err);
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 });
  }
}
