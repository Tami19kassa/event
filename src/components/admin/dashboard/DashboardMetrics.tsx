import Link from "next/link";
import { Calendar, Ticket, Coins, Mail } from "lucide-react";

interface MetricsProps {
  publishedEventsCount: number;
  draftEventsCount: number;
  upcomingEventsCount: number;
  verifiedRevenue: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  totalTierClaimed: number;
  totalTierCapacity: number;
  checkedInOrdersCount: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  currency: string;
}

export function DashboardMetrics({
  publishedEventsCount,
  draftEventsCount,
  upcomingEventsCount,
  verifiedRevenue,
  completedOrdersCount,
  pendingVerificationCount,
  totalTierClaimed,
  totalTierCapacity,
  checkedInOrdersCount,
  totalInquiriesCount,
  newInquiriesCount,
  currency,
}: MetricsProps) {
  const claimedPct =
    totalTierCapacity > 0 ? Math.round((totalTierClaimed / totalTierCapacity) * 100) : 0;

  const stats = [
    {
      label: "Published Events",
      value: publishedEventsCount.toLocaleString(),
      subtext:
        draftEventsCount > 0
          ? `${upcomingEventsCount} upcoming · ${draftEventsCount} draft${draftEventsCount === 1 ? "" : "s"}`
          : `${upcomingEventsCount} upcoming in catalog`,
      icon: Calendar,
      iconTone: "theme-icon-secondary",
      href: "/admin/events",
    },
    {
      label: "Verified Revenue",
      value: `${currency} ${verifiedRevenue.toLocaleString()}`,
      subtext:
        pendingVerificationCount > 0
          ? `${completedOrdersCount} paid · ${pendingVerificationCount} awaiting receipt`
          : `${completedOrdersCount} paid order${completedOrdersCount === 1 ? "" : "s"}`,
      icon: Coins,
      iconTone: "theme-icon-soft",
      href: "/admin/orders",
    },
    {
      label: "Ticket Inventory",
      value: `${claimedPct}% sold`,
      subtext: `${totalTierClaimed.toLocaleString()} / ${totalTierCapacity.toLocaleString()} seats · ${checkedInOrdersCount} checked in`,
      icon: Ticket,
      iconTone: "theme-icon-accent",
      href: "/admin/orders",
    },
    {
      label: "B2B Inquiries",
      value: totalInquiriesCount.toLocaleString(),
      subtext:
        newInquiriesCount > 0
          ? `${newInquiriesCount} unread request${newInquiriesCount === 1 ? "" : "s"}`
          : "All exhibitor & sponsor leads reviewed",
      icon: Mail,
      iconTone:
        newInquiriesCount > 0
          ? "theme-icon-accent"
          : "bg-slate-50 text-slate-600 border-slate-200/80",
      href: "/admin/inquiries",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="bg-white p-5 theme-radius-card border border-slate-200 shadow-2xs hover:border-[var(--color-primary)]/40 hover:shadow-sm transition-all flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">{s.label}</span>
            <div
              className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${s.iconTone}`}
            >
              <s.icon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-sans font-bold tracking-tight tabular-nums text-slate-900">
              {s.value}
            </div>
            <p className="text-xs text-slate-500 mt-1">{s.subtext}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
