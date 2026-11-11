import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { formatInEventTimezone } from "@/lib/event-form-types";
import { fetchOrganizerSelectOptions } from "@/lib/events-admin";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") {
    redirect("/");
  }

  const isAdmin = session.role === "ADMIN";
  const { id } = await params;
  const [event, categories, payments, organizerOptions] = await Promise.all([
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
    isAdmin ? fetchOrganizerSelectOptions() : Promise.resolve([]),
  ]);

  if (!event) {
    notFound();
  }

  if (!isAdmin && event.organizerId !== session.id) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <div className="p-5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>Forbidden: You do not have permission to edit this event.</span>
          <Link
            href="/admin/events"
            className="inline-flex items-center px-3.5 py-2 bg-white border border-rose-200 text-rose-700 font-bold text-xs theme-radius-sm hover:bg-rose-100/50 transition shrink-0"
          >
            Back to My Events
          </Link>
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
    organizerId: event.organizerId || session.id,
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
        canCreateCategory={isAdmin}
        organizerOptions={organizerOptions}
      />
    </div>
  );
}
