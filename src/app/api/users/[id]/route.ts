import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { fetchUserActivityDetail, mapAdminUser } from "@/lib/users-admin";
import type { UserRole } from "@/lib/users-admin-helpers";

type Params = { params: Promise<{ id: string }> };
const VALID_ROLES = new Set<UserRole>(["ADMIN", "ORGANIZER", "ATTENDEE"]);

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const detail = await fetchUserActivityDetail(id);
    if (!detail) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch (err) {
    console.error("Fetch user detail failed:", err);
    return NextResponse.json({ error: "Failed to load user details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const target = await withDbRetry(() =>
      prisma.user.findUnique({ where: { id }, select: { id: true, role: true, passwordHash: true } })
    );
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data: Record<string, any> = {};

    if (typeof body?.name === "string") {
      data.name = body.name.trim().slice(0, 80) || null;
    }

    const newPassword = typeof body?.password === "string" ? body.password : "";
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (typeof body?.role === "string") {
      const nextRole = body.role.trim().toUpperCase() as UserRole;
      if (!VALID_ROLES.has(nextRole)) {
        return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
      }
      if (id === session.id && nextRole !== "ADMIN") {
        return NextResponse.json(
          { error: "You cannot demote your own active Admin account." },
          { status: 400 }
        );
      }
      if (target.role === "ADMIN" && nextRole !== "ADMIN") {
        const adminCount = await withDbRetry(() => prisma.user.count({ where: { role: "ADMIN" } }));
        if (adminCount <= 1) {
          return NextResponse.json(
            { error: "At least one Administrator account must remain active." },
            { status: 400 }
          );
        }
      }
      if ((nextRole === "ADMIN" || nextRole === "ORGANIZER") && !target.passwordHash && !newPassword) {
        return NextResponse.json(
          { error: "Set an 8+ character password before granting Organizer or Admin access." },
          { status: 400 }
        );
      }
      data.role = nextRole;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid changes provided." }, { status: 400 });
    }

    const updated = await withDbRetry(() =>
      prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          passwordHash: true,
          createdAt: true,
          _count: { select: { organizedEvents: true, orders: true } },
        },
      })
    );

    revalidatePath("/admin/users");
    return NextResponse.json(mapAdminUser(updated));
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "User not found" }, { status: 404 });
    console.error("Update user failed:", err);
    return NextResponse.json({ error: "Failed to update user account" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.id) {
    return NextResponse.json({ error: "You cannot delete your own active account." }, { status: 400 });
  }

  try {
    const target = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true, _count: { select: { organizedEvents: true, orders: true } } },
      })
    );
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (target.role === "ADMIN") {
      const adminCount = await withDbRetry(() => prisma.user.count({ where: { role: "ADMIN" } }));
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the last Administrator." }, { status: 400 });
      }
    }

    const { organizedEvents, orders } = target._count;
    if (organizedEvents > 0 || orders > 0) {
      return NextResponse.json(
        {
          error: `Account owns ${organizedEvents} event(s) and ${orders} order(s). Change role to Attendee to revoke admin access instead.`,
        },
        { status: 409 }
      );
    }

    await withDbRetry(() => prisma.user.delete({ where: { id } }));
    revalidatePath("/admin/users");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (err?.code === "P2003") {
      return NextResponse.json({ error: "Account has linked records and cannot be removed." }, { status: 409 });
    }
    console.error("Delete user failed:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
