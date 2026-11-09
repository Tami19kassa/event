import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
        // If they paid at gate upon arrival, upgrade to completed
        status: existingOrder.status === "RESERVED_PAY_AT_GATE" ? "COMPLETED" : existingOrder.status,
        verifiedAt: existingOrder.verifiedAt || new Date(),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error("Check-in error:", err);
    return NextResponse.json({ error: "Failed to record check-in" }, { status: 500 });
  }
}
