"use client";

import { Plus, Trash2, Mic2, ArrowUp, ArrowDown } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { makeClientKey, type SpeakerInput } from "@/lib/event-form-types";

interface Props {
  speakers: SpeakerInput[];
  onChange: (next: SpeakerInput[]) => void;
}

export function SpeakersSection({ speakers, onChange }: Props) {
  const addSpeaker = () => {
    onChange([
      ...speakers,
      { clientKey: makeClientKey("sp"), name: "", title: "", company: "", bio: "", imageUrl: "" },
    ]);
  };

  const updateSpeaker = (idx: number, field: keyof SpeakerInput, val: string) => {
    const next = [...speakers];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const moveSpeaker = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= speakers.length) return;
    const next = [...speakers];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const removeSpeaker = (idx: number) => {
    onChange(speakers.filter((_, i) => i !== idx));
  };

  return (
    <section className="bg-white theme-radius-card border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 theme-radius-sm theme-icon-secondary border flex items-center justify-center shrink-0">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Featured Speakers &amp; Panelists</h2>
            <p className="text-xs text-slate-400">
              Optional — displayed on your event detail page in the order listed here.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addSpeaker}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 theme-radius-sm theme-badge-secondary border cursor-pointer hover:brightness-95 transition"
        >
          <Plus className="w-4 h-4" /> Add Speaker
        </button>
      </div>

      {speakers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 theme-radius text-xs text-slate-500">
          No speakers attached yet. Click <strong>Add Speaker</strong> to feature keynote presenters or panelists.
        </div>
      ) : (
        <div className="space-y-4">
          {speakers.map((sp, i) => {
            const missingName = !sp.name.trim();
            return (
              <div
                key={sp.id || sp.clientKey || i}
                className={`p-4 bg-slate-50/90 border theme-radius space-y-4 ${
                  missingName ? "border-rose-300" : "border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Speaker #{i + 1}
                    </span>
                    {missingName && (
                      <span className="text-[11px] font-semibold text-rose-600">
                        Full Name required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveSpeaker(i, -1)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === speakers.length - 1}
                      onClick={() => moveSpeaker(i, 1)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-35 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSpeaker(i)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={sp.name}
                      onChange={(e) => updateSpeaker(i, "name", e.target.value)}
                      placeholder="e.g. Dr. Dawit Tadesse"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={sp.title}
                      onChange={(e) => updateSpeaker(i, "title", e.target.value)}
                      placeholder="e.g. Head of Engineering"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Company / Org</label>
                    <input
                      type="text"
                      value={sp.company}
                      onChange={(e) => updateSpeaker(i, "company", e.target.value)}
                      placeholder="e.g. EthioCloud"
                      className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Short Bio</label>
                  <textarea
                    rows={2}
                    value={sp.bio}
                    onChange={(e) => updateSpeaker(i, "bio", e.target.value)}
                    placeholder="Background highlights, topics covered..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm resize-none"
                  />
                </div>

                <ImageUpload
                  label="Portrait Photo (Optional)"
                  value={sp.imageUrl}
                  onChange={(url) => updateSpeaker(i, "imageUrl", url)}
                  placeholder="https://..."
                  previewVariant="square"
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
