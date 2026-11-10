import { getLiveThemeSettings } from "@/lib/settings";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const theme = await getLiveThemeSettings();
  return <AdminLoginForm siteName={theme.siteName} logoUrl={theme.logoUrl} />;
}
