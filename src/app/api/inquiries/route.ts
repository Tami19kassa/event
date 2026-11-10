import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const VALID_TYPES = new Set(["EXHIBITOR", "SPONSOR"]);

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const typeParam = req.nextUrl.searchParams.get("type")?.toUpperCase();
    const statusParam = req.nextUrl.searchParams.get("status")?.toUpperCase();
    const where: Record<string, string> = {};

    if (typeParam && VALID_TYPES.has(typeParam)) where.type = typeParam;
    if (statusParam && ["NEW", "CONTACTED", "QUALIFIED", "ARCHIVED"].includes(statusParam)) {
      where.status = statusParam;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (err) {
    console.error("Fetch inquiries error:", err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`inquiry:${ip}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${limit.retryAfterSeconds}s and try again.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const type = typeof body?.type === "string" ? body.type.trim().toUpperCase() : "";
    const companyName = typeof body?.companyName === "string" ? body.companyName.trim().slice(0, 150) : "";
    const contactName = typeof body?.contactName === "string" ? body.contactName.trim().slice(0, 120) : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 150) : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const expoTitle = typeof body?.expoTitle === "string" ? body.expoTitle.trim().slice(0, 200) || null : null;
    const selection = typeof body?.selection === "string" ? body.selection.trim().slice(0, 120) : "";
    const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 1500) || null : null;

    if (!VALID_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid inquiry type" }, { status: 400 });
    }
    if (!companyName || !contactName || !phone || !selection) {
      return NextResponse.json({ error: "All required business contact fields must be filled." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid corporate email address." }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        type,
        companyName,
        contactName,
        email,
        phone,
        expoTitle,
        selection,
        notes,
        status: "NEW",
      },
      select: { id: true, type: true, companyName: true, createdAt: true },
    });

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (err) {
    console.error("Create inquiry error:", err);
    return NextResponse.json({ error: "Unable to submit inquiry. Please try again." }, { status: 500 });
  }
}
