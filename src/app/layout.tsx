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
    title: `${theme.siteName} — Discover & Host Amazing Events`,
    description: "Modern platform to discover, organize, and attend events in Addis Ababa, Ethiopia.",
  };
}

function radiusValue(r: string) {
  switch (r) {
    case "none": return "0px";
    case "sm": return "4px";
    case "md": return "8px";
    case "lg": return "12px";
    case "xl": return "16px";
    default: return "12px";
  }
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return `${parseInt(clean[0] + clean[0], 16)}, ${parseInt(clean[1] + clean[1], 16)}, ${parseInt(clean[2] + clean[2], 16)}`;
  }
  if (clean.length === 6) {
    return `${parseInt(clean.substring(0, 2), 16)}, ${parseInt(clean.substring(2, 4), 16)}, ${parseInt(clean.substring(4, 6), 16)}`;
  }
  return "79, 70, 229";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();
  const primaryRgb = hexToRgb(theme.primaryColor || "#4F46E5");

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style
          id="theme-dynamic-vars"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${theme.primaryColor} !important;
                --color-primary-rgb: ${primaryRgb} !important;
                --color-secondary: ${theme.secondaryColor} !important;
                --color-accent: ${theme.accentColor} !important;
                --radius: ${radiusValue(theme.borderRadius)} !important;
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
