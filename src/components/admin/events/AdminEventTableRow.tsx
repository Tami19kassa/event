"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Globe, Clock, Star, Copy, Calendar, MapPin } from "lucide-react";
import type { AdminEventRow } from "./AdminEventsTable";
import { computeEventRowStats, formatEventDateAddis, getEventStatusPill } from "./event-admin-helpers";

interface RowProps {
  evt: AdminEventRow;
  currency: string;
  rowBusy: boolean;
  confirmingDelete: boolean;
  showOrganizer?: boolean;
  onToggleStatus: (evt: AdminEventRow) => void;
  onToggleFeatured: (evt: AdminEventRow) => void;
  onDuplicate: (evt: AdminEventRow) => void;
  onRequestDelete: (evt: AdminEventRow) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (evt: AdminEventRow) => void;
}

export function AdminEventTableRow({
  evt,
  currency,
  rowBusy,
  confirmingDelete,
  showOrganizer = false,
  onToggleStatus,
  onToggleFeatured,
  onDuplicate,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: RowProps) {
  const pill = getEventStatusPill(evt.status);
  const { totalQty, soldCount, fillPct, barColor, minPrice, orderCount } = computeEventRowStats(evt);
  const ownerLabel = evt.organizer?.name?.trim() || evt.organizer?.email;

  return (
    <tr className={`hover:bg-slate-50/70 transition ${rowBusy ? "opacity-60" : ""}`}>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5 min-w-0">
          {evt.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={evt.imageUrl}
              alt={evt.title}
              className="w-12 h-10 object-cover theme-radius-sm border border-slate-200 bg-slate-100 shrink-0"
            />
          ) : (
            <div className="w-12 h-10 theme-radius-sm bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/admin/events/${evt.id}/edit`}
              className="font-bold text-slate-900 hover:text-[var(--color-primary-ink,var(--color-primary))] line-clamp-1 transition"
            >
              {evt.title}
            </Link>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              {evt.category?.name && (
                <span className="px-1.5 py-0.5 rounded-md font-semibold theme-badge-secondary border text-[10px]">
                  {evt.category.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {evt.locationCity || evt.locationName || "Addis Ababa"}
              </span>
              {showOrganizer && ownerLabel && (
                <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[140px]">
                  · Host: {ownerLabel}
                </span>
              )}
              {orderCount > 0 && (
                <span className="text-[10px] font-semibold text-slate-400">
                  · {orderCount} order{orderCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <button
          type="button"
          disabled={rowBusy}
          onClick={() => onToggleStatus(evt)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border transition cursor-pointer ${pill.cls}`}
          title={pill.live ? "Click to move back to Draft" : "Click to publish live"}
        >
          {pill.live ? <Globe className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          <span>{pill.label}</span>
        </button>
      </td>

      <td className="px-3 py-4 text-center">
        <button
          type="button"
          disabled={rowBusy}
          onClick={() => onToggleFeatured(evt)}
          title={evt.isFeatured ? "Unfeature from homepage" : "Feature on homepage"}
          className={`p-2 theme-radius-sm border transition cursor-pointer inline-flex items-center justify-center ${
            evt.isFeatured
              ? "theme-badge-accent"
              : "bg-white border-slate-200 text-slate-300 hover:text-amber-500 hover:border-amber-200"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${evt.isFeatured ? "fill-current" : ""}`} />
        </button>
      </td>

      <td className="px-4 py-4">
        <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">
          {formatEventDateAddis(evt.startDate)}
        </div>
        <div className="text-[11px] text-slate-400 capitalize mt-0.5">
          {evt.format.replace("_", " ").toLowerCase()}
        </div>
      </td>

      <td className="px-4 py-4 min-w-[160px]">
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          <span className="font-bold tabular-nums text-slate-900 whitespace-nowrap">
            {soldCount}/{totalQty}
          </span>
          <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
            {minPrice === 0 ? "Free" : `${currency} ${minPrice.toLocaleString()}+`}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.max(soldCount > 0 ? 6 : 0, fillPct)}%`, backgroundColor: barColor }}
          />
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        {confirmingDelete ? (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              disabled={rowBusy}
              onClick={() => onConfirmDelete(evt)}
              className="px-2.5 py-1.5 text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 theme-radius-sm transition cursor-pointer disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              disabled={rowBusy}
              onClick={onCancelDelete}
              className="px-2.5 py-1.5 text-[11px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 theme-radius-sm transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center justify-end gap-1">
            {pill.live ? (
              <Link
                href={`/events/${evt.slug}`}
                target="_blank"
                className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 theme-radius-sm transition"
                title="Open live public page"
              >
                <Eye className="w-4 h-4" />
              </Link>
            ) : (
              <span title="Publish event to enable public preview" className="p-2 text-slate-200 cursor-not-allowed">
                <Eye className="w-4 h-4" />
              </span>
            )}
            <Link
              href={`/admin/events/${evt.id}/edit`}
              className="p-2 text-slate-500 hover:text-[var(--color-secondary-ink,var(--color-secondary))] hover:bg-slate-100 theme-radius-sm transition"
              title="Edit event"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              type="button"
              disabled={rowBusy}
              onClick={() => onDuplicate(evt)}
              className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 theme-radius-sm transition cursor-pointer"
              title="Duplicate event as Draft"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={rowBusy}
              onClick={() => onRequestDelete(evt)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 theme-radius-sm transition cursor-pointer"
              title={orderCount > 0 ? `Has ${orderCount} order(s) — click for guidance` : "Delete event"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
