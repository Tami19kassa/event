import Link from "next/link";
import { Calendar, Users, Coins, Mail, ArrowUpRight } from "lucide-react";

interface MetricsProps {
  publishedEventsCount: number;
  totalEventsCount: number;
  upcomingEventsCount: number;
  verifiedRevenue: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  totalAttendees: number;
  checkedInOrdersCount: number;
  gatePendingCount: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  currency: string;
  cityLabel: string;
}

export function DashboardMetrics({
  publishedEventsCount,
  totalEventsCount,
  upcomingEventsCount,
  verifiedRevenue,
  completedOrdersCount,
  pendingVerificationCount,
  totalAttendees,
  checkedInOrdersCount,
  gatePendingCount,
  totalInquiriesCount,
  newInquiriesCount,
  currency,
  cityLabel,
}: MetricsProps) {
  const shortCity = cityLabel.split(",")[0]?.trim() || "Ethiopia";

  const stats = [
    {
      label: "Published Events",
      value: publishedEventsCount.toLocaleString(),
      detail: `${totalEventsCount} total · ${upcomingEventsCount} upcoming in ${shortCity}`,
      icon: Calendar,
      iconBg: "theme-bg-primary",
      href: "/admin/events",
    },
    {
      label: "Verified Revenue",
      value: `${currency} ${verifiedRevenue.toLocaleString()}`,
      detail: `${completedOrdersCount} paid order${completedOrdersCount === 1 ? "" : "s"}${
        pendingVerificationCount > 0 ? ` · ${pendingVerificationCount} awaiting verify` : ""
      }`,
      icon: Coins,
      iconBg: "theme-bg-secondary",
      href: "/admin/orders",
    },
    {
      label: "Issued Passes",
      value: totalAttendees.toLocaleString(),
      detail: `${checkedInOrdersCount} checked in · ${gatePendingCount} gate hold${
        gatePendingCount === 1 ? "" : "s"
      }`,
      icon: Users,
      iconBg: "theme-bg-accent",
      href: "/admin/orders",
    },
    {
      label: "B2B Inquiries",
      value: totalInquiriesCount.toLocaleString(),
      detail:
        newInquiriesCount > 0
          ? `${newInquiriesCount} unread exhibitor & sponsor lead${
              newInquiriesCount === 1 ? "" : "s"
            }`
          : "All exhibitor & sponsor leads reviewed",
      icon: Mail,
      iconBg: "bg-slate-900 text-white",
      href: "/admin/inquiries",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="group bg-white p-5 theme-radius-card border border-slate-200 shadow-xs hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {s.label}
            </span>
            <div
              className={`w-10 h-10 theme-radius-sm ${s.iconBg} flex items-center justify-center shadow-xs shrink-0`}
            >
              <s.icon className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-display text-slate-900 tracking-tight truncate">
              {s.value}
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-xs text-slate-500 font-medium truncate">{s.detail}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[var(--color-primary)] shrink-0 transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
