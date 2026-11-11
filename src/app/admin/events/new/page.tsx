import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { fetchOrganizerSelectOptions } from "@/lib/events-admin";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ categoryId?: string }>;
}

export default async function NewEventPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") {
    redirect("/");
  }

  const isAdmin = session.role === "ADMIN";
  const [params, categories, payments, organizerOptions] = await Promise.all([
    searchParams
      ? searchParams.catch(() => ({} as { categoryId?: string }))
      : Promise.resolve({} as { categoryId?: string }),
    withDbRetry(() =>
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    ).catch(() => []),
    getPublicPaymentSettings(),
    isAdmin ? fetchOrganizerSelectOptions() : Promise.resolve([]),
  ]);

  const initialCategoryId =
    params?.categoryId && categories.some((c) => c.id === params.categoryId)
      ? params.categoryId
      : undefined;

  return (
    <div className="p-5 sm:p-6 md:p-8">
      <EventForm
        mode="create"
        initialData={{
          ...(initialCategoryId ? { categoryId: initialCategoryId } : {}),
          organizerId: session.id,
        }}
        categories={categories}
        currency={payments.currency || "ETB"}
        canCreateCategory={isAdmin}
        organizerOptions={organizerOptions}
      />
    </div>
  );
}
