import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLiveCookieSettings } from "@/lib/cookie-settings";
import { CookieSettingsClient } from "@/components/admin/settings/CookieSettingsClient";

export const dynamic = "force-dynamic";

export default async function CookieSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const settings = await getLiveCookieSettings();
  return <CookieSettingsClient initialSettings={settings} />;
}
