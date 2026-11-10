"use client";

import { useState, useEffect } from "react";
import { X, Film, FileText, Globe, AlertCircle } from "lucide-react";
import type { MediaKind, MediaPostItem } from "@/lib/media-types";
import { MediaFormFields, type MediaFormState } from "./MediaFormFields";

type EventOption = { id: string; title: string };

type Props = {
  isOpen: boolean;
  editing: MediaPostItem | null;
  events: EventOption[];
  onClose: () => void;
  onSaved: () => void;
};

const EMPTY_FORM: MediaFormState = {
  title: "",
  slug: "",
  kind: "VIDEO_VLOG",
  categoryTag: "Expo Recap",
  coverImageUrl: "",
  videoUrl: "",
  externalUrl: "",
  externalLabel: "",
  duration: "",
  excerpt: "",
  content: "",
  eventId: "",
  isFeatured: true,
  status: "PUBLISHED",
};

const KIND_TABS: Array<{ value: MediaKind; label: string; icon: any }> = [
  { value: "VIDEO_VLOG", label: "Video / Vlog", icon: Film },
  { value: "ARTICLE", label: "Blog Story", icon: FileText },
  { value: "EXTERNAL_LINK", label: "External Link", icon: Globe },
];

export function MediaFormModal({ isOpen, editing, events, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MediaFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (editing) {
      setForm({
        title: editing.title,
        slug: editing.slug,
        kind: editing.kind,
        categoryTag: editing.categoryTag || "",
        coverImageUrl: editing.coverImageUrl || "",
        videoUrl: editing.videoUrl || "",
        externalUrl: editing.externalUrl || "",
        externalLabel: editing.externalLabel || "",
        duration: editing.duration || "",
        excerpt: editing.excerpt || "",
        content: editing.content || "",
        eventId: editing.eventId || "",
        isFeatured: editing.isFeatured,
        status: editing.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, editing]);

  if (!isOpen) return null;

  const update = <K extends keyof MediaFormState>(key: K, val: MediaFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const endpoint = editing ? `/api/media/${editing.id}` : "/api/media";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save media item");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error saving entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white theme-radius-card border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-display text-lg text-slate-900">
              {editing ? "Edit Media / Story" : "Publish Video, Vlog or Story"}
            </h2>
            <p className="text-xs text-slate-500">Appears on the homepage spotlight, /stories hub, and linked event pages.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {KIND_TABS.map((t) => {
              const Icon = t.icon;
              const active = form.kind === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update("kind", t.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    active ? "theme-nav-active" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <MediaFormFields form={form} events={events} onChange={update} />

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold theme-btn-primary cursor-pointer disabled:opacity-50"
            >
              {saving ? "Publishing..." : editing ? "Save Changes" : "Publish Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
