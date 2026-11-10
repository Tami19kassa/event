import Link from "next/link";
import { Plus, QrCode, Clapperboard } from "lucide-react";
import { getThemeSettings } from "@/lib/settings";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { getAdminDashboardSnapshot } from "@/lib/admin-dashboard-data";
import { DashboardAttentionBar } from "@/components/admin/dashboard/DashboardAttentionBar";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { RecentActivityTables } from "@/components/admin/dashboard/RecentActivityTables";
import { DashboardOpsStrip } from "@/components/admin/dashboard/DashboardOpsStrip";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [theme, payments, data] = await Promise.all([
    getThemeSettings(),
    getPublicPaymentSettings(),
    getAdminDashboardSnapshot(),
  ]);

  const currency = payments.currency || "ETB";
  const cityLabel = theme.contactCity || "Addis Ababa, Ethiopia";

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Command Center · {cityLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-slate-900">
            {theme.siteName} Operations Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track live ticketing, receipt approvals, venue gate arrivals, and B2B leads in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 theme-radius-sm hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition shadow-2xs"
          >
            <QrCode className="w-4 h-4" />
            Gate &amp; Orders
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 theme-radius-sm hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition shadow-2xs"
          >
            <Clapperboard className="w-4 h-4" />
            Add Story
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold theme-btn-primary shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      <DashboardAttentionBar
        pendingVerificationCount={data.pendingVerificationCount}
        gatePendingCount={data.gatePendingCount}
        pendingGateRevenue={data.pendingGateRevenue}
        newInquiriesCount={data.newInquiriesCount}
        draftEventsCount={data.draftEventsCount}
        currency={currency}
      />

      <DashboardMetrics
        publishedEventsCount={data.publishedEventsCount}
        totalEventsCount={data.totalEventsCount}
        upcomingEventsCount={data.upcomingEventsCount}
        verifiedRevenue={data.verifiedRevenue}
        completedOrdersCount={data.completedOrdersCount}
        pendingVerificationCount={data.pendingVerificationCount}
        totalAttendees={data.totalAttendees}
        checkedInOrdersCount={data.checkedInOrdersCount}
        gatePendingCount={data.gatePendingCount}
        totalInquiriesCount={data.totalInquiriesCount}
        newInquiriesCount={data.newInquiriesCount}
        currency={currency}
        cityLabel={cityLabel}
      />

      <RecentActivityTables
        recentEvents={data.recentEvents}
        recentOrders={data.recentOrders}
        defaultCity={cityLabel}
        currency={currency}
      />

      <DashboardOpsStrip
        theme={theme}
        payments={payments}
        publishedMediaCount={data.publishedMediaCount}
        draftMediaCount={data.draftMediaCount}
      />
    </div>
  );
}
