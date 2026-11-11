import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ categoryId?: string }>;
}

export default async function NewEventPage({ searchParams }: PageProps) {
  const [params, session, categories, payments] = await Promise.all([
    searchParams ? searchParams.catch(() => ({} as { categoryId?: string })) : Promise.resolve({} as { categoryId?: string }),
    getSession(),
    withDbRetry(() =>
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    ).catch(() => []),
    getPublicPaymentSettings(),
  ]);

  const initialCategoryId =
    params?.categoryId && categories.some((c) => c.id === params.categoryId)
      ? params.categoryId
      : undefined;

  return (
    <div className="p-5 sm:p-6 md:p-8">
      <EventForm
        mode="create"
        initialData={initialCategoryId ? { categoryId: initialCategoryId } : undefined}
        categories={categories}
        currency={payments.currency || "ETB"}
        canCreateCategory={session?.role === "ADMIN"}
      />
    </div>
  );
}
