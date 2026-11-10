import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const [session, categories, payments] = await Promise.all([
    getSession(),
    withDbRetry(() =>
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    ).catch(() => []),
    getPublicPaymentSettings(),
  ]);

  return (
    <div className="p-5 sm:p-6 md:p-8">
      <EventForm
        mode="create"
        categories={categories}
        currency={payments.currency || "ETB"}
        canCreateCategory={session?.role === "ADMIN"}
      />
    </div>
  );
}
