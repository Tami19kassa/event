"use client";

import { Mail } from "lucide-react";
import type { InquiryRecord, InquiryStatus } from "@/lib/inquiries-admin-helpers";
import { InquiryRow } from "./InquiryRow";

interface TableProps {
  inquiries: InquiryRecord[];
  busyId: string | null;
  onInspect: (inquiry: InquiryRecord) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string) => void;
}

export function InquiriesTable({
  inquiries,
  busyId,
  onInspect,
  onStatusChange,
  onDelete,
}: TableProps) {
  return (
    <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
      {inquiries.length === 0 ? (
        <div className="p-14 text-center space-y-2 text-slate-400">
          <Mail className="w-9 h-9 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No matching B2B inquiries</h3>
          <p className="text-xs">
            Submissions from Book Exhibition Stand and Become a Sponsor appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-bold">Lead</th>
                <th className="px-5 py-3.5 font-bold">Company &amp; Package</th>
                <th className="px-5 py-3.5 font-bold">Contact</th>
                <th className="px-5 py-3.5 font-bold">Received</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((item) => (
                <InquiryRow
                  key={item.id}
                  inquiry={item}
                  busy={busyId === item.id}
                  onInspect={onInspect}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
