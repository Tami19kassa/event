import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { fetchAdminEventsSnapshot, fetchOrganizerSelectOptions } from "@/lib/events-admin";
import { EventsWorkspace } from "@/components/admin/events/EventsWorkspace";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ categoryId?: string }>;
}

export default async function NewEventPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") redirect("/");

  const isAdmin = session.role === "ADMIN";
  const [params, snapshot, categories, organizerOptions] = await Promise.all([
    searchParams
      ? searchParams.catch(() => ({} as { categoryId?: string }))
      : Promise.resolve({} as { categoryId?: string }),
    fetchAdminEventsSnapshot({ role: session.role, userId: session.id }),
    withDbRetry(() =>
      prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    ).catch(() => []),
    isAdmin ? fetchOrganizerSelectOptions() : Promise.resolve([]),
  ]);

  const initialCategoryId =
    params?.categoryId && categories.some((c) => c.id === params.categoryId)
      ? params.categoryId
      : undefined;

  return (
    <EventsWorkspace
      initialEvents={snapshot.events}
      initialCurrency={snapshot.currency}
      isAdmin={isAdmin}
      categories={categories}
      organizerOptions={organizerOptions}
      autoOpenCreate={true}
      initialEditingEvent={initialCategoryId ? { categoryId: initialCategoryId } : undefined}
    />
  );
}
