"use client";

import { useEffect, useRef, useState } from "react";
import { Event } from "@/types/event";
import { EventCalendarCard } from "./EventCalendarCard";
import { ArrowDown, ArrowUpDown, Layers, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  events: Event[];
  onSelect: (event: Event) => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function EventCalendarDeck({ events, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const reducedStripRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const [fanned, setFanned] = useState(false);
  const [stageWidth, setStageWidth] = useState(1024);
  const [reducedMotion, setReducedMotion] = useState(false);

  const total = events.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMqChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  useEffect(() => {
    const syncFrame = () => {
      if (!trackRef.current || !stageRef.current) return;
      const w = stageRef.current.clientWidth || 1024;
      const rect = trackRef.current.getBoundingClientRect();
      const stickyTop = 76;
      const scrollableDist = Math.max(1, rect.height - window.innerHeight + stickyTop);
      const p = clamp((stickyTop - rect.top) / scrollableDist, 0, 1);
      progressRef.current = p;

      const u = clamp(p / 0.55, 0, 1);
      const eu = 1 - Math.pow(1 - u, 3);
      const pan = clamp((p - 0.55) / 0.45, 0, 1);
      const ep = pan < 0.5 ? 2 * pan * pan : 1 - Math.pow(-2 * pan + 2, 2) / 2;

      const cardWidth = w < 640 ? 270 : 300;
      const gap = w < 640 ? 16 : 24;
      const totalRowWidth = total * cardWidth + (total - 1) * gap;
      const deckPeek = Math.min(total - 1, 4);
      const deckStartX = Math.max(0, (w - (cardWidth + deckPeek * 14)) / 2);
      const rowStartX = totalRowWidth < w ? (w - totalRowWidth) / 2 : 0;
      const maxPan = Math.max(0, totalRowWidth - w + 16);
      const baseX = lerp(deckStartX, rowStartX, eu) - ep * maxPan;

      stageRef.current.style.setProperty("--deck-eu", eu.toFixed(4));
      stageRef.current.style.setProperty("--deck-base-x", `${baseX.toFixed(2)}px`);

      const pct = Math.round(p * 100);
      if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
      if (progressLabelRef.current) progressLabelRef.current.textContent = `${pct}%`;
      setFanned((prev) => (prev === (p >= 0.15) ? prev : p >= 0.15));
    };

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncFrame);
    };
    const onResize = () => {
      if (stageRef.current) setStageWidth(stageRef.current.clientWidth);
      syncFrame();
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [total, reducedMotion]);

  if (total === 0) return null;

  if (total === 1) {
    return (
      <div className="flex justify-center py-6">
        <EventCalendarCard event={events[0]} onSelect={onSelect} />
      </div>
    );
  }

  const nudgeScroll = (dir: -1 | 1) => {
    if (reducedMotion && reducedStripRef.current) {
      reducedStripRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
      return;
    }
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const stickyTop = 76;
    const scrollableDist = Math.max(1, rect.height - window.innerHeight + stickyTop);
    const cur = progressRef.current;
    const nextP =
      dir > 0
        ? cur < 0.55 ? 0.56 : clamp(cur + 0.22, 0, 1)
        : cur <= 0.56 && cur > 0.1 ? 0 : clamp(cur - 0.22, 0, 1);
    const trackAbsTop = window.scrollY + rect.top;
    window.scrollTo({ top: trackAbsTop - stickyTop + nextP * scrollableDist, behavior: "smooth" });
  };

  if (reducedMotion) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => nudgeScroll(-1)} aria-label="Scroll left" className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
          <button type="button" onClick={() => nudgeScroll(1)} aria-label="Scroll right" className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div ref={reducedStripRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar">
          {events.map((evt) => (
            <div key={evt.id} className="shrink-0 snap-start"><EventCalendarCard event={evt} onSelect={onSelect} /></div>
          ))}
        </div>
      </div>
    );
  }

  const isMobile = stageWidth < 640;
  const stride = (isMobile ? 270 : 300) + (isMobile ? 16 : 24);
  const trackHeightVh = Math.min(280, Math.max(180, 115 + total * 22));

  return (
    <div ref={trackRef} style={{ height: `${trackHeightVh}vh` }} className="relative">
      <div className="sticky top-16 sm:top-20 py-4 flex flex-col justify-center overflow-x-clip">
        <div className="flex items-center justify-between gap-4 mb-5 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            {!fanned ? (
              <>
                <Layers className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span>Stacked Schedule Deck — Scroll down to fan horizontally</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce text-slate-400 shrink-0" />
              </>
            ) : (
              <>
                <ArrowUpDown className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <span>Scroll up to stack back • Scroll down to explore all {total} events</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 mr-1">
              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div ref={progressBarRef} className="h-full bg-[var(--color-primary)] rounded-full w-0" />
              </div>
              <span ref={progressLabelRef} className="text-[10px] font-mono font-bold text-slate-500 w-8">0%</span>
            </div>
            <button type="button" onClick={() => nudgeScroll(-1)} aria-label="Previous events" className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <button type="button" onClick={() => nudgeScroll(1)} aria-label="Next events" className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={stageRef} className="relative w-full h-[365px]">
          {events.map((evt, i) => {
            const peekIdx = Math.min(i, 4);
            const deckScale = Math.max(0.86, 1 - peekIdx * 0.035);
            const deckRot = i === 0 ? 0 : i % 2 === 1 ? 2.2 : -1.8;

            return (
              <div
                key={evt.id}
                style={{
                  ["--deck-x" as string]: `${peekIdx * 14}px`,
                  ["--row-x" as string]: `${i * stride}px`,
                  ["--deck-y" as string]: `${peekIdx * 5}px`,
                  ["--deck-scale" as string]: `${deckScale}`,
                  ["--deck-rot" as string]: `${deckRot}deg`,
                  transform:
                    "translate3d(calc(var(--deck-base-x, 0px) + var(--deck-x) + (var(--row-x) - var(--deck-x)) * var(--deck-eu, 0)), calc(var(--deck-y) * (1 - var(--deck-eu, 0))), 0) scale(calc(var(--deck-scale) + (1 - var(--deck-scale)) * var(--deck-eu, 0))) rotate(calc(var(--deck-rot) * (1 - var(--deck-eu, 0))))",
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
