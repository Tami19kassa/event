import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminEventsSnapshot } from "@/lib/events-admin";
import { EventsWorkspace } from "@/components/admin/events/EventsWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") {
    redirect("/");
  }

  const snapshot = await fetchAdminEventsSnapshot({
    role: session.role,
    userId: session.id,
  });

  return (
    <EventsWorkspace
      initialEvents={snapshot.events}
      initialCurrency={snapshot.currency}
      isAdmin={session.role === "ADMIN"}
    />
  );
}
