"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { applyThemeToDocument } from "@/lib/theme-colors";
import { buildThemeScopeStyle, isSidebarLightSurface } from "@/lib/theme-scope";
import type { ThemeSettings } from "@/lib/theme-types";

interface Props {
  initialTheme: ThemeSettings;
  children: React.ReactNode;
}

export function AdminThemeScope({ initialTheme, children }: Props) {
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  useLayoutEffect(() => {
    applyThemeToDocument(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<ThemeSettings>).detail;
      if (detail) {
        setTheme(detail);
      }
    };

    window.addEventListener("utopia:theme-change", onThemeChange);
    return () => {
      window.removeEventListener("utopia:theme-change", onThemeChange);
    };
  }, []);

  const sidebarIsLight = isSidebarLightSurface(theme.adminSidebarColor);

  return (
    <div
      data-button-style={theme.buttonStyle || "filled"}
      data-theme-type={theme.themeType || "solid"}
      data-sidebar-surface={sidebarIsLight ? "light" : "dark"}
      style={buildThemeScopeStyle(theme)}
      className="min-h-screen"
    >
      {children}
    </div>
  );
}
