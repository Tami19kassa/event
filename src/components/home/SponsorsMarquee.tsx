"use client";

import { useState } from "react";
import { Handshake, Award, ArrowUpRight } from "lucide-react";
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
      <section className="bg-slate-100/90 text-slate-900 border-t border-slate-200 py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/90 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl theme-badge border flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest block">
                  Official Expo Backing
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Commercial Sponsors &amp; Strategic Partners
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition cursor-pointer self-start sm:self-auto shadow-xs active:scale-95"
            >
              <Handshake className="w-4 h-4 text-amber-400" />
              <span>Become a Sponsor</span>
            </button>
          </div>

          {strategic.length > 0 && (
            <div className="mb-8">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3.5">
                Strategic &amp; Title Partners
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategic.map((s) => {
                  const hasLogo = Boolean(s.logoUrl && !failedLogos[s.id]);
                  const safeHref = s.websiteUrl && /^https?:\/\//i.test(s.websiteUrl) ? s.websiteUrl : undefined;
                  const CardTag = safeHref ? "a" : "div";
                  const linkProps = safeHref ? { href: safeHref, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <CardTag
                      key={s.id}
                      {...linkProps}
                      className="bg-white hover:border-[var(--color-primary)] border border-slate-200/90 rounded-2xl p-4 flex items-center gap-4 transition group shadow-xs hover:shadow-md"
                    >
                      <div className="w-24 h-14 flex items-center justify-center shrink-0">
                        {hasLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.logoUrl}
                            alt={s.name}
                            onError={() => setFailedLogos((p) => ({ ...p, [s.id]: true }))}
                            className="max-h-12 max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-14 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-base font-black text-slate-700">
                            {s.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 border-l border-slate-100 pl-4">
                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 truncate">
                          <span className="truncate">{s.name}</span>
                          {safeHref && <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                          Strategic Partner
                        </span>
                      </div>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3.5">
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
                      className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition group shadow-2xs hover:shadow-xs"
                    >
                      {hasLogo && (
                        <div className="w-11 h-9 flex items-center justify-center shrink-0">
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
                      <span className="text-xs font-bold text-slate-700 group-hover:text-[var(--color-primary)] truncate">
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

      <SponsorInquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
