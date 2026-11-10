"use client";

import { useEffect, useRef, useState } from "react";
import { Event } from "@/types/event";
import { EventCalendarCard } from "./EventCalendarCard";
import { ArrowDown, ArrowUpDown, Layers } from "lucide-react";

interface Props {
  events: Event[];
  onSelect: (event: Event) => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function EventCalendarDeck({ events, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stageWidth, setStageWidth] = useState(1024);

  useEffect(() => {
    const updateWidth = () => {
      if (stageRef.current) setStageWidth(stageRef.current.clientWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const stickyTopOffset = 76; // sits cleanly below sticky header
        const scrollableDist = Math.max(1, rect.height - window.innerHeight + stickyTopOffset);
        const rawProgress = (stickyTopOffset - rect.top) / scrollableDist;
        setProgress(clamp(rawProgress, 0, 1));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [events.length]);

  const total = events.length;
  if (total === 0) return null;

  if (total === 1) {
    return (
      <div className="flex justify-center py-6">
        <EventCalendarCard event={events[0]} onSelect={onSelect} />
      </div>
    );
  }

  const isMobile = stageWidth < 640;
  const cardWidth = isMobile ? 270 : 300;
  const gap = isMobile ? 16 : 24;
  const stride = cardWidth + gap;

  // Phase 1 (0 -> 0.55): Unstack deck horizontally; Phase 2 (0.55 -> 1): Pan remaining cards
  const u = clamp(progress / 0.55, 0, 1);
  const eu = 1 - Math.pow(1 - u, 3); // smooth cubic ease-out

  const pan = clamp((progress - 0.55) / 0.45, 0, 1);
  const ep = pan < 0.5 ? 2 * pan * pan : 1 - Math.pow(-2 * pan + 2, 2) / 2;

  const totalRowWidth = total * cardWidth + (total - 1) * gap;
  const deckPeekCount = Math.min(total - 1, 4);
  const deckStartX = Math.max(0, (stageWidth - (cardWidth + deckPeekCount * 14)) / 2);
  const rowStartX = totalRowWidth < stageWidth ? (stageWidth - totalRowWidth) / 2 : 0;
  const maxPan = Math.max(0, totalRowWidth - stageWidth + 16);
  const panOffset = -ep * maxPan;

  const trackHeightVh = Math.min(280, Math.max(180, 115 + total * 22));

  return (
    <div ref={trackRef} style={{ height: `${trackHeightVh}vh` }} className="relative">
      {/* Sticky Stage: pins smoothly without breaking overflow */}
      <div className="sticky top-16 sm:top-20 py-4 flex flex-col justify-center overflow-x-clip">
        {/* Live Scroll State Indicator */}
        <div className="flex items-center justify-between gap-4 mb-5 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            {progress < 0.15 ? (
              <>
                <Layers style={{ color: "var(--color-primary, #4F46E5)" }} className="w-4 h-4" />
                <span>Stacked Schedule Deck — Scroll down to fan horizontally</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce text-slate-400" />
              </>
            ) : (
              <>
                <ArrowUpDown style={{ color: "var(--color-primary, #4F46E5)" }} className="w-4 h-4" />
                <span>Scroll up to stack back • Scroll down to explore all {total} events</span>
              </>
            )}
          </div>

          {/* Progress Track Pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: "var(--color-primary, #4F46E5)",
                }}
                className="h-full rounded-full transition-all duration-75"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 w-8">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Interactive GPU-Accelerated Deck Stage */}
        <div ref={stageRef} className="relative w-full h-[365px]">
          {events.map((evt, i) => {
            const peekIdx = Math.min(i, 4);
            const deckX = peekIdx * 14;
            const deckY = peekIdx * 5;
            const deckScale = Math.max(0.86, 1 - peekIdx * 0.035);
            const deckRot = i === 0 ? 0 : i % 2 === 1 ? 2.2 : -1.8;

            const startX = lerp(deckStartX, rowStartX, eu) + panOffset;
            const cardOffsetX = lerp(deckX, i * stride, eu);
            const x = startX + cardOffsetX;
            const y = lerp(deckY, 0, eu);
            const scale = lerp(deckScale, 1, eu);
            const rot = lerp(deckRot, 0, eu);

            return (
              <div
                key={evt.id}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rot}deg)`,
                  zIndex: total - i,
                  transformOrigin: "center center",
                }}
                className="absolute top-0 left-0 will-change-transform"
              >
                <EventCalendarCard event={evt} onSelect={onSelect} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
