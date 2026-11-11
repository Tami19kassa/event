import type { AdminEventRow } from "./AdminEventsTable";
import type { EventStatusFilter } from "./EventsFilterBar";

export function formatEventDateAddis(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Addis_Ababa",
  }).format(new Date(iso));
}

export function getEventStatusPill(status: string) {
  if (status === "LIVE") {
    return {
      label: "Live",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      live: true,
    };
  }
  if (status === "PUBLISHED") {
    return { label: "Published", cls: "theme-badge-secondary hover:brightness-95", live: true };
  }
  if (status === "CANCELLED" || status === "ENDED") {
    return {
      label: status === "CANCELLED" ? "Cancelled" : "Ended",
      cls: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-slate-100",
      live: false,
    };
  }
  return {
    label: "Draft",
    cls: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
    live: false,
  };
}

export function computeEventRowStats(evt: AdminEventRow) {
  const hasTiers = Boolean(evt.ticketTiers && evt.ticketTiers.length > 0);
  const totalRemaining = hasTiers
    ? evt.ticketTiers.reduce((s, t) => s + t.remaining, 0)
    : evt.capacity;
  const totalQty = hasTiers
    ? evt.ticketTiers.reduce((s, t) => s + t.quantity, 0)
    : evt.capacity;
  const soldCount = Math.max(0, totalQty - totalRemaining);
  const fillPct = totalQty > 0 ? Math.min(100, Math.round((soldCount / totalQty) * 100)) : 0;
  const barColor =
    fillPct >= 95 ? "#10B981" : fillPct >= 75 ? "var(--color-accent)" : "var(--color-secondary)";
  const prices = evt.ticketTiers?.map((t) => t.price) || [];
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const orderCount = evt._count?.orders || 0;
  return { totalQty, soldCount, fillPct, barColor, minPrice, orderCount };
}

export function filterAdminEvents(
  events: AdminEventRow[],
  search: string,
  statusFilter: EventStatusFilter,
  featuredOnly: boolean
) {
  const q = search.trim().toLowerCase();
  return events.filter((e) => {
    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q) ||
      (e.locationCity || "").toLowerCase().includes(q) ||
      (e.locationName || "").toLowerCase().includes(q) ||
      (e.category?.name || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ARCHIVED"
        ? e.status === "ENDED" || e.status === "CANCELLED"
        : e.status === statusFilter;
    const matchFeatured = !featuredOnly || Boolean(e.isFeatured);
    return matchSearch && matchStatus && matchFeatured;
  });
}

export async function duplicateEventAsDraft(eventId: string, defaultCurrency = "ETB") {
  const srcRes = await fetch(`/api/events/${eventId}`);
  const full = await srcRes.json();
  if (!srcRes.ok) throw new Error(full.error || "Could not load event copy source");

  const createRes = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `${full.title} (Copy)`,
      slug: `${full.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
      shortDescription: full.shortDescription || "",
      description: full.description || "",
      imageUrl: full.imageUrl || "",
      startDate: full.startDate,
      endDate: full.endDate,
      timezone: full.timezone || "Africa/Addis_Ababa",
      format: full.format,
      status: "DRAFT",
      capacity: full.capacity,
      isFeatured: false,
      locationName: full.locationName || "",
      locationAddress: full.locationAddress || "",
      locationCity: full.locationCity || "",
      locationCountry: full.locationCountry || "Ethiopia",
      categoryId: full.categoryId || "",
      ticketTiers: (full.ticketTiers || []).map((t: any) => ({
        name: t.name,
        description: t.description || "",
        price: t.price,
        currency: t.currency || defaultCurrency,
        quantity: t.quantity,
        earlyBird: Boolean(t.earlyBird),
      })),
      speakers: (full.speakers || []).map((s: any) => ({
        name: s.name,
        title: s.title || "",
        company: s.company || "",
        bio: s.bio || "",
        imageUrl: s.imageUrl || "",
      })),
      agendaItems: (full.agendaItems || []).map((a: any) => ({
        time: a.time,
        title: a.title,
        description: a.description || "",
      })),
    }),
  });
  const created = await createRes.json();
  if (!createRes.ok) throw new Error(created.error || "Duplicate failed");
  return created;
}
