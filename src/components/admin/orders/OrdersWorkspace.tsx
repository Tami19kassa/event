"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, Download } from "lucide-react";
import {
  downloadOrdersCsvFile,
  filterAdminOrders,
  type AdminOrderEventOption,
  type AdminOrderRow,
  type AdminOrderSummary,
  type OrderStatusFilter,
} from "@/lib/orders-admin-helpers";
import { OrdersStats } from "./OrdersStats";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { GatePassBanner } from "./GatePassBanner";
import { QrScannerModal } from "./QrScannerModal";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailDrawer } from "./OrderDetailDrawer";

interface WorkspaceProps {
  initialOrders: AdminOrderRow[];
  initialEvents: AdminOrderEventOption[];
  initialSummary: AdminOrderSummary;
  initialCurrency: string;
  initialScanCode?: string;
  initialStatusFilter?: OrderStatusFilter;
  initialEventId?: string;
  canManageReceipts: boolean;
}

export function OrdersWorkspace({
  initialOrders, initialEvents, initialSummary, initialCurrency,
  initialScanCode = "", initialStatusFilter = "ALL", initialEventId = "ALL", canManageReceipts,
}: WorkspaceProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderRow[]>(initialOrders);
  const [events, setEvents] = useState<AdminOrderEventOption[]>(initialEvents);
  const [summary, setSummary] = useState<AdminOrderSummary>(initialSummary);
  const [currency, setCurrency] = useState(initialCurrency);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialScanCode);
  const [scanCode, setScanCode] = useState(initialScanCode);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(initialStatusFilter);
  const [eventId, setEventId] = useState(initialEventId);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [inspectedOrderId, setInspectedOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => { setError(""); setToast(msg); setTimeout(() => setToast(""), 3800); };

  const reloadSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?scope=admin");
      if (!res.ok) throw new Error("Failed to refresh orders.");
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (data.summary) setSummary(data.summary);
      if (data.currency) setCurrency(data.currency);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to refresh orders.");
    } finally {
      setLoading(false);
    }
  };

  const runMutation = async (orderId: string, url: string, method: "POST" | "PATCH", payload: object, successMsg: string, fallbackErr: string) => {
    setActionInProgress(orderId);
    setError("");
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) return setError(data.error || fallbackErr);
      showToast(successMsg);
      await reloadSnapshot();
    } catch {
      setError("Network error while updating order.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleGateCheckIn = (orderId: string, orderNumber: string, undo = false) =>
    runMutation(
      orderId, `/api/orders/${orderId}/checkin`, "POST", undo ? { undo: true } : {},
      undo ? `Check-in undone for #${orderNumber}.` : `Attendee #${orderNumber} checked in!`,
      "Check-in update blocked."
    );

  const handleUpdateStatus = (orderId: string, orderNumber: string, status: string) =>
    runMutation(
      orderId, `/api/orders/${orderId}`, "PATCH", { status },
      status === "CANCELLED" ? `Order #${orderNumber} cancelled and tickets released.` : `Payment for #${orderNumber} verified and approved.`,
      "Failed to update order status."
    );

  const filtered = useMemo(() => filterAdminOrders(orders, { search, statusFilter, eventId }), [orders, search, statusFilter, eventId]);
  const inspectedOrder = useMemo(() => (inspectedOrderId ? orders.find((o) => o.id === inspectedOrderId) || null : null), [orders, inspectedOrderId]);

  const handleResolvedScan = (code: string) => {
    setScanCode(code);
    setSearch(code);
    setStatusFilter("ALL");
  };

  return (
    <div className="p-4 sm:p-6 md:px-8 md:py-6 space-y-4 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold theme-radius shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}>Operations</span>
          <h1 className="text-2xl font-display text-slate-900">Orders &amp; Gate</h1>
          <p className="text-xs text-slate-500 mt-0.5">Verify Telebirr &amp; CBE bank receipts, collect Pay at Gate fees, and admit attendees.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={() => { downloadOrdersCsvFile(filtered, currency); showToast(`Exported ${filtered.length} order${filtered.length === 1 ? "" : "s"} to CSV.`); }} disabled={filtered.length === 0} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-50">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button type="button" onClick={reloadSnapshot} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      <OrdersStats summary={summary} currency={currency} activeFilter={statusFilter} onSelectFilter={setStatusFilter} />

      <OrdersFilterBar
        summary={summary} search={search}
        onSearchChange={(val) => { setSearch(val); if (!val.trim()) setScanCode(""); }}
        onLookupPass={handleResolvedScan} onOpenCamera={() => setScannerOpen(true)}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} eventId={eventId} onEventIdChange={setEventId} events={events}
      />

      <GatePassBanner
        orders={orders} scanCode={scanCode} currency={currency} canManageReceipts={canManageReceipts} actionInProgress={actionInProgress}
        onClearScan={() => { setScanCode(""); setSearch(""); }}
        onCheckIn={(id, ref) => handleGateCheckIn(id, ref, false)}
        onApproveReceipt={(id, ref) => handleUpdateStatus(id, ref, "COMPLETED")}
        onInspectOrder={(ord) => setInspectedOrderId(ord.id)}
      />

      {summary.totalCount > orders.length && (
        <p className="text-xs text-slate-500">Showing latest {orders.length.toLocaleString()} of {summary.totalCount.toLocaleString()} orders. Top summary cards reflect full totals.</p>
      )}

      <OrdersTable orders={filtered} currency={currency} canManageReceipts={canManageReceipts} actionInProgress={actionInProgress} onCheckIn={(id, ref) => handleGateCheckIn(id, ref, false)} onApprove={(id, ref) => handleUpdateStatus(id, ref, "COMPLETED")} onInspect={(row) => setInspectedOrderId(row.id)} />

      <QrScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onDetected={handleResolvedScan} />
      <OrderDetailDrawer order={inspectedOrder} currency={currency} canManageReceipts={canManageReceipts} actionInProgress={actionInProgress} onClose={() => setInspectedOrderId(null)} onUpdateStatus={handleUpdateStatus} onCheckIn={handleGateCheckIn} />
    </div>
  );
}
