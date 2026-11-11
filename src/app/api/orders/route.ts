import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { fetchAdminOrdersSnapshot } from "@/lib/orders-admin";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const scope = req.nextUrl.searchParams.get("scope");
    if (scope === "admin") {
      const limit = Math.min(250, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 250));
      const snapshot = await fetchAdminOrdersSnapshot({
        role: session.role,
        userId: session.id,
        limit,
      });
      return NextResponse.json(snapshot);
    }

    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(250, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 150));

    const where =
      session.role === "ADMIN"
        ? {}
        : { event: { organizerId: session.id } };

    const [total, orders] = await Promise.all([
      withDbRetry(() => prisma.order.count({ where })),
      withDbRetry(() =>
        prisma.order.findMany({
          where,
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
              },
            },
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: (page - 1) * limit,
        })
      ),
    ]);

    return NextResponse.json(orders, {
      headers: {
        "X-Total-Count": String(total),
        "X-Page": String(page),
        "X-Limit": String(limit),
      },
    });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
