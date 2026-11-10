import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { getThemeSettings } from "@/lib/settings";
import { getCookieSettings } from "@/lib/cookie-settings";
import { ResetCookiesButton } from "@/components/privacy/ResetCookiesButton";

export const revalidate = 300;

export default async function PrivacyPolicyPage() {
  const [theme, cookieSettings] = await Promise.all([
    getThemeSettings(),
    getCookieSettings(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {theme.siteName}
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl theme-badge border flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] block">
              Data &amp; Privacy Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Privacy &amp; Cookie Policy
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {theme.siteName} collects only the information necessary to issue verified event passes, coordinate B2B exhibitor/sponsor inquiries, and maintain secure platform operations across events and online sessions.
        </p>

        <section className="space-y-2 border-t border-slate-100 pt-5">
          <h2 className="text-base font-extrabold text-slate-900">1. Information Collected</h2>
          <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong>Ticket Bookings:</strong> Name, email, phone number, selected pass tiers, and Telebirr/CBE transaction references for payment verification and venue gate entry.</li>
            <li><strong>B2B Inquiries:</strong> Company name, contact person, corporate email, phone, and booth/sponsorship requirements submitted via exhibitor and sponsor forms.</li>
            <li><strong>Cookie Preferences:</strong> Consent state stored locally and anonymized preference timestamps.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-5">
          <h2 className="text-base font-extrabold text-slate-900">2. Cookie Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Essential</div>
              <p className="text-slate-600">Required for session authentication, ticket reservation stability, and saving your consent preference.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">
                Analytics ({cookieSettings.showAnalytics ? "Optional" : "Disabled"})
              </div>
              <p className="text-slate-600">Measures aggregated page performance and event discovery trends without selling personal profiles.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">
                Marketing ({cookieSettings.showMarketing ? "Optional" : "Disabled"})
              </div>
              <p className="text-slate-600">Supports opt-in trade show announcements and relevant B2B partner highlights.</p>
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            You can review or reset your saved browser cookie choice at any time.
          </p>
          <ResetCookiesButton />
        </div>
      </div>
    </div>
  );
}
