"use client";

import { Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  isAdmin: boolean;
  toast: string;
  error: string;
  onDismissError: () => void;
  onCreateClick: () => void;
}

export function EventsWorkspaceHeader({
  isAdmin,
  toast,
  error,
  onDismissError,
  onCreateClick,
}: Props) {
  return (
    <>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold theme-radius shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-wider block mb-0.5"
            style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}
          >
            Catalog &amp; Media
          </span>
          <h1 className="text-2xl font-display text-slate-900">
            {isAdmin ? "Events Catalog" : "My Events Catalog"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? "Publish events, feature homepage highlights, reassign hosts, and track pass inventory."
              : "Manage, publish, duplicate, and monitor ticket inventory for your own events."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          data-create-event-modal-trigger
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold theme-btn-primary shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}
