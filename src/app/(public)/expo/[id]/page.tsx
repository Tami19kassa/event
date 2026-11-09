import { notFound } from "next/navigation";
import { getExpoSlideById, getExpoSlides } from "@/lib/expo-settings";
import { Calendar, MapPin, Building2, ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { extractYouTubeId, buildYouTubeBackgroundUrl } from "@/lib/youtube";

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

  const youtubeId = expo.mediaType === "video" && expo.videoUrl ? extractYouTubeId(expo.videoUrl) : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Events & Expos
          </Link>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Official B2B Trade Exhibition
          </span>
        </div>
      </div>

      {/* Hero Media Section */}
      <div className="relative bg-slate-950 text-white min-h-[400px] md:min-h-[480px] flex items-end">
        {expo.mediaType === "video" && youtubeId ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={buildYouTubeBackgroundUrl(youtubeId)}
              title={expo.title}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover opacity-80 scale-[1.2] border-0"
              tabIndex={-1}
            />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={expo.posterUrl}
            alt={expo.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Subtle bottom shadow gradient to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

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

      {/* Main Content & Registration Actions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: In-Depth Overview & Details */}
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

          {/* Right Column: Instant Registration & Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm sticky top-24">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Participation & Passes
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                Reserve Your Place at {expo.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose between trade buyer passes or reserve dedicated booth exhibition space.
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={expo.visitorCtaLink}
                  style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
                  className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 hover:brightness-110"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{expo.visitorCtaText}</span>
                </Link>

                <Link
                  href="/#calendar"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{expo.exhibitorCtaText}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
