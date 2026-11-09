interface StatsProps {
  totalSales: number;
  gateReservations: number;
  checkedInCount: number;
  totalOrders: number;
}

export function OrdersStats({
  totalSales,
  gateReservations,
  checkedInCount,
  totalOrders,
}: StatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm text-right">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Verified Revenue
        </span>
        <span className="text-lg font-black text-emerald-600">
          ETB {totalSales.toLocaleString()}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm text-right">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Gate Pending
        </span>
        <span className="text-lg font-black text-amber-600">
          {gateReservations} passes
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm text-right">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Checked In
        </span>
        <span className="text-lg font-black text-indigo-600">
          {checkedInCount} / {totalOrders}
        </span>
      </div>
    </div>
  );
}
