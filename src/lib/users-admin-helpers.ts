export type UserRole = "ADMIN" | "ORGANIZER" | "ATTENDEE";
export type UserRoleFilter = "ALL" | UserRole;

export interface AdminUserItem {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatarUrl: string | null;
  hasPassword: boolean;
  createdAt: string;
  organizedEventsCount: number;
  ordersCount: number;
}

export interface AdminUsersSummary {
  totalCount: number;
  adminCount: number;
  organizerCount: number;
  attendeeCount: number;
  buyersCount: number;
}

export interface UserActivityDetail extends AdminUserItem {
  recentEvents: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    startDate: string;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
    eventTitle: string;
  }>;
}

export const ROLE_META: Record<
  UserRole,
  { label: string; badgeClass: string; desc: string }
> = {
  ADMIN: {
    label: "Admin",
    badgeClass: "theme-badge border",
    desc: "Full access to orders, B2B inquiries, branding, payments, and users",
  },
  ORGANIZER: {
    label: "Organizer",
    badgeClass: "theme-badge-secondary border",
    desc: "Can manage assigned events, door gate check-ins, and event media",
  },
  ATTENDEE: {
    label: "Attendee",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
    desc: "Public buyer account — no access to /admin workspace",
  },
};

export function normalizeRole(raw: unknown): UserRole {
  const val = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  if (val === "ADMIN" || val === "ORGANIZER" || val === "ATTENDEE") return val;
  return "ATTENDEE";
}

export function filterAdminUsers(
  users: AdminUserItem[],
  search: string,
  roleFilter: UserRoleFilter
): AdminUserItem[] {
  const q = search.trim().toLowerCase();
  return users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      Boolean(u.name && u.name.toLowerCase().includes(q)) ||
      u.id.toLowerCase().includes(q)
    );
  });
}

export function formatAdminUserDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Africa/Addis_Ababa",
    });
  } catch {
    return iso;
  }
}

function csvEscape(raw: unknown): string {
  let str = String(raw ?? "");
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

export function buildUsersCsv(users: AdminUserItem[]): string {
  const headers = ["Name", "Email", "Role", "Login Ready", "Events Hosted", "Orders Placed", "Joined"];
  const rows = users.map((u) =>
    [
      u.name || "Unnamed",
      u.email,
      u.role,
      u.hasPassword ? "Yes" : "No",
      u.organizedEventsCount,
      u.ordersCount,
      formatAdminUserDate(u.createdAt),
    ]
      .map(csvEscape)
      .join(",")
  );
  return [headers.map(csvEscape).join(","), ...rows].join("\n");
}

export function generateStrongPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

export function downloadUsersCsv(users: AdminUserItem[]): void {
  const csv = buildUsersCsv(users);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `utopia-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

