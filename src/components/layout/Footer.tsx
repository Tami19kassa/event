import Link from "next/link";
import { MapPin } from "lucide-react";
import { defaultPaymentSettings, type PaymentSettings } from "@/lib/payment-types";
import { defaultThemeSettings, type ThemeSettings } from "@/lib/theme-types";
import type { FooterVenueItem } from "@/lib/events";
import { FooterBanner } from "./footer/FooterBanner";
import { FooterBrandColumn } from "./footer/FooterBrandColumn";
import { FooterPaymentColumn } from "./footer/FooterPaymentColumn";
import { FooterLegalBar } from "./footer/FooterLegalBar";

type Props = {
  theme?: ThemeSettings;
  categories?: Array<{ name: string; slug: string }>;
  venues?: FooterVenueItem[];
  paymentSettings?: Pick<PaymentSettings, "allowPayAtGate" | "currency">;
  privacyPolicyUrl?: string;
  cookiesEnabled?: boolean;
};

const FALLBACK_CATEGORIES = [
  { name: "Technology & Startups", slug: "technology" },
  { name: "Concerts & Live Shows", slug: "music" },
  { name: "Business Summits & Expos", slug: "business" },
];

const FALLBACK_VENUES: FooterVenueItem[] = [
  { name: "Millennium Hall", city: "Addis Ababa" },
  { name: "Ethiopian Skylight Convention Center", city: "Addis Ababa" },
  { name: "Friendship Park", city: "Addis Ababa" },
  { name: "UNECA Conference Center", city: "Addis Ababa" },
];

export function Footer({
  theme = defaultThemeSettings,
  categories,
  venues,
  paymentSettings = defaultPaymentSettings,
  privacyPolicyUrl = "/privacy",
  cookiesEnabled = true,
}: Props) {
  const activeCategories =
    categories && categories.length > 0 ? categories.slice(0, 4) : FALLBACK_CATEGORIES;
  const activeVenues =
    venues && venues.length > 0 ? venues.slice(0, 4) : FALLBACK_VENUES;
  const currency = paymentSettings.currency || "ETB";

  return (
    <footer
      data-surface="dark"
      className="relative bg-slate-950 text-slate-300 border-t border-slate-900 overflow-hidden"
    >
      <div
        className="h-1 w-full"
        style={{ background: "var(--hero-bg, var(--color-primary))" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--color-primary)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: "var(--color-secondary)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14">
        <FooterBanner currency={currency} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <FooterBrandColumn theme={theme} />

          <nav aria-label="Explore Events" className="lg:col-span-3">
            <h3 className="font-display text-sm sm:text-[15px] font-bold text-white mb-4">
              Explore Events
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link href="/discover" className="footer-link inline-flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--color-primary-on-dark, #a5b4fc)" }}
                  />
                  <span>All Events &amp; Expos</span>
                </Link>
              </li>
              {activeCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/discover?category=${encodeURIComponent(c.slug)}`}
                    className="footer-link inline-flex items-center gap-2 capitalize"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Featured Venues" className="lg:col-span-2">
            <h3 className="font-display text-sm sm:text-[15px] font-bold text-white mb-4">
              Featured Venues
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {activeVenues.map((v) => (
                <li key={v.name}>
                  <Link
                    href={`/discover?q=${encodeURIComponent(v.name)}`}
                    className="footer-link inline-flex items-start gap-1.5 leading-snug"
                  >
                    <MapPin
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: "var(--color-secondary-on-dark, #2dd4bf)" }}
                    />
                    <span>{v.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <FooterPaymentColumn
            allowPayAtGate={paymentSettings.allowPayAtGate}
            currency={currency}
          />
        </div>

        <FooterLegalBar
          siteName={theme.siteName}
          privacyPolicyUrl={privacyPolicyUrl}
          cookiesEnabled={cookiesEnabled}
        />
      </div>
    </footer>
  );
}
