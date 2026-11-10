"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, ShieldCheck, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export interface AdminNavUser {
  name: string | null;
  email: string;
  role: string;
}

interface TopNavProps {
  onToggleSidebar: () => void;
  siteName?: string;
  logoUrl?: string | null;
  user?: AdminNavUser | null;
}

function resolveRouteMeta(pathname: string): { section: string; title: string } {
  if (pathname === "/admin/dashboard") return { section: "Overview", title: "Dashboard" };
  if (pathname === "/admin/events/new") return { section: "Events", title: "Create Event" };
  if (pathname.startsWith("/admin/events/") && pathname.endsWith("/edit")) {
    return { section: "Events", title: "Edit Event" };
  }
  if (pathname.startsWith("/admin/events")) return { section: "Operations", title: "Events" };
  if (pathname.startsWith("/admin/categories")) return { section: "Operations", title: "Event Types" };
  if (pathname.startsWith("/admin/orders")) return { section: "Operations", title: "Orders & Gate" };
  if (pathname.startsWith("/admin/media")) return { section: "Operations", title: "Media & Stories" };
  if (pathname.startsWith("/admin/inquiries")) return { section: "Operations", title: "B2B Inquiries" };
  if (pathname.startsWith("/admin/users")) return { section: "Operations", title: "Users" };
  if (pathname === "/admin/settings/expo") return { section: "Settings", title: "Expo & Hero Slider" };
  if (pathname === "/admin/settings/payments") return { section: "Settings", title: "Payment Gateways" };
  if (pathname === "/admin/settings/cookies") return { section: "Settings", title: "Cookies" };
  if (pathname.startsWith("/admin/settings")) return { section: "Settings", title: "Branding & Theme" };
  return { section: "Workspace", title: "Operations" };
}

function getUserInitials(user?: AdminNavUser | null): string {
  const source = user?.name?.trim() || user?.email?.split("@")[0] || "Admin";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function getDisplayName(user?: AdminNavUser | null): string {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email) return user.email.split("@")[0];
  return "Administrator";
}

export function AdminTopNav({
  onToggleSidebar,
  siteName = "Utopia",
  logoUrl,
  user,
}: TopNavProps) {
  const pathname = usePathname();
  const routeMeta = resolveRouteMeta(pathname);
  const displayName = getDisplayName(user);
  const initials = getUserInitials(user);
  const roleLabel = user?.role === "ORGANIZER" ? "Organizer" : "Admin";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary), var(--color-secondary) 55%, var(--color-accent))",
        }}
        aria-hidden="true"
      />
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 theme-radius-sm transition cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="md:hidden">
            <BrandLogo siteName={siteName} logoUrl={logoUrl} showSubtitle={false} />
          </div>

          <nav
            aria-label="Admin breadcrumb"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold min-w-0"
          >
            <span className="text-slate-400 truncate">{siteName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span style={{ color: "var(--color-secondary-ink, #64748B)" }}>{routeMeta.section}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate">{routeMeta.title}</span>
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 px-3 py-1.5 theme-radius-sm hover:border-[var(--color-secondary)]/50 hover:text-[var(--color-secondary-ink,var(--color-secondary))] transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Site</span>
          </Link>

          <div
            title={user?.email || displayName}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 text-xs"
          >
            <div className="relative w-8 h-8 theme-radius-sm theme-icon-soft border flex items-center justify-center font-bold text-[11px] tracking-wide shrink-0">
              {initials}
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 shrink-0 text-[var(--color-secondary-ink,var(--color-secondary))]" /> {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
