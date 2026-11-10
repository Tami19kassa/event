"use client";

import Link from "next/link";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface TopNavProps {
  onToggleSidebar: () => void;
  siteName?: string;
  logoUrl?: string | null;
}

export function AdminTopNav({
  onToggleSidebar,
  siteName = "Utopia",
  logoUrl,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden">
          <BrandLogo siteName={siteName} logoUrl={logoUrl} showSubtitle={false} />
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <span>Admin Workspace</span>
          <span>/</span>
          <span className="text-slate-700 font-bold">{siteName} Operations</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-bold theme-badge border px-3 py-1.5 rounded-full hover:brightness-95 transition shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
          <div className="w-7 h-7 rounded-full theme-bg-primary flex items-center justify-center font-bold text-xs shadow-xs">
            A
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-slate-900 leading-tight">Admin</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
