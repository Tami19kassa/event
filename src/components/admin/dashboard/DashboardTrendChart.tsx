import type { DailyOrderPoint, PaymentChannelSlice } from "@/lib/admin-dashboard-data";

interface Props {
  dailyOrders: DailyOrderPoint[];
  paymentMix: PaymentChannelSlice[];
  currency: string;
}

const CHANNEL_COLORS: Record<PaymentChannelSlice["key"], string> = {
  TELEBIRR: "var(--color-primary)",
  CBE: "var(--color-secondary)",
  PAY_AT_GATE: "var(--color-accent)",
  FREE: "#94A3B8",
};

export function DashboardTrendChart({ dailyOrders, paymentMix, currency }: Props) {
  const maxRevenue = Math.max(100, ...dailyOrders.map((d) => d.revenue));
  const totalWindowOrders = dailyOrders.reduce((s, d) => s + d.orders, 0);
  const totalWindowRevenue = dailyOrders.reduce((s, d) => s + d.revenue, 0);

  const chartWidth = 420;
  const chartHeight = 116;
  const barSlot = chartWidth / Math.max(1, dailyOrders.length);
  const barWidth = Math.max(10, Math.min(18, barSlot * 0.54));

  const activeChannels = paymentMix.filter((c) => c.count > 0);
  const totalChannelCount = activeChannels.reduce((s, c) => s + c.count, 0);

  return (
    <section className="xl:col-span-7 bg-white theme-radius-card border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-sans font-bold text-slate-900 text-sm">
            14-Day Booking &amp; Revenue Pulse
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily ticket checkouts combining verified payments and pending approvals
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-sans font-bold tabular-nums text-slate-900">
            {currency} {totalWindowRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            {totalWindowOrders} order{totalWindowOrders === 1 ? "" : "s"} in 14 days
          </div>
        </div>
      </div>

      <div>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
          className="w-full h-36 overflow-visible"
          role="img"
          aria-label="14-day booking volume and revenue bar chart"
        >
          {[0.25, 0.55, 0.85].map((ratio) => {
            const y = chartHeight - ratio * (chartHeight - 18);
            return (
              <line
                key={ratio}
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            );
          })}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#CBD5E1" strokeWidth={1} />

          {dailyOrders.map((day, idx) => {
            const x = idx * barSlot + (barSlot - barWidth) / 2;
            const rawHeight =
              day.revenue > 0 ? Math.max(12, (day.revenue / maxRevenue) * (chartHeight - 22)) : day.orders > 0 ? 12 : 4;
            const y = chartHeight - rawHeight;
            const hasVerified = day.verifiedRevenue > 0;
            const barFill =
              day.orders === 0
                ? "#E2E8F0"
                : hasVerified
                ? "var(--color-primary)"
                : "var(--color-secondary)";

            return (
              <g key={day.dateKey}>
                <title>
                  {day.label}: {day.orders} order{day.orders === 1 ? "" : "s"} · {currency}{" "}
                  {day.revenue.toLocaleString()}
                </title>
                <rect x={x} y={y} width={barWidth} height={rawHeight} rx={4} fill={barFill} />
                {day.orders > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(11, y - 5)}
                    textAnchor="middle"
                    className="fill-slate-700 text-[9px] font-bold"
                  >
                    {day.revenue > 0
                      ? day.revenue >= 1000
                        ? `${(day.revenue / 1000).toFixed(1).replace(/\.0$/, "")}k`
                        : day.revenue.toLocaleString()
                      : `${day.orders}x`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-1">
          <span>{dailyOrders[0]?.label}</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
              Verified
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-secondary)" }} />
              Pending / Gate
            </span>
          </div>
          <span>Today</span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Payment Channel Mix</span>
          <span className="text-slate-400">
            {totalChannelCount} active checkout{totalChannelCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5">
          {totalChannelCount > 0 ? (
            activeChannels.map((ch) => (
              <div
                key={ch.key}
                style={{
                  width: `${(ch.count / totalChannelCount) * 100}%`,
                  minWidth: "6px",
                  backgroundColor: CHANNEL_COLORS[ch.key],
                }}
                title={`${ch.label}: ${ch.count} (${currency} ${ch.amount.toLocaleString()})`}
                className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              />
            ))
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {(activeChannels.length > 0 ? activeChannels : paymentMix.slice(0, 3)).map((ch) => (
            <div key={ch.key} className="inline-flex items-center gap-1.5 text-slate-600">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CHANNEL_COLORS[ch.key] }}
              />
              <span className="font-semibold text-slate-800">{ch.label}</span>
              <span className="tabular-nums text-slate-500">
                {ch.count} · {currency} {ch.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
