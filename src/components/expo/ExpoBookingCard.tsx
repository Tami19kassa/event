"use client";

import { useState } from "react";
import Link from "next/link";
import { Ticket, Building2 } from "lucide-react";
import { ExhibitorInquiryModal } from "@/components/home/ExhibitorInquiryModal";

interface Props {
  expoTitle: string;
  visitorCtaText: string;
  visitorCtaLink: string;
  exhibitorCtaText: string;
  exhibitorCtaLink: string;
}

export function ExpoBookingCard({
  expoTitle,
  visitorCtaText,
  visitorCtaLink,
  exhibitorCtaText,
  exhibitorCtaLink,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const isCustomLink = Boolean(exhibitorCtaLink && !exhibitorCtaLink.startsWith("#"));

  return (
    <>
      <div className="bg-white theme-radius-card border border-slate-200 p-6 space-y-4 shadow-sm sticky top-24">
        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">
          Participation &amp; Passes
        </span>
        <h3 className="text-lg font-display text-slate-900 leading-snug">
          Reserve Your Place at {expoTitle}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Choose between trade buyer passes or reserve dedicated booth exhibition space.
        </p>

        <div className="space-y-2.5 pt-2">
          <Link
            href={visitorCtaLink || "/discover"}
            className="w-full py-3 font-bold text-xs shadow-md flex items-center justify-center gap-2 theme-btn-primary"
          >
            <Ticket className="w-4 h-4" />
            <span>{visitorCtaText}</span>
          </Link>

          {isCustomLink ? (
            <Link
              href={exhibitorCtaLink}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs theme-radius transition flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{exhibitorCtaText}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs theme-radius transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>{exhibitorCtaText}</span>
            </button>
          )}
        </div>
      </div>

      <ExhibitorInquiryModal
        expoTitle={expoTitle}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
