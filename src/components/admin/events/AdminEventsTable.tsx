"use client";

import { AdminEventTableRow } from "./AdminEventTableRow";

export type AdminEventRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  format: string;
  imageUrl?: string | null;
  locationCity?: string | null;
  locationName?: string | null;
  isFeatured?: boolean;
  startDate: string;
  endDate: string;
  attendeesCount: number;
  capacity: number;
  category?: { id: string; name: string } | null;
  organizer?: { id: string; name: string | null; email: string } | null;
  _count?: { orders: number };
  ticketTiers: { id?: string; price: number; remaining: number; quantity: number }[];
};

interface TableProps {
  events: AdminEventRow[];
  currency: string;
  busyId?: string | null;
  confirmDeleteId?: string | null;
  showOrganizer?: boolean;
  onToggleStatus: (evt: AdminEventRow) => void;
  onToggleFeatured: (evt: AdminEventRow) => void;
  onDuplicate: (evt: AdminEventRow) => void;
  onRequestDelete: (evt: AdminEventRow) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (evt: AdminEventRow) => void;
}

export function AdminEventsTable({
  events,
  currency,
  busyId,
  confirmDeleteId,
  showOrganizer = false,
  onToggleStatus,
  onToggleFeatured,
  onDuplicate,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider">
            <th className="px-5 py-3.5 font-bold">Event &amp; Venue</th>
            <th className="px-4 py-3.5 font-bold">Status</th>
            <th className="px-3 py-3.5 font-bold text-center">Featured</th>
            <th className="px-4 py-3.5 font-bold">Schedule</th>
            <th className="px-4 py-3.5 font-bold">Passes &amp; Entry</th>
            <th className="px-5 py-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((evt) => (
            <AdminEventTableRow
              key={evt.id}
              evt={evt}
              currency={currency}
              rowBusy={busyId === evt.id}
              confirmingDelete={confirmDeleteId === evt.id}
              showOrganizer={showOrganizer}
              onToggleStatus={onToggleStatus}
              onToggleFeatured={onToggleFeatured}
              onDuplicate={onDuplicate}
              onRequestDelete={onRequestDelete}
              onCancelDelete={onCancelDelete}
              onConfirmDelete={onConfirmDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
