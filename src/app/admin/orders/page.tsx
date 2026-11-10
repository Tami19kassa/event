"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ShoppingBag, CheckCircle2 } from "lucide-react";
import { OrdersStats } from "@/components/admin/orders/OrdersStats";
import { OrdersFilterBar } from "@/components/admin/orders/OrdersFilterBar";
import { OrderRow, Order } from "@/components/admin/orders/OrderRow";
import { GateScannerBar, extractOrderNumber } from "@/components/admin/orders/GateScannerBar";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scanCode, setScanCode] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scanParam = params.get("scan");
    if (scanParam) {
      const clean = extractOrderNumber(scanParam);
      setScanCode(clean);
      setSearch(clean);
    }
    loadOrders();
  }, []);

  const handleGateCheckIn = async (orderId: string, orderNumber: string) => {
    setActionInProgress(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/checkin`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast(`Attendee #${orderNumber} checked in successfully!`);
        loadOrders();
      } else {
        showToast(data.error || "Check-in blocked.");
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleApproveReceipt = async (orderId: string, orderNumber: string) => {
    setActionInProgress(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (res.ok) {
        showToast(`Payment for #${orderNumber} verified and approved!`);
        loadOrders();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.includes(q)) ||
      (o.event?.title && o.event.title.toLowerCase().includes(q));

    const matchStatus =
      statusFilter === "ALL" ||
      o.status.toUpperCase() === statusFilter.toUpperCase() ||
      (statusFilter === "CHECKED_IN" && o.checkedIn) ||
      (statusFilter === "UNCHECKED" && !o.checkedIn);

    return matchSearch && matchStatus;
  });

  const scannedOrder = scanCode
    ? orders.find((o) => o.orderNumber.toUpperCase() === scanCode.toUpperCase()) || null
    : null;

  const totalSales = orders.filter((o) => o.status === "COMPLETED").reduce((s, o) => s + o.totalAmount, 0);
  const gateReservations = orders.filter((o) => o.status === "RESERVED_PAY_AT_GATE").length;
  const checkedInCount = orders.filter((o) => o.checkedIn).length;

  return (
    <div className="p-6 md:p-10 space-y-6">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Attendee Verification &amp; Gate Tracking
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Orders, Receipts &amp; Gate Check-In
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <OrdersStats totalSales={totalSales} gateReservations={gateReservations} checkedInCount={checkedInCount} totalOrders={orders.length} />
          <button type="button" onClick={loadOrders} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          </button>
        </div>
      </div>

      <GateScannerBar
        scannedOrder={scannedOrder}
        scanCode={scanCode}
        actionInProgress={actionInProgress}
        onScanResolved={(code) => { setScanCode(code); setSearch(code); }}
        onClearScan={() => { setScanCode(""); setSearch(""); }}
        onCheckIn={handleGateCheckIn}
      />

      <OrdersFilterBar search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            <span className="text-sm">Loading transactions...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base mb-1">No orders found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Order &amp; Method</th>
                  <th className="px-6 py-4 font-bold">Attendee</th>
                  <th className="px-6 py-4 font-bold">Event</th>
                  <th className="px-6 py-4 font-bold">Payment Status</th>
                  <th className="px-6 py-4 font-bold">Total (ETB)</th>
                  <th className="px-6 py-4 font-bold">Gate Check-in</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ord) => (
                  <OrderRow key={ord.id} order={ord} actionInProgress={actionInProgress} onCheckIn={handleGateCheckIn} onApprove={handleApproveReceipt} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
