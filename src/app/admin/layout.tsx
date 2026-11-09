import { getSession } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
