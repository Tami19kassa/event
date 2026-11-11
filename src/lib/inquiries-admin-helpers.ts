export type InquiryType = "EXHIBITOR" | "SPONSOR";
export type InquiryStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "ARCHIVED";

export interface InquiryRecord {
  id: string;
  type: InquiryType;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  expoTitle: string | null;
  selection: string;
  notes: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInquiriesSummary {
  totalCount: number;
  newCount: number;
  contactedCount: number;
  qualifiedCount: number;
  archivedCount: number;
  exhibitorCount: number;
  sponsorCount: number;
}

export function filterAdminInquiries(
  inquiries: InquiryRecord[],
  options: { search: string; typeFilter: "ALL" | InquiryType; statusFilter: "ALL" | InquiryStatus }
): InquiryRecord[] {
  const q = options.search.trim().toLowerCase();
  const typeFilter = options.typeFilter;
  const statusFilter = options.statusFilter;

  return inquiries.filter((inq) => {
    if (typeFilter !== "ALL" && inq.type !== typeFilter) return false;
    if (statusFilter !== "ALL" && inq.status !== statusFilter) return false;

    if (!q) return true;
    const digits = q.replace(/\s+/g, "");
    return (
      inq.companyName.toLowerCase().includes(q) ||
      inq.contactName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone.replace(/\s+/g, "").includes(digits) ||
      inq.selection.toLowerCase().includes(q) ||
      inq.id.slice(-8).toLowerCase().includes(q) ||
      Boolean(inq.expoTitle && inq.expoTitle.toLowerCase().includes(q)) ||
      Boolean(inq.notes && inq.notes.toLowerCase().includes(q))
    );
  });
}

export function formatAdminInquiryTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Africa/Addis_Ababa",
    });
  } catch {
    return iso;
  }
}

function escapeCsvCell(val: unknown): string {
  let str = val == null ? "" : String(val);
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function buildInquiriesCsv(inquiries: InquiryRecord[]): string {
  const headers = [
    "Ref",
    "Date",
    "Type",
    "Status",
    "Company",
    "Package / Stand",
    "Expo",
    "Contact Name",
    "Email",
    "Phone",
    "Notes",
  ];
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const inq of inquiries) {
    lines.push(
      [
        `#${inq.id.slice(-8).toUpperCase()}`,
        inq.createdAt,
        inq.type,
        inq.status,
        inq.companyName,
        inq.selection,
        inq.expoTitle || "",
        inq.contactName,
        inq.email,
        inq.phone,
        inq.notes || "",
      ]
        .map(escapeCsvCell)
        .join(",")
    );
  }
  return lines.join("\r\n");
}

export function downloadInquiriesCsvFile(inquiries: InquiryRecord[]) {
  const blob = new Blob([buildInquiriesCsv(inquiries)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `b2b-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
