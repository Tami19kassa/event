"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

interface ShellProps {
  children: React.ReactNode;
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
}

export function AdminLayoutShell({
  children,
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
}: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        siteName={siteName}
        logoUrl={logoUrl}
        logoDarkUrl={logoDarkUrl}
      />

      <div className="md:pl-64 pl-0 transition-all duration-300 min-h-screen flex flex-col">
        <AdminTopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          siteName={siteName}
          logoUrl={logoUrl}
        />
        <main className="flex-1 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
