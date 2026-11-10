import { getSession } from "@/lib/auth";
import { getThemeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, theme] = await Promise.all([getSession(), getThemeSettings()]);

  if (!session) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  let ordersAttention = 0;
  let newInquiries = 0;

  try {
    const [pendingReceipts, gateAwaiting, unreadInquiries] = await Promise.all([
      prisma.order.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.order.count({
        where: { status: "RESERVED_PAY_AT_GATE", checkedIn: false },
      }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
    ]);
    ordersAttention = pendingReceipts + gateAwaiting;
    newInquiries = unreadInquiries;
  } catch {
    // Keep shell resilient if DB counts fail transiently
  }

  return (
    <AdminLayoutShell
      siteName={theme.siteName}
      logoUrl={theme.logoUrl}
      logoDarkUrl={theme.logoDarkUrl}
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
      }}
      navBadges={{
        orders: ordersAttention,
        inquiries: newInquiries,
      }}
    >
      {children}
    </AdminLayoutShell>
  );
}
