import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, ExternalLink, Pencil, Ticket } from "lucide-react";

export type RecentEventRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  startDate: Date | string;
  locationCity: string | null;
  category?: { name: string } | null;
  ticketTiers?: { quantity: number; remaining: number }[];
};

function getEventStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "LIVE":
      return { label: "Live", className: "theme-badge-secondary border" };
    case "PUBLISHED":
      return { label: "Published", className: "theme-badge border" };
    case "DRAFT":
      return { label: "Draft", className: "bg-slate-100 text-slate-600 border border-slate-200" };
    case "CANCELLED":
    case "ENDED":
      return {
        label: status === "CANCELLED" ? "Cancelled" : "Ended",
        className: "bg-rose-50 text-rose-700 border border-rose-200",
      };
    default:
      return { label: status, className: "bg-slate-100 text-slate-600 border border-slate-200" };
  }
}

export function RecentEventsPanel({
  events,
  defaultCity,
}: {
  events: RecentEventRow[];
  defaultCity: string;
}) {
  const shortCity = defaultCity.split(",")[0]?.trim() || "Addis Ababa";

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-6 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-display text-slate-900 text-base">Recent Events</h2>
          <p className="text-xs text-slate-400">Latest catalog updates &amp; ticket stock</p>
        </div>
        <Link
          href="/admin/events"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 flex items-center gap-1"
        >
          Manage all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 flex-1">
        {events.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No events created yet.</p>
        ) : (
          events.map((evt) => {
            const badge = getEventStatusBadge(evt.status);
            const totalQty = (evt.ticketTiers || []).reduce((s, t) => s + t.quantity, 0);
            const remainingQty = (evt.ticketTiers || []).reduce((s, t) => s + t.remaining, 0);
            const isPublic = evt.status === "PUBLISHED" || evt.status === "LIVE";

            return (
              <div key={evt.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{evt.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {evt.category?.name ? `${evt.category.name} · ` : ""}
                    {evt.locationCity || shortCity} · {format(new Date(evt.startDate), "MMM d, yyyy")}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {totalQty > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 theme-radius-sm">
                      <Ticket className="w-3 h-3 text-slate-400" />
                      {remainingQty === 0 ? "Sold out" : `${remainingQty}/${totalQty} left`}
                    </span>
                  )}
                  {isPublic && (
                    <Link
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      title="Preview public page"
                      className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 theme-radius-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/events/${evt.id}/edit`}
                    title="Edit event"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 theme-radius-sm transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
