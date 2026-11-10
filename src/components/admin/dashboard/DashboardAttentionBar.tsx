import Link from "next/link";
import { ArrowRight, Clock, DoorOpen, FileEdit, Mail } from "lucide-react";

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
  const items = [
    pendingVerificationCount > 0 && {
      key: "receipts",
      text: `${pendingVerificationCount} receipt${pendingVerificationCount === 1 ? "" : "s"} to verify`,
      href: "/admin/orders",
      icon: Clock,
      pillClass: "theme-badge-accent",
    },
    gatePendingCount > 0 && {
      key: "gate",
      text: `${gatePendingCount} Pay at Gate (${currency} ${pendingGateRevenue.toLocaleString()})`,
      href: "/admin/orders",
      icon: DoorOpen,
      pillClass: "theme-badge",
    },
    newInquiriesCount > 0 && {
      key: "inquiries",
      text: `${newInquiriesCount} new B2B lead${newInquiriesCount === 1 ? "" : "s"}`,
      href: "/admin/inquiries",
      icon: Mail,
      pillClass: "theme-badge-secondary",
    },
    draftEventsCount > 0 && {
      key: "drafts",
      text: `${draftEventsCount} draft event${draftEventsCount === 1 ? "" : "s"}`,
      href: "/admin/events",
      icon: FileEdit,
      pillClass: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ].filter(Boolean) as {
    key: string;
    text: string;
    href: string;
    icon: typeof Clock;
    pillClass: string;
  }[];

  if (items.length === 0) return null;

  return (
    <div
      aria-label="Action Queue"
      className="bg-white theme-radius border border-slate-200 px-4 py-2.5 flex flex-wrap items-center gap-2.5 shadow-2xs"
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
        Action needed
      </span>

      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border theme-radius-sm hover:brightness-95 transition ${item.pillClass}`}
        >
          <item.icon className="w-3.5 h-3.5 shrink-0" />
          <span>{item.text}</span>
          <ArrowRight className="w-3 h-3 opacity-75" />
        </Link>
      ))}
    </div>
  );
}
