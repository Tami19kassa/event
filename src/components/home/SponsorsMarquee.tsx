"use client";

import { Handshake, Award } from "lucide-react";
import { SponsorItem } from "@/lib/expo-settings";

interface Props {
  sponsors: SponsorItem[];
}

export function SponsorsMarquee({ sponsors }: Props) {
  const strategic = sponsors.filter((s) => s.tier === "STRATEGIC");
  const others = sponsors.filter((s) => s.tier !== "STRATEGIC");

  return (
    <section className="bg-slate-900 text-white border-y border-slate-800 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Official Expo Backing
              </span>
              <h3 className="text-base font-extrabold text-white">
                Strategic Partners & Commercial Sponsors
              </h3>
            </div>
          </div>
          <a
            href="mailto:sponsors@eventhub.com?subject=Expo%20Sponsorship%20Inquiry"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Become a Sponsor</span>
          </a>
        </div>

        {/* Strategic Tier */}
        {strategic.length > 0 && (
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Strategic & Title Partners
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {strategic.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-3.5 flex items-center justify-center text-center transition group shadow-xs"
                >
                  <span className="font-extrabold text-xs sm:text-sm text-slate-300 group-hover:text-white tracking-wide transition-colors">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General & Media Tier */}
        {others.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Platinum, Institutional & Media Partners
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {others.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 font-semibold transition"
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
