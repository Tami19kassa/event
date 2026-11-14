"use client";

import { Loader2, Sparkles } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  saving: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export function EventModalFooter({
  mode,
  saving,
  onClose,
  onSaveDraft,
  onSubmit,
}: Props) {
  return (
    <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 theme-radius-sm transition cursor-pointer"
      >
        Cancel
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={onSaveDraft}
          className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 theme-radius-sm transition cursor-pointer disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          data-event-modal-submit
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold theme-btn-primary theme-radius-sm shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {mode === "create" ? "Publish Event" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
