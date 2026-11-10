import { prisma } from "@/lib/prisma";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const [categories, payments] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    getPublicPaymentSettings(),
  ]);

  return (
    <div className="p-5 sm:p-6 md:p-8">
      <EventForm
        mode="create"
        categories={categories}
        currency={payments.currency || "ETB"}
      />
    </div>
  );
}
