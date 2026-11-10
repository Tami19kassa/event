import type { DailyOrderPoint, PaymentChannelSlice } from "@/lib/admin-dashboard-data";
import { DashboardTrendChart } from "./DashboardTrendChart";
import { DashboardMixPanels } from "./DashboardMixPanels";

interface Props {
  dailyOrders: DailyOrderPoint[];
  paymentMix: PaymentChannelSlice[];
  totalTierCapacity: number;
  totalTierClaimed: number;
  totalTierRemaining: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  gatePendingCount: number;
  checkedInOrdersCount: number;
  currency: string;
}

export function DashboardVisuals(props: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <DashboardTrendChart
        dailyOrders={props.dailyOrders}
        paymentMix={props.paymentMix}
        currency={props.currency}
      />
      <DashboardMixPanels
        totalTierCapacity={props.totalTierCapacity}
        totalTierClaimed={props.totalTierClaimed}
        totalTierRemaining={props.totalTierRemaining}
        completedOrdersCount={props.completedOrdersCount}
        pendingVerificationCount={props.pendingVerificationCount}
        gatePendingCount={props.gatePendingCount}
        checkedInOrdersCount={props.checkedInOrdersCount}
      />
    </div>
  );
}
