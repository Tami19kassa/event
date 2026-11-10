interface Props {
  totalTierCapacity: number;
  totalTierClaimed: number;
  totalTierRemaining: number;
  completedOrdersCount: number;
  pendingVerificationCount: number;
  gatePendingCount: number;
  checkedInOrdersCount: number;
}

export function DashboardMixPanels({
  totalTierCapacity,
  totalTierClaimed,
  totalTierRemaining,
  completedOrdersCount,
  pendingVerificationCount,
  gatePendingCount,
  checkedInOrdersCount,
}: Props) {
  const sellThrough =
    totalTierCapacity > 0 ? Math.min(100, Math.round((totalTierClaimed / totalTierCapacity) * 100)) : 0;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const filledArc = (sellThrough / 100) * circumference;

  const pipelineTotal = Math.max(
    1,
    completedOrdersCount + pendingVerificationCount + gatePendingCount
  );

  const stages = [
    {
      label: "Verified Paid",
      value: completedOrdersCount,
      pct: Math.round((completedOrdersCount / pipelineTotal) * 100),
      color: "var(--color-primary)",
    },
    {
      label: "Receipt Review",
      value: pendingVerificationCount,
      pct: Math.round((pendingVerificationCount / pipelineTotal) * 100),
      color: "var(--color-accent)",
    },
    {
      label: "Pay at Gate Hold",
      value: gatePendingCount,
      pct: Math.round((gatePendingCount / pipelineTotal) * 100),
      color: "var(--color-secondary)",
    },
    {
      label: "Gate Checked-In",
      value: checkedInOrdersCount,
      pct: Math.round((checkedInOrdersCount / pipelineTotal) * 100),
      color: "#10B981",
    },
  ];

  return (
    <section className="xl:col-span-5 bg-white theme-radius-card border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-slate-900 text-sm">
            Portfolio Capacity &amp; Gate Funnel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live ticket tier sell-through &amp; order verification status
          </p>
        </div>
      </div>

      {/* Circular SVG Capacity Ring */}
      <div className="flex items-center gap-5 bg-slate-50/90 border border-slate-200/80 theme-radius p-4">
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 96 96" className="w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="10"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${filledArc} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-sans font-bold tabular-nums text-slate-900 leading-none">
              {sellThrough}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500 mt-0.5">Claimed</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Claimed Seats</span>
            <span className="font-bold tabular-nums text-slate-900">
              {totalTierClaimed.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Open Stock</span>
            <span className="font-bold tabular-nums" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}>
              {totalTierRemaining.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200">
            <span className="text-slate-500">Total Tier Capacity</span>
            <span className="font-bold tabular-nums text-slate-900">
              {totalTierCapacity.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Order Stage Breakdown */}
      <div className="space-y-2.5">
        {stages.map((st) => (
          <div key={st.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{st.label}</span>
              <span className="font-bold tabular-nums text-slate-900">
                {st.value} <span className="text-slate-400 font-normal">({st.pct}%)</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${st.value > 0 ? Math.max(4, st.pct) : 0}%`,
                  backgroundColor: st.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
