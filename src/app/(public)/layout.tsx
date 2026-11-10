import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieConsent } from "@/components/CookieConsent";
import { getThemeSettings } from "@/lib/settings";
import { getCategories } from "@/lib/events";
import { getCookieSettings } from "@/lib/cookie-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, categories, cookieSettings] = await Promise.all([
    getThemeSettings(),
    getCategories(),
    getCookieSettings(),
  ]);

  return (
    <>
      <Header
        siteName={theme.siteName}
        logoUrl={theme.logoUrl}
        primaryColor={theme.primaryColor}
        categories={categories}
      />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer siteName={theme.siteName} logoUrl={theme.logoUrl} logoDarkUrl={theme.logoDarkUrl} />
      <BottomNav />
      <CookieConsent settings={cookieSettings} />
    </>
  );
}
