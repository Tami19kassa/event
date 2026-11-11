import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPaymentSettings } from "@/lib/payment-verification";
import { PaymentSettingsClient } from "@/components/admin/settings/PaymentSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const settings = await getPaymentSettings();
  return <PaymentSettingsClient initialSettings={settings} />;
}
