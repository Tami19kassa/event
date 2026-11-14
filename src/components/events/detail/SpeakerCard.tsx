"use client";

import Image from "next/image";
import { User, ChevronRight } from "lucide-react";
import type { Speaker } from "@/types/event";

interface Props {
  speaker: Speaker;
  onSelect: (speaker: Speaker) => void;
}

export function SpeakerCard({ speaker, onSelect }: Props) {
  return (
    <div
      data-speaker-card={speaker.name}
      onClick={() => onSelect(speaker)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(speaker);
        }
      }}
      className="group flex gap-3.5 p-3.5 border border-slate-200 hover:border-slate-300 theme-radius-card bg-white shadow-2xs hover:shadow-sm transition text-left cursor-pointer relative"
    >
      {speaker.imageUrl ? (
        <Image
          src={speaker.imageUrl}
          alt={speaker.name}
          width={56}
          height={56}
          className="theme-radius-sm object-cover w-14 h-14 shrink-0 border border-slate-100"
        />
      ) : (
        <div className="w-14 h-14 theme-radius-sm bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
          <User className="w-6 h-6" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary-ink,var(--color-primary))] transition line-clamp-1">
          {speaker.name}
        </h3>
        <p className="text-xs text-[var(--color-primary)] font-medium line-clamp-1 mt-0.5">
          {speaker.title}
          {speaker.company && ` · ${speaker.company}`}
        </p>
        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 mt-1.5 inline-flex items-center gap-0.5 transition">
          View profile <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
