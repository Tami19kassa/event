import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { formatInEventTimezone } from "@/lib/event-form-types";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const [session, event, categories, payments] = await Promise.all([
    getSession(),
    withDbRetry(() =>
      prisma.event.findUnique({
        where: { id },
        include: {
          ticketTiers: { orderBy: { sortOrder: "asc" } },
          speakers: { orderBy: { sortOrder: "asc" } },
          agendaItems: { orderBy: { sortOrder: "asc" } },
        },
      })
    ),
    withDbRetry(() =>
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    ).catch(() => []),
    getPublicPaymentSettings(),
  ]);

  if (!event) {
    notFound();
  }

  if (session && session.role !== "ADMIN" && event.organizerId !== session.id) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 theme-radius text-sm font-medium">
          Forbidden: You do not have permission to edit this event.
        </div>
      </div>
    );
  }

  const tz = event.timezone || "Africa/Addis_Ababa";
  const initialData = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription || "",
    description: event.description || "",
    imageUrl: event.imageUrl || "",
    startDate: formatInEventTimezone(event.startDate, tz),
    endDate: formatInEventTimezone(event.endDate, tz),
    timezone: tz,
    format: event.format as "IN_PERSON" | "ONLINE" | "HYBRID",
    status: event.status as "DRAFT" | "PUBLISHED" | "LIVE" | "ENDED" | "CANCELLED",
    capacity: event.capacity,
    isFeatured: event.isFeatured,
    locationName: event.locationName || "",
    locationAddress: event.locationAddress || "",
    locationCity: event.locationCity || "Addis Ababa",
    locationCountry: event.locationCountry || "Ethiopia",
    categoryId: event.categoryId || "",
    ticketTiers: event.ticketTiers.map((t) => ({
      id: t.id,
      name: t.name,
      price: Number(t.price),
      quantity: t.quantity,
      remaining: t.remaining,
      soldCount: Math.max(0, t.quantity - t.remaining),
      description: t.description || "",
      earlyBird: Boolean(t.earlyBird),
    })),
    speakers: event.speakers.map((s) => ({
      id: s.id,
      name: s.name || "",
      title: s.title || "",
      company: s.company || "",
      bio: s.bio || "",
      imageUrl: s.imageUrl || "",
    })),
    agendaItems: event.agendaItems.map((a) => ({
      id: a.id,
      time: a.time || "",
      title: a.title || "",
      description: a.description || "",
    })),
  };

  return (
    <div className="p-5 sm:p-6 md:p-8">
      <EventForm
        mode="edit"
        initialData={initialData}
        categories={categories}
        currency={payments.currency || "ETB"}
        canCreateCategory={session?.role === "ADMIN"}
      />
    </div>
  );
}
