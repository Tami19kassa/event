import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = [
  "PENDING",
  "PENDING_VERIFICATION",
  "RESERVED_PAY_AT_GATE",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
] as const;

const STOCK_HOLDING_STATUSES = new Set([
  "COMPLETED",
  "PENDING_VERIFICATION",
  "RESERVED_PAY_AT_GATE",
]);

const RELEASED_STATUSES = new Set(["CANCELLED", "FAILED", "REJECTED"]);

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      const wasHolding = STOCK_HOLDING_STATUSES.has(existing.status);
      const wasReleased = RELEASED_STATUSES.has(existing.status);
      const willHold = STOCK_HOLDING_STATUSES.has(status);
      const willRelease = RELEASED_STATUSES.has(status);
      const totalTickets = existing.items.reduce((sum, item) => sum + item.quantity, 0);

      // Restore inventory cleanly when cancelling/failing an active reservation
      if (wasHolding && willRelease) {
        for (const item of existing.items) {
          if (item.ticketTierId) {
            await tx.ticketTier.updateMany({
              where: { id: item.ticketTierId },
              data: { remaining: { increment: item.quantity } },
            });
          }
        }
        if (totalTickets > 0) {
          await tx.event.update({
            where: { id: existing.eventId },
            data: { attendeesCount: { decrement: totalTickets } },
          });
        }
      } else if (wasReleased && willHold) {
        for (const item of existing.items) {
          if (item.ticketTierId) {
            const dec = await tx.ticketTier.updateMany({
              where: { id: item.ticketTierId, remaining: { gte: item.quantity } },
              data: { remaining: { decrement: item.quantity } },
            });
            if (dec.count === 0) {
              throw new Error(`INSUFFICIENT_STOCK:${item.ticketName}`);
            }
          }
        }
        if (totalTickets > 0) {
          await tx.event.update({
            where: { id: existing.eventId },
            data: { attendeesCount: { increment: totalTickets } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: {
          status,
          verifiedAt: status === "COMPLETED" ? existing.verifiedAt || new Date() : existing.verifiedAt,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/discover");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (typeof err?.message === "string" && err.message.startsWith("INSUFFICIENT_STOCK:")) {
      const tierName = err.message.replace("INSUFFICIENT_STOCK:", "");
      return NextResponse.json(
        { error: `Insufficient remaining tickets to reactivate order (${tierName}).` },
        { status: 409 }
      );
    }
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
