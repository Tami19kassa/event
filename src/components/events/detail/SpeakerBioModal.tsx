"use client";

import Image from "next/image";
import { X, Building2, User } from "lucide-react";
import type { Speaker } from "@/types/event";

interface Props {
  speaker: Speaker | null;
  onClose: () => void;
}

export function SpeakerBioModal({ speaker, onClose }: Props) {
  if (!speaker) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white theme-radius-modal max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close speaker bio"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 sm:gap-5 mb-5">
          {speaker.imageUrl ? (
            <Image
              src={speaker.imageUrl}
              alt={speaker.name}
              width={80}
              height={80}
              className="theme-radius-sm object-cover w-20 h-20 shrink-0 border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 theme-radius-sm bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <User className="w-8 h-8" />
            </div>
          )}

          <div className="min-w-0 pr-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
              Featured Speaker
            </span>
            <h3 className="text-xl sm:text-2xl font-display text-slate-900 leading-snug">
              {speaker.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
              {speaker.title}
            </p>
            {speaker.company && (
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                {speaker.company}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Biography
          </h4>
          <div className="text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line pr-1">
            {speaker.bio || "No extended biography provided."}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 theme-radius-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
