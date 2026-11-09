import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await req.json();

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
