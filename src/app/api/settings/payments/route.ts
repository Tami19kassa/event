import { NextRequest, NextResponse } from "next/server";
import { getPaymentSettings, savePaymentSettings } from "@/lib/payment-verification";
import { getSession } from "@/lib/auth";

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
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Save payment settings error:", err);
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 });
  }
}
