import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { getThemeSettings } from "@/lib/settings";
import { getCategories } from "@/lib/events";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, categories] = await Promise.all([
    getThemeSettings(),
    getCategories(),
  ]);

  return (
    <>
      <Header
        siteName={theme.siteName}
        logoUrl={theme.logoUrl}
        primaryColor={theme.primaryColor}
        categories={categories}
      />
      <main className="flex-1">{children}</main>
      <Footer siteName={theme.siteName} />
      <CookieConsent />
    </>
  );
}
