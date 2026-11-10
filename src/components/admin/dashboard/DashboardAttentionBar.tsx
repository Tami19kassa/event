import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  DoorOpen,
  FileEdit,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";

interface AttentionProps {
  pendingVerificationCount: number;
  gatePendingCount: number;
  pendingGateRevenue: number;
  newInquiriesCount: number;
  draftEventsCount: number;
  currency: string;
}

export function DashboardAttentionBar({
  pendingVerificationCount,
  gatePendingCount,
  pendingGateRevenue,
  newInquiriesCount,
  draftEventsCount,
  currency,
}: AttentionProps) {
  const queues = [
    pendingVerificationCount > 0 && {
      key: "receipts",
      label: "Receipts to Verify",
      count: pendingVerificationCount,
      detail: "Bank receipts awaiting admin approval",
      href: "/admin/orders",
      cta: "Review Orders",
      icon: Clock,
      badgeClass: "theme-badge-accent",
    },
    gatePendingCount > 0 && {
      key: "gate",
      label: "Pay at Gate Waiting",
      count: gatePendingCount,
      detail: `${currency} ${pendingGateRevenue.toLocaleString()} expected at venue gate`,
      href: "/admin/orders",
      cta: "Open Gate List",
      icon: DoorOpen,
      badgeClass: "theme-badge",
    },
    newInquiriesCount > 0 && {
      key: "inquiries",
      label: "Unread B2B Leads",
      count: newInquiriesCount,
      detail: "Exhibitor & sponsor requests awaiting response",
      href: "/admin/inquiries",
      cta: "View Inquiries",
      icon: Mail,
      badgeClass: "theme-badge-secondary",
    },
    draftEventsCount > 0 && {
      key: "drafts",
      label: "Draft Events",
      count: draftEventsCount,
      detail: "Unpublished events saved in workspace",
      href: "/admin/events",
      cta: "Manage Drafts",
      icon: FileEdit,
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    count: number;
    detail: string;
    href: string;
    cta: string;
    icon: typeof Clock;
    badgeClass: string;
  }[];

  const urgentTotal = pendingVerificationCount + gatePendingCount + newInquiriesCount;

  if (queues.length === 0) {
    return (
      <div className="bg-white theme-radius-card border border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="inline-flex items-center justify-center w-7 h-7 theme-radius-sm theme-badge-secondary border">
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <span className="font-bold text-slate-900">Operations queues clear</span>
          <span className="text-slate-500 text-xs">
            No pending bank receipts, gate check-in holds, or unread B2B inquiries.
          </span>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1"
        >
          Open Gate Scanner <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Operational Action Queue" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          <AlertCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>
            {urgentTotal > 0 ? "Needs Your Attention" : "Workspace Preparation"}
          </span>
        </div>
        {urgentTotal > 0 && (
          <span className="text-[11px] font-bold text-slate-500">
            {urgentTotal} open action{urgentTotal === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {queues.map((q) => (
          <Link
            key={q.key}
            href={q.href}
            className="group bg-white theme-radius-card border border-slate-200 p-4 shadow-2xs hover:border-[var(--color-primary)]/40 hover:shadow-sm transition-all flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-500">{q.label}</div>
                <div className="text-2xl font-display text-slate-900 mt-0.5 leading-none">
                  {q.count}
                </div>
              </div>
              <span
                className={`w-9 h-9 theme-radius-sm border flex items-center justify-center shrink-0 ${q.badgeClass}`}
              >
                <q.icon className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 truncate">{q.detail}</span>
              <span className="text-[11px] font-bold text-[var(--color-primary)] inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                {q.cta}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
