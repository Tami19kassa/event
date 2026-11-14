import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma, withDbRetry } from "@/lib/prisma";
import { fetchAdminEventsSnapshot, fetchOrganizerSelectOptions } from "@/lib/events-admin";
import { EventsWorkspace } from "@/components/admin/events/EventsWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") redirect("/");

  const isAdmin = session.role === "ADMIN";
  const [snapshot, categories, organizerOptions] = await Promise.all([
    fetchAdminEventsSnapshot({ role: session.role, userId: session.id }),
    withDbRetry(() =>
      prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    ).catch(() => []),
    isAdmin ? fetchOrganizerSelectOptions() : Promise.resolve([]),
  ]);

  return (
    <EventsWorkspace
      initialEvents={snapshot.events}
      initialCurrency={snapshot.currency}
      isAdmin={isAdmin}
      categories={categories}
      organizerOptions={organizerOptions}
    />
  );
}
