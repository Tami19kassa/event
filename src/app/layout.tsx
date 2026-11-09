import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getThemeSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeSettings();
  return {
    title: `${theme.siteName} — Discover & Host Amazing Events`,
    description:
      "Modern platform to discover, organize, and attend events in Addis Ababa, Ethiopia.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();

  const cssVars = {
    "--color-primary": theme.primaryColor,
    "--color-secondary": theme.secondaryColor,
    "--color-accent": theme.accentColor,
    "--gradient-from": theme.gradientFrom,
    "--gradient-to": theme.gradientTo,
    "--radius": radiusValue(theme.borderRadius),
    "--hero-bg":
      theme.themeType === "gradient"
        ? `linear-gradient(${
            theme.gradientDirection === "to-r"
              ? "to right"
              : theme.gradientDirection === "to-b"
                ? "to bottom"
                : theme.gradientDirection === "to-tr"
                  ? "to top right"
                  : "to bottom right"
          }, ${theme.gradientFrom}, ${theme.gradientTo})`
        : theme.primaryColor,
  } as React.CSSProperties;

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased" style={cssVars}>
        {children}
      </body>
    </html>
  );
}
