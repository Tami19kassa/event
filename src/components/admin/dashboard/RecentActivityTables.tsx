import { RecentEventsPanel, type RecentEventRow } from "./RecentEventsPanel";
import { RecentOrdersPanel, type RecentOrderRow } from "./RecentOrdersPanel";

interface Props {
  recentEvents: RecentEventRow[];
  recentOrders: RecentOrderRow[];
  defaultCity: string;
  currency: string;
}

export function RecentActivityTables({
  recentEvents,
  recentOrders,
  defaultCity,
  currency,
}: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RecentEventsPanel events={recentEvents} defaultCity={defaultCity} />
      <RecentOrdersPanel orders={recentOrders} currency={currency} />
    </div>
  );
}
