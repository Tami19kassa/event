import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLiveThemeSettings } from "@/lib/settings";
import { BrandingSettingsClient } from "@/components/admin/settings/BrandingSettingsClient";

export const dynamic = "force-dynamic";

export default async function BrandingSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const theme = await getLiveThemeSettings();
  return <BrandingSettingsClient initialSettings={theme} />;
}
