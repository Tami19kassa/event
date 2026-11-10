"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav, type AdminNavUser } from "./AdminTopNav";

export interface AdminNavBadges {
  orders?: number;
  inquiries?: number;
}

interface ShellProps {
  children: React.ReactNode;
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  user?: AdminNavUser | null;
  navBadges?: AdminNavBadges;
}

export function AdminLayoutShell({
  children,
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
  user,
  navBadges,
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
        navBadges={navBadges}
      />

      <div className="md:pl-64 pl-0 transition-all duration-300 min-h-screen flex flex-col">
        <AdminTopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          siteName={siteName}
          logoUrl={logoUrl}
          user={user}
        />
        <main className="flex-1 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
