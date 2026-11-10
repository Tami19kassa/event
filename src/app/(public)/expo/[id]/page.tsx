import { notFound } from "next/navigation";
import { getExpoSlideById, getExpoSlides } from "@/lib/expo-settings";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExpoMediaBackground } from "@/components/expo/ExpoMediaBackground";
import { ExpoBookingCard } from "@/components/expo/ExpoBookingCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const slides = await getExpoSlides();
  return slides.map((s) => ({ id: s.id }));
}

export default async function DedicatedExpoPage({ params }: Props) {
  const { id } = await params;
  const expo = await getExpoSlideById(id);

  if (!expo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Events &amp; Expos
          </Link>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Official B2B Trade Exhibition
          </span>
        </div>
      </div>

      <div className="relative bg-slate-950 text-white min-h-[400px] md:min-h-[480px] flex items-end overflow-hidden">
        <ExpoMediaBackground
          mediaType={expo.mediaType}
          videoUrl={expo.videoUrl}
          posterUrl={expo.posterUrl}
          title={expo.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full z-10">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                className="px-3 py-1 rounded-full text-white text-xs font-bold"
              >
                {expo.badgeText}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                {expo.category}
              </span>
            </div>

            <h1
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)",
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
            >
              {expo.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>{expo.datesText}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <MapPin className="w-4 h-4 text-rose-300" />
                <span>{expo.venueText}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">About This Exhibition</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {expo.detailedDescription || expo.subtitle}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Host Venue
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">{expo.venueText}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Event Dates
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">{expo.datesText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ExpoBookingCard
              expoTitle={expo.title}
              visitorCtaText={expo.visitorCtaText}
              visitorCtaLink={expo.visitorCtaLink}
              exhibitorCtaText={expo.exhibitorCtaText}
              exhibitorCtaLink={expo.exhibitorCtaLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
