"use client";

import { useState } from "react";
import { Handshake, Award } from "lucide-react";
import { SponsorItem } from "@/lib/expo-settings";
import { SponsorInquiryModal } from "./SponsorInquiryModal";

interface Props {
  sponsors: SponsorItem[];
}

export function SponsorsMarquee({ sponsors }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const strategic = sponsors.filter((s) => s.tier === "STRATEGIC");
  const others = sponsors.filter((s) => s.tier !== "STRATEGIC");

  return (
    <>
      <section className="bg-slate-900 text-white border-t border-slate-800 py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                  Official Expo Backing
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Commercial Sponsors & Strategic Partners
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl border border-white/15 transition cursor-pointer self-start sm:self-auto shadow-xs active:scale-95"
            >
              <Handshake className="w-4 h-4 text-amber-300" />
              <span>Become a Sponsor</span>
            </button>
          </div>

          {/* Strategic & Title Partners */}
          {strategic.length > 0 && (
            <div className="mb-8">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3.5">
                Strategic & Title Partners
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {strategic.map((s) => {
                  const hasLogo = Boolean(s.logoUrl && !failedLogos[s.id]);
                  const safeHref = s.websiteUrl && /^https?:\/\//i.test(s.websiteUrl) ? s.websiteUrl : undefined;
                  const CardTag = safeHref ? "a" : "div";
                  const linkProps = safeHref ? { href: safeHref, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <CardTag
                      key={s.id}
                      {...linkProps}
                      className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 rounded-2xl p-3.5 flex items-center gap-4 transition group shadow-xs"
                    >
                      {/* Logo Housing - Clean white rounded box to fit any white or transparent logo */}
                      <div className="w-16 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                        {hasLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.logoUrl}
                            alt={s.name}
                            onError={() => setFailedLogos((p) => ({ ...p, [s.id]: true }))}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-base font-black text-slate-900">
                            {s.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Partner Name & Tier Info */}
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors block truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                          Strategic Partner
                        </span>
                      </div>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          )}

          {/* Platinum, Institutional & Media Partners */}
          {others.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3.5">
                Platinum, Institutional &amp; Media Partners
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {others.map((s) => {
                  const hasLogo = Boolean(s.logoUrl && !failedLogos[s.id]);
                  const safeHref = s.websiteUrl && /^https?:\/\//i.test(s.websiteUrl) ? s.websiteUrl : undefined;
                  const CardTag = safeHref ? "a" : "div";
                  const linkProps = safeHref ? { href: safeHref, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <CardTag
                      key={s.id}
                      {...linkProps}
                      className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3 transition group"
                    >
                      {hasLogo && (
                        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.logoUrl}
                            alt={s.name}
                            onError={() => setFailedLogos((p) => ({ ...p, [s.id]: true }))}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate">
                        {s.name}
                      </span>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Become a Sponsor Modal */}
      <SponsorInquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
