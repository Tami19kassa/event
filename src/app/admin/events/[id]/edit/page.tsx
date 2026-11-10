"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventForm, EventFormData } from "@/components/admin/EventForm";
import { RefreshCw } from "lucide-react";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<(Partial<EventFormData> & { id: string }) | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/events/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([event, cats]) => {
        if (event.error) {
          setError(event.error);
          return;
        }

        if (Array.isArray(cats)) {
          setCategories(cats);
        }

        const toLocal = (d: string) => {
          const date = new Date(d);
          const offset = date.getTimezoneOffset();
          const local = new Date(date.getTime() - offset * 60000);
          return local.toISOString().slice(0, 16);
        };

        setData({
          id: event.id,
          title: event.title,
          slug: event.slug,
          shortDescription: event.shortDescription || "",
          description: event.description || "",
          imageUrl: event.imageUrl || "",
          startDate: toLocal(event.startDate),
          endDate: toLocal(event.endDate),
          timezone: event.timezone || "Africa/Addis_Ababa",
          format: event.format,
          status: event.status,
          capacity: event.capacity,
          isFeatured: event.isFeatured,
          locationName: event.locationName || "",
          locationAddress: event.locationAddress || "",
          locationCity: event.locationCity || "Addis Ababa",
          locationCountry: event.locationCountry || "Ethiopia",
          categoryId: event.categoryId || "",
          ticketTiers: (event.ticketTiers || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            price: t.price,
            quantity: t.quantity,
            remaining: t.remaining,
            description: t.description || "",
            earlyBird: t.earlyBird,
          })),
          speakers: (event.speakers || []).map((s: any) => ({
            id: s.id,
            name: s.name || "",
            title: s.title || "",
            company: s.company || "",
            bio: s.bio || "",
            imageUrl: s.imageUrl || "",
          })),
          agendaItems: (event.agendaItems || []).map((a: any) => ({
            id: a.id,
            time: a.time || "",
            title: a.title || "",
            description: a.description || "",
          })),
        });
      })
      .catch(() => setError("Failed to load event"));
  }, [id]);

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-xl">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <EventForm mode="edit" initialData={data} categories={categories} />
    </div>
  );
}
