import Link from "next/link";
import { ArrowRight, ExternalLink, Pencil } from "lucide-react";

function formatEventDateAddis(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Addis_Ababa",
  }).format(new Date(date));
}

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
      return { label: "Live", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    case "PUBLISHED":
      return { label: "Published", className: "theme-badge-secondary border" };
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
    <section className="bg-white theme-radius-card border border-slate-200 p-5 shadow-2xs flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
        <h2 className="font-sans font-bold text-slate-900 text-sm">Recent Events</h2>
        <Link
          href="/admin/events"
          className="text-xs font-semibold text-[var(--color-secondary-ink,var(--color-secondary))] hover:opacity-80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
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
            const soldQty = Math.max(0, totalQty - remainingQty);
            const fillPct = totalQty > 0 ? Math.min(100, Math.round((soldQty / totalQty) * 100)) : 0;
            const barColor =
              fillPct >= 95
                ? "#10B981"
                : fillPct >= 75
                ? "var(--color-accent)"
                : "var(--color-secondary)";
            const isPublic = evt.status === "PUBLISHED" || evt.status === "LIVE";

            return (
              <div key={evt.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm truncate">
                      {evt.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between gap-2">
                    <span className="truncate">
                      {evt.locationCity || shortCity} · {formatEventDateAddis(evt.startDate)}
                    </span>
                    {totalQty > 0 && (
                      <span className="tabular-nums font-semibold text-slate-700 shrink-0">
                        {fillPct}% ({remainingQty.toLocaleString()} left)
                      </span>
                    )}
                  </div>

                  {totalQty > 0 && (
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.max(4, fillPct)}%`, backgroundColor: barColor }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isPublic && (
                    <Link
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      title="Preview public page"
                      className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 theme-radius-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/events/${evt.id}/edit`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 theme-radius-sm transition"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
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
