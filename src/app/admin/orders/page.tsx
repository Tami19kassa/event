import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminOrdersSnapshot } from "@/lib/orders-admin";
import { extractOrderNumber, type OrderStatusFilter } from "@/lib/orders-admin-helpers";
import { OrdersWorkspace } from "@/components/admin/orders/OrdersWorkspace";

export const dynamic = "force-dynamic";

const ALLOWED_FILTERS = new Set<OrderStatusFilter>([
  "ALL",
  "PENDING_VERIFICATION",
  "RESERVED_PAY_AT_GATE",
  "COMPLETED",
  "CHECKED_IN",
  "UNCHECKED",
  "CANCELLED",
]);

interface PageProps {
  searchParams: Promise<{ scan?: string; status?: string; event?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN" && session.role !== "ORGANIZER") {
    redirect("/");
  }

  const [sp, snapshot] = await Promise.all([
    searchParams,
    fetchAdminOrdersSnapshot({ role: session.role, userId: session.id }),
  ]);

  const rawScan = typeof sp.scan === "string" ? extractOrderNumber(sp.scan) : "";
  const rawStatus =
    typeof sp.status === "string" ? (sp.status.toUpperCase() as OrderStatusFilter) : "ALL";
  const initialStatusFilter = ALLOWED_FILTERS.has(rawStatus) ? rawStatus : "ALL";
  const initialEventId = typeof sp.event === "string" && sp.event ? sp.event : "ALL";

  return (
    <OrdersWorkspace
      initialOrders={snapshot.orders}
      initialEvents={snapshot.events}
      initialSummary={snapshot.summary}
      initialCurrency={snapshot.currency}
      initialScanCode={rawScan}
      initialStatusFilter={initialStatusFilter}
      initialEventId={initialEventId}
      canManageReceipts={session.role === "ADMIN"}
    />
  );
}
