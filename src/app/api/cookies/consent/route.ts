import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`cookie-consent:${ip}`, 30, 5 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: true, throttled: true });
    }

    const body = await req.json();
    const visitorId =
      typeof body?.visitorId === "string" ? body.visitorId.trim().slice(0, 80) || null : null;

    await prisma.cookieConsent.create({
      data: {
        visitorId,
        essential: true,
        analytics: Boolean(body?.analytics),
        marketing: Boolean(body?.marketing),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
