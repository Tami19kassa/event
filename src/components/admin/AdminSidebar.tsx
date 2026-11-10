"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Users,
  Palette,
  Cookie,
  LogOut,
  ExternalLink,
  CreditCard,
  Layers,
  Building2,
  Mail,
  Clapperboard,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { AdminNavBadges } from "./AdminLayoutShell";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: keyof AdminNavBadges;
}

const operationsNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders & Gate", icon: ShoppingCart, badgeKey: "orders" },
  { href: "/admin/inquiries", label: "B2B Inquiries", icon: Mail, badgeKey: "inquiries" },
];

const catalogNav: NavItem[] = [
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/categories", label: "Event Types", icon: Layers },
  { href: "/admin/media", label: "Media & Stories", icon: Clapperboard },
];

const settingsNav: NavItem[] = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Branding & Theme", icon: Palette, exact: true },
  { href: "/admin/settings/expo", label: "Expo & Hero Slider", icon: Building2, exact: true },
  { href: "/admin/settings/payments", label: "Payment Gateways", icon: CreditCard, exact: true },
  { href: "/admin/settings/cookies", label: "Cookies", icon: Cookie, exact: true },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  navBadges?: AdminNavBadges;
}

export function AdminSidebar({
  isOpen,
  onClose,
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
  navBadges,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isItemActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const renderNavGroup = (items: NavItem[], groupTitle: string) => (
    <div className="space-y-1">
      <div className="px-3 pb-0.5 text-[10px] leading-none font-bold uppercase tracking-widest text-zinc-500">
        {groupTitle}
      </div>
      {items.map((item) => {
        const active = isItemActive(item);
        const badgeCount = item.badgeKey ? navBadges?.[item.badgeKey] || 0 : 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={onClose}
            className={clsx(
              "flex items-center justify-between gap-2 px-3 py-[7px] theme-radius-sm text-[13px] leading-tight font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              active
                ? "theme-nav-active font-semibold"
                : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
            )}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <item.icon
                className={clsx("w-4 h-4 shrink-0", active ? "opacity-95" : "text-zinc-400")}
              />
              <span className="truncate">{item.label}</span>
            </span>
            {badgeCount > 0 && (
              <span
                className={clsx(
                  "px-1.5 py-0.5 text-[10px] font-bold leading-none rounded-full shrink-0",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-zinc-100 border border-white/15"
                )}
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        data-surface="dark"
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none border-r border-white/[0.08]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.08] shrink-0">
          <BrandLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoDarkUrl={logoDarkUrl}
            variant="dark"
            subtitle="Admin Workspace"
          />
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white theme-radius-sm hover:bg-white/10 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="dark-scrollbar flex-1 py-2.5 px-3 overflow-y-auto space-y-3.5">
          {renderNavGroup(operationsNav, "Operations")}
          {renderNavGroup(catalogNav, "Catalog & Media")}
          {renderNavGroup(settingsNav, "Admin & Settings")}
        </nav>

        <div className="p-2 border-t border-white/[0.08] grid grid-cols-2 gap-1.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white theme-radius-sm bg-white/[0.04] hover:bg-white/[0.09] transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-rose-300 theme-radius-sm bg-white/[0.04] hover:bg-rose-950/50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
