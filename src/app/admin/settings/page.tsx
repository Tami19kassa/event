import { getLiveThemeSettings } from "@/lib/settings";
import { BrandingSettingsClient } from "@/components/admin/settings/BrandingSettingsClient";

export const dynamic = "force-dynamic";

export default async function BrandingSettingsPage() {
  const theme = await getLiveThemeSettings();
  return <BrandingSettingsClient initialSettings={theme} />;
}
