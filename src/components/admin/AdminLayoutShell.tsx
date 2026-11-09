"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="md:pl-64 pl-0 transition-all duration-300 min-h-screen flex flex-col">
        <AdminTopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
