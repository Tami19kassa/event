"use client";

import Link from "next/link";
import { Eye, Edit, Trash2, Globe, Clock } from "lucide-react";
import { format } from "date-fns";

export type AdminEventRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  format: string;
  startDate: string;
  endDate: string;
  attendeesCount: number;
  capacity: number;
  ticketTiers: { price: number; remaining: number; quantity: number }[];
};

interface TableProps {
  events: AdminEventRow[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string, title: string) => void;
}

export function AdminEventsTable({ events, onToggleStatus, onDelete }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-5 py-3 font-bold">Event</th>
            <th className="px-5 py-3 font-bold">Status & Toggle</th>
            <th className="px-5 py-3 font-bold">Format</th>
            <th className="px-5 py-3 font-bold">Date (EAT)</th>
            <th className="px-5 py-3 font-bold">Capacity / Sold</th>
            <th className="px-5 py-3 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((evt) => {
            const isLive = evt.status === "PUBLISHED" || evt.status === "LIVE";
            const totalRemaining = evt.ticketTiers?.reduce((s, t) => s + t.remaining, 0) ?? 0;
            const totalQty = evt.ticketTiers?.reduce((s, t) => s + t.quantity, 0) ?? evt.capacity;
            const soldCount = Math.max(0, totalQty - totalRemaining);

            return (
              <tr key={evt.id} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    /{evt.slug}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(evt.id, evt.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer shadow-2xs ${
                      isLive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                    title="Click to toggle between Published (Live on Main Page) and Draft"
                  >
                    {isLive ? <Globe className="w-3 h-3 text-emerald-700" /> : <Clock className="w-3 h-3" />}
                    <span>{evt.status}</span>
                  </button>
                </td>

                <td className="px-5 py-4 text-xs font-semibold text-slate-600 capitalize">
                  {evt.format.replace("_", " ").toLowerCase()}
                </td>

                <td className="px-5 py-4 text-xs text-slate-600">
                  {format(new Date(evt.startDate), "MMM d, yyyy")}
                </td>

                <td className="px-5 py-4 text-xs">
                  <span className="font-bold text-slate-900">{soldCount}</span>
                  <span className="text-slate-400"> / {totalQty}</span>
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      title="View public page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/events/${evt.id}/edit`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      title="Edit details"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(evt.id, evt.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
