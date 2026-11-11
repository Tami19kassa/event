import { Layers, Globe, AlertTriangle, TrendingUp } from "lucide-react";
import type { AdminCategoryRow } from "@/lib/categories-admin";

interface Props {
  categories: AdminCategoryRow[];
}

export function CategoriesSummaryStrip({ categories }: Props) {
  const activeCount = categories.filter((c) => c.totalCount > 0).length;
  const emptyCount = categories.filter((c) => c.totalCount === 0).length;
  const totalLive = categories.reduce((sum, c) => sum + c.liveCount, 0);
  const totalLinked = categories.reduce((sum, c) => sum + c.totalCount, 0);
  const topType = [...categories].sort((a, b) => b.liveCount - a.liveCount || b.totalCount - a.totalCount)[0];
  const topShare = totalLive > 0 && topType ? Math.round((topType.liveCount / totalLive) * 100) : 0;

  const tiles = [
    {
      label: "Event Types",
      value: categories.length.toLocaleString(),
      sub: `${activeCount} populated on catalog`,
      icon: Layers,
      tone: "theme-icon-soft",
    },
    {
      label: "Live Categorized",
      value: totalLive.toLocaleString(),
      sub: `${totalLinked.toLocaleString()} total incl. drafts`,
      icon: Globe,
      tone: "theme-icon-secondary",
    },
    {
      label: "Empty Categories",
      value: emptyCount.toLocaleString(),
      sub: emptyCount > 0 ? "Visible on homepage with 0 events" : "All categories have events",
      icon: AlertTriangle,
      tone: emptyCount > 0 ? "theme-icon-accent" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Top Category",
      value: topType ? `${topType.icon} ${topType.name}` : "—",
      sub: topType ? `${topType.liveCount} live (${topShare}% of catalog)` : "No data yet",
      icon: TrendingUp,
      tone: "bg-slate-50 text-slate-700 border-slate-200",
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
            <div className="text-base sm:text-lg font-sans font-bold text-slate-900 tabular-nums mt-0.5 truncate">
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
