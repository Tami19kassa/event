import { prisma, withDbRetry } from "@/lib/prisma";
import type {
  AdminInquiriesSummary,
  InquiryRecord,
  InquiryStatus,
  InquiryType,
} from "@/lib/inquiries-admin-helpers";

export interface AdminInquiriesSnapshot {
  inquiries: InquiryRecord[];
  summary: AdminInquiriesSummary;
}

function normalizeType(raw: string): InquiryType {
  return raw.toUpperCase() === "SPONSOR" ? "SPONSOR" : "EXHIBITOR";
}

function normalizeStatus(raw: string): InquiryStatus {
  const u = raw.toUpperCase();
  if (u === "CONTACTED" || u === "QUALIFIED" || u === "ARCHIVED") return u;
  return "NEW";
}

export async function fetchAdminInquiriesSnapshot(limit = 300): Promise<AdminInquiriesSnapshot> {
  const [
    totalCount,
    newCount,
    contactedCount,
    qualifiedCount,
    archivedCount,
    exhibitorCount,
    sponsorCount,
    rows,
  ] = await Promise.all([
    withDbRetry(() => prisma.inquiry.count()),
    withDbRetry(() => prisma.inquiry.count({ where: { status: "NEW" } })),
    withDbRetry(() => prisma.inquiry.count({ where: { status: "CONTACTED" } })),
    withDbRetry(() => prisma.inquiry.count({ where: { status: "QUALIFIED" } })),
    withDbRetry(() => prisma.inquiry.count({ where: { status: "ARCHIVED" } })),
    withDbRetry(() => prisma.inquiry.count({ where: { type: "EXHIBITOR" } })),
    withDbRetry(() => prisma.inquiry.count({ where: { type: "SPONSOR" } })),
    withDbRetry(() =>
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    ),
  ]);

  return {
    summary: {
      totalCount,
      newCount,
      contactedCount,
      qualifiedCount,
      archivedCount,
      exhibitorCount,
      sponsorCount,
    },
    inquiries: rows.map((row) => ({
      id: row.id,
      type: normalizeType(row.type),
      companyName: row.companyName,
      contactName: row.contactName,
      email: row.email,
      phone: row.phone,
      expoTitle: row.expoTitle,
      selection: row.selection,
      notes: row.notes,
      status: normalizeStatus(row.status),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
  };
}
