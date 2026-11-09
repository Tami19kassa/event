import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 md:p-10">
      <EventForm mode="create" categories={categories} />
    </div>
  );
}
