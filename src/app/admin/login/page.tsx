import { getThemeSettings } from "@/lib/settings";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const theme = await getThemeSettings();
  return <AdminLoginForm siteName={theme.siteName} logoUrl={theme.logoUrl} />;
}
