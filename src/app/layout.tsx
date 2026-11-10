import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getThemeSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeSettings();
  return {
    title: `${theme.siteName} — Events & B2B Expos`,
    description:
      "Discover, reserve passes, and exhibit at flagship conferences, concerts, and B2B trade exhibitions.",
    icons: theme.faviconUrl ? [{ rel: "icon", url: theme.faviconUrl }] : undefined,
  };
}

function radiusValue(r: string) {
  switch (r) {
    case "none": return "0px";
    case "sm": return "6px";
    case "md": return "10px";
    case "lg": return "14px";
    case "xl": return "16px";
    default: return "14px";
  }
}

function hexToRgb(hex: string, fallback = "79, 70, 229"): string {
  const clean = (hex || "").replace("#", "");
  if (clean.length === 3) {
    return `${parseInt(clean[0] + clean[0], 16)}, ${parseInt(clean[1] + clean[1], 16)}, ${parseInt(clean[2] + clean[2], 16)}`;
  }
  if (clean.length === 6) {
    return `${parseInt(clean.substring(0, 2), 16)}, ${parseInt(clean.substring(2, 4), 16)}, ${parseInt(clean.substring(4, 6), 16)}`;
  }
  return fallback;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();
  const primaryRgb = hexToRgb(theme.primaryColor || "#4F46E5");
  const secondaryRgb = hexToRgb(theme.secondaryColor || "#0D9488", "13, 148, 136");
  const heroBg =
    theme.themeType === "gradient"
      ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
      : theme.primaryColor;

  return (
    <html lang="en" data-button-style={theme.buttonStyle || "filled"} className={inter.variable}>
      <head>
        <style
          id="theme-dynamic-vars"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${theme.primaryColor} !important;
                --color-primary-rgb: ${primaryRgb} !important;
                --color-secondary: ${theme.secondaryColor} !important;
                --color-secondary-rgb: ${secondaryRgb} !important;
                --color-accent: ${theme.accentColor} !important;
                --radius: ${radiusValue(theme.borderRadius)} !important;
                --hero-bg: ${heroBg} !important;
              }
              .theme-bg-primary { background-color: ${theme.primaryColor} !important; }
              .theme-text-primary { color: ${theme.primaryColor} !important; }
              .theme-border-primary { border-color: ${theme.primaryColor} !important; }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
