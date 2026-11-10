import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = new Set(["NEW", "CONTACTED", "QUALIFIED", "ARCHIVED"]);

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, any> = {};

    if (body?.status !== undefined) {
      const nextStatus = String(body.status).toUpperCase();
      if (!VALID_STATUSES.has(nextStatus)) {
        return NextResponse.json({ error: "Invalid inquiry status" }, { status: 400 });
      }
      data.status = nextStatus;
    }

    if (body?.notes !== undefined) {
      data.notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1500) || null : null;
    }

    const updated = await prisma.inquiry.update({ where: { id }, data });
    revalidatePath("/admin/inquiries");
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    console.error("Update inquiry error:", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    console.error("Delete inquiry error:", err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
