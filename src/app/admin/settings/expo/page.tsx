import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLiveExpoSettings } from "@/lib/expo-settings";
import { ExpoSettingsClient } from "@/components/admin/settings/ExpoSettingsClient";

export const dynamic = "force-dynamic";

export default async function ExpoSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const { slides, sponsors, scrollInterval } = await getLiveExpoSettings();

  return (
    <ExpoSettingsClient
      initialSlides={slides}
      initialSponsors={sponsors}
      initialScrollInterval={scrollInterval}
    />
  );
}
