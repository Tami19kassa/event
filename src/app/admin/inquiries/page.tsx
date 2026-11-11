import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchAdminInquiriesSnapshot } from "@/lib/inquiries-admin";
import type { InquiryStatus, InquiryType } from "@/lib/inquiries-admin-helpers";
import { InquiriesWorkspace } from "@/components/admin/inquiries/InquiriesWorkspace";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set<InquiryType>(["EXHIBITOR", "SPONSOR"]);
const ALLOWED_STATUSES = new Set<InquiryStatus>(["NEW", "CONTACTED", "QUALIFIED", "ARCHIVED"]);

interface PageProps {
  searchParams: Promise<{ type?: string; status?: string }>;
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.role !== "ADMIN") {
    redirect(session.role === "ORGANIZER" ? "/admin/dashboard" : "/");
  }

  const [sp, snapshot] = await Promise.all([searchParams, fetchAdminInquiriesSnapshot()]);

  const rawType = typeof sp.type === "string" ? (sp.type.toUpperCase() as InquiryType) : undefined;
  const rawStatus =
    typeof sp.status === "string" ? (sp.status.toUpperCase() as InquiryStatus) : undefined;

  const initialTypeFilter = rawType && ALLOWED_TYPES.has(rawType) ? rawType : "ALL";
  const initialStatusFilter = rawStatus && ALLOWED_STATUSES.has(rawStatus) ? rawStatus : "ALL";

  return (
    <InquiriesWorkspace
      initialInquiries={snapshot.inquiries}
      initialSummary={snapshot.summary}
      initialTypeFilter={initialTypeFilter}
      initialStatusFilter={initialStatusFilter}
    />
  );
}
