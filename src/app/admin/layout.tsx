import { getSession } from "@/lib/auth";
import { getLiveThemeSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { AdminThemeScope } from "@/components/admin/AdminThemeScope";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, theme] = await Promise.all([getSession(), getLiveThemeSettings()]);

  if (!session) {
    return (
      <AdminThemeScope initialTheme={theme}>
        <div className="min-h-screen bg-slate-50">{children}</div>
      </AdminThemeScope>
    );
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
    <AdminThemeScope initialTheme={theme}>
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
    </AdminThemeScope>
  );
}
