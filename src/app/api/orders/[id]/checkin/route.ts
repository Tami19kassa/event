import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const BLOCKED_STATUSES = new Set(["CANCELLED", "FAILED", "REJECTED"]);

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "ORGANIZER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const undo = Boolean(body?.undo);

    const existingOrder = await withDbRetry(() =>
      prisma.order.findUnique({
        where: { id },
        include: { event: { select: { organizerId: true } } },
      })
    );

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.role !== "ADMIN" && existingOrder.event?.organizerId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (undo) {
      if (!existingOrder.checkedIn) {
        return NextResponse.json({ error: "Order is not checked in yet." }, { status: 409 });
      }
      const updated = await withDbRetry(() =>
        prisma.order.update({
          where: { id },
          data: { checkedIn: false, checkedInAt: null },
        })
      );
      revalidatePath("/admin/orders");
      revalidatePath("/admin/dashboard");
      return NextResponse.json({ success: true, order: updated, undone: true });
    }

    if (BLOCKED_STATUSES.has(existingOrder.status.toUpperCase())) {
      return NextResponse.json(
        { error: `Cannot check in a ${existingOrder.status.toLowerCase()} order.` },
        { status: 409 }
      );
    }

    if (existingOrder.checkedIn) {
      return NextResponse.json(
        {
          error: "This pass was already checked in.",
          alreadyCheckedIn: true,
          order: existingOrder,
        },
        { status: 409 }
      );
    }

    const updated = await withDbRetry(() =>
      prisma.order.update({
        where: { id },
        data: {
          checkedIn: true,
          checkedInAt: new Date(),
          status:
            existingOrder.status === "RESERVED_PAY_AT_GATE"
              ? "COMPLETED"
              : existingOrder.status,
          verifiedAt: existingOrder.verifiedAt || new Date(),
        },
      })
    );

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error("Check-in error:", err);
    return NextResponse.json({ error: "Failed to record check-in" }, { status: 500 });
  }
}
