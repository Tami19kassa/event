"use client";

import Image from "next/image";
import { Edit2, Trash2, ArrowUp, ArrowDown, User } from "lucide-react";
import type { SpeakerInput } from "@/lib/event-form-types";

interface Props {
  speaker: SpeakerInput;
  index: number;
  totalCount: number;
  onEdit: (index: number) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (index: number) => void;
}

export function SpeakerSummaryCard({
  speaker,
  index,
  totalCount,
  onEdit,
  onMove,
  onRemove,
}: Props) {
  return (
    <div
      data-speaker-admin-card
      className="p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 theme-radius flex flex-col justify-between gap-3 transition"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden relative shrink-0 flex items-center justify-center">
          {speaker.imageUrl ? (
            <Image
              src={speaker.imageUrl}
              alt={speaker.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <User className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              #{index + 1}
            </span>
            <h4 className="font-bold text-sm text-slate-900 truncate">
              {speaker.name || "Unnamed Speaker"}
            </h4>
          </div>

          {(speaker.title || speaker.company) && (
            <p className="text-xs text-slate-600 truncate mt-0.5">
              {[speaker.title, speaker.company].filter(Boolean).join(" · ")}
            </p>
          )}

          {speaker.bio && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1">
              {speaker.bio}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5 mt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
            title="Move earlier"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={() => onMove(index, 1)}
            className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
            title="Move later"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(index)}
            data-edit-speaker-btn
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <Edit2 className="w-3 h-3 text-slate-500" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
            title="Delete speaker"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
