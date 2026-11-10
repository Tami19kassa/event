import Link from "next/link";
import { Plus } from "lucide-react";
import { getLiveThemeSettings } from "@/lib/settings";
import { getPublicPaymentSettings } from "@/lib/payment-settings";
import { getAdminDashboardSnapshot } from "@/lib/admin-dashboard-data";
import { DashboardAttentionBar } from "@/components/admin/dashboard/DashboardAttentionBar";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { DashboardVisuals } from "@/components/admin/dashboard/DashboardVisuals";
import { RecentActivityTables } from "@/components/admin/dashboard/RecentActivityTables";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [theme, payments, data] = await Promise.all([
    getLiveThemeSettings(),
    getPublicPaymentSettings(),
    getAdminDashboardSnapshot(),
  ]);

  const currency = payments.currency || "ETB";
  const cityLabel = theme.contactCity || "Addis Ababa, Ethiopia";
  const shortCity = cityLabel.split(",")[0]?.trim() || "Ethiopia";

  return (
    <div className="p-5 sm:p-6 md:p-8 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {shortCity} · {currency} currency · {data.upcomingEventsCount} upcoming event
            {data.upcomingEventsCount === 1 ? "" : "s"}
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold theme-btn-primary shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
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
        draftEventsCount={data.draftEventsCount}
        upcomingEventsCount={data.upcomingEventsCount}
        verifiedRevenue={data.verifiedRevenue}
        completedOrdersCount={data.completedOrdersCount}
        pendingVerificationCount={data.pendingVerificationCount}
        totalTierClaimed={data.totalTierClaimed}
        totalTierCapacity={data.totalTierCapacity}
        checkedInOrdersCount={data.checkedInOrdersCount}
        totalInquiriesCount={data.totalInquiriesCount}
        newInquiriesCount={data.newInquiriesCount}
        currency={currency}
      />

      <DashboardVisuals
        dailyOrders={data.dailyOrders}
        paymentMix={data.paymentMix}
        totalTierCapacity={data.totalTierCapacity}
        totalTierClaimed={data.totalTierClaimed}
        totalTierRemaining={data.totalTierRemaining}
        completedOrdersCount={data.completedOrdersCount}
        pendingVerificationCount={data.pendingVerificationCount}
        gatePendingCount={data.gatePendingCount}
        checkedInOrdersCount={data.checkedInOrdersCount}
        currency={currency}
      />

      <RecentActivityTables
        recentEvents={data.recentEvents}
        recentOrders={data.recentOrders}
        defaultCity={cityLabel}
        currency={currency}
      />
    </div>
  );
}
