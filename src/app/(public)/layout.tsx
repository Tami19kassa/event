import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieConsent } from "@/components/CookieConsent";
import { getThemeSettings } from "@/lib/settings";
import { getCategories } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer siteName={theme.siteName} />
      <BottomNav />
      <CookieConsent />
    </>
  );
}
