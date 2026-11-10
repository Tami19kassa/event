import type { Metadata } from "next";
import "./globals.css";
import { FONT_VARIABLE_CLASSES } from "./fonts";
import { buildThemeCssText, getRelativeLuminance, normalizeHex } from "@/lib/theme-colors";
import { getThemeSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeSettings();
  const title = `${theme.siteName} — Events & B2B Expos`;
  const description =
    "Discover, reserve passes, and exhibit at flagship conferences, concerts, and B2B trade exhibitions.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: theme.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: theme.faviconUrl ? [{ rel: "icon", url: theme.faviconUrl }] : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();
  const sidebarIsLight =
    getRelativeLuminance(normalizeHex(theme.adminSidebarColor, "#09090B")) > 0.36;

  return (
    <html
      lang="en"
      data-button-style={theme.buttonStyle || "filled"}
      data-theme-type={theme.themeType || "solid"}
      data-sidebar-surface={sidebarIsLight ? "light" : "dark"}
      className={FONT_VARIABLE_CLASSES}
    >
      <head>
        <style
          id="theme-dynamic-vars"
          dangerouslySetInnerHTML={{ __html: buildThemeCssText(theme) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
