import { getSession } from "@/lib/auth";
import { getThemeSettings } from "@/lib/settings";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, theme] = await Promise.all([getSession(), getThemeSettings()]);

  if (!session) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <AdminLayoutShell
      siteName={theme.siteName}
      logoUrl={theme.logoUrl}
      logoDarkUrl={theme.logoDarkUrl}
    >
      {children}
    </AdminLayoutShell>
  );
}
