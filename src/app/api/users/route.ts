import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { fetchAdminUsersSnapshot, mapAdminUser } from "@/lib/users-admin";
import type { UserRole } from "@/lib/users-admin-helpers";

const VALID_ROLES = new Set<UserRole>(["ADMIN", "ORGANIZER", "ATTENDEE"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const snapshot = await fetchAdminUsersSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("Fetch users error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
    const roleRaw = typeof body?.role === "string" ? body.role.trim().toUpperCase() : "ORGANIZER";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Provide a valid email address." }, { status: 400 });
    }
    if (!VALID_ROLES.has(roleRaw as UserRole)) {
      return NextResponse.json({ error: "Invalid user role." }, { status: 400 });
    }
    const role = roleRaw as UserRole;

    if ((role === "ADMIN" || role === "ORGANIZER") && password.length < 8) {
      return NextResponse.json(
        { error: "Staff accounts (Admin or Organizer) require an 8+ character password." },
        { status: 400 }
      );
    }
    if (password && password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await withDbRetry(() =>
      prisma.user.findUnique({ where: { email }, select: { id: true } })
    );
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const created = await withDbRetry(() =>
      prisma.user.create({
        data: {
          email,
          name: name || null,
          role,
          passwordHash,
        },
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
    return NextResponse.json(mapAdminUser(created), { status: 201 });
  } catch (err: any) {
    console.error("Create user error:", err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Email address already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
