import Link from "next/link";
import { Calendar, Users, Coins, Mail } from "lucide-react";

interface MetricsProps {
  publishedEventsCount: number;
  draftEventsCount: number;
  verifiedRevenue: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  totalAttendees: number;
  checkedInOrdersCount: number;
  totalInquiriesCount: number;
  newInquiriesCount: number;
  currency: string;
}

export function DashboardMetrics({
  publishedEventsCount,
  draftEventsCount,
  verifiedRevenue,
  completedOrdersCount,
  pendingVerificationCount,
  totalAttendees,
  checkedInOrdersCount,
  totalInquiriesCount,
  newInquiriesCount,
  currency,
}: MetricsProps) {
  const stats = [
    {
      label: "Published Events",
      value: publishedEventsCount.toLocaleString(),
      subtext:
        draftEventsCount > 0
          ? `${draftEventsCount} draft${draftEventsCount === 1 ? "" : "s"} saved`
          : "All catalog items live",
      icon: Calendar,
      featured: false,
      href: "/admin/events",
    },
    {
      label: "Verified Revenue",
      value: `${currency} ${verifiedRevenue.toLocaleString()}`,
      subtext:
        pendingVerificationCount > 0
          ? `${completedOrdersCount} paid · ${pendingVerificationCount} pending`
          : `${completedOrdersCount} paid order${completedOrdersCount === 1 ? "" : "s"}`,
      icon: Coins,
      featured: true,
      href: "/admin/orders",
    },
    {
      label: "Event Attendees",
      value: totalAttendees.toLocaleString(),
      subtext: `${checkedInOrdersCount} checked in at gate`,
      icon: Users,
      featured: false,
      href: "/admin/orders",
    },
    {
      label: "B2B Inquiries",
      value: totalInquiriesCount.toLocaleString(),
      subtext:
        newInquiriesCount > 0
          ? `${newInquiriesCount} unread request${newInquiriesCount === 1 ? "" : "s"}`
          : "All leads reviewed",
      icon: Mail,
      featured: false,
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
              className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${
                s.featured
                  ? "theme-icon-soft"
                  : "bg-slate-50 text-slate-600 border-slate-200/80"
              }`}
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
