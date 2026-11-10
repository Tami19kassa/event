import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieConsent } from "@/components/CookieConsent";
import { getThemeSettings } from "@/lib/settings";
import { extractTopVenues, getAllEvents, getCategories } from "@/lib/events";
import { getCookieSettings } from "@/lib/cookie-settings";
import { getPublicPaymentSettings } from "@/lib/payment-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, categories, cookieSettings, allEvents, paymentSettings] = await Promise.all([
    getThemeSettings(),
    getCategories(),
    getCookieSettings(),
    getAllEvents(),
    getPublicPaymentSettings(),
  ]);

  const topVenues = extractTopVenues(allEvents, 4);

  return (
    <>
      <Header
        siteName={theme.siteName}
        logoUrl={theme.logoUrl}
        primaryColor={theme.primaryColor}
        categories={categories}
      />
      <main className="flex-1">{children}</main>
      <Footer
        theme={theme}
        categories={categories}
        venues={topVenues}
        paymentSettings={{
          allowPayAtGate: paymentSettings.allowPayAtGate,
          currency: paymentSettings.currency,
        }}
        privacyPolicyUrl={cookieSettings.privacyPolicyUrl}
        cookiesEnabled={cookieSettings.enabled}
      />
      <BottomNav />
      <CookieConsent settings={cookieSettings} />
    </>
  );
}
