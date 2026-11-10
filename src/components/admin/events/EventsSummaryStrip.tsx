import { Globe, Clock, Star, Ticket } from "lucide-react";
import type { AdminEventRow } from "./AdminEventsTable";

interface Props {
  events: AdminEventRow[];
}

export function EventsSummaryStrip({ events }: Props) {
  const liveCount = events.filter((e) => e.status === "PUBLISHED" || e.status === "LIVE").length;
  const draftCount = events.filter((e) => e.status === "DRAFT").length;
  const featuredCount = events.filter((e) => e.isFeatured).length;

  let totalCapacity = 0;
  let totalRemaining = 0;
  for (const evt of events) {
    if (evt.ticketTiers && evt.ticketTiers.length > 0) {
      for (const tier of evt.ticketTiers) {
        totalCapacity += tier.quantity || 0;
        totalRemaining += Math.min(tier.quantity || 0, tier.remaining || 0);
      }
    } else {
      totalCapacity += evt.capacity || 0;
      totalRemaining += evt.capacity || 0;
    }
  }
  const totalSold = Math.max(0, totalCapacity - totalRemaining);
  const claimedPct = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  const tiles = [
    {
      label: "Live on Site",
      value: liveCount.toLocaleString(),
      sub: `${events.length} total catalog items`,
      icon: Globe,
      tone: "theme-icon-secondary",
    },
    {
      label: "Draft Queue",
      value: draftCount.toLocaleString(),
      sub: draftCount > 0 ? "Hidden until published" : "All events published",
      icon: Clock,
      tone: "bg-slate-50 text-slate-600 border-slate-200",
    },
    {
      label: "Featured on Home",
      value: featuredCount.toLocaleString(),
      sub: "Shown in Featured Highlights",
      icon: Star,
      tone: "theme-icon-accent",
    },
    {
      label: "Ticket Inventory",
      value: `${claimedPct}% sold`,
      sub: `${totalSold.toLocaleString()} / ${totalCapacity.toLocaleString()} passes`,
      icon: Ticket,
      tone: "theme-icon-soft",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="bg-white px-4 py-3.5 theme-radius-card border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">
              {t.label}
            </span>
            <div className="text-lg sm:text-xl font-sans font-bold text-slate-900 tabular-nums mt-0.5">
              {t.value}
            </div>
            <span className="text-[11px] text-slate-400 block truncate">{t.sub}</span>
          </div>
          <div
            className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${t.tone}`}
          >
            <t.icon className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
