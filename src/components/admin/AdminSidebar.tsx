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
  ChevronLeft,
  CreditCard,
  Layers,
  Building2,
  Mail,
  Clapperboard,
  X,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

const mainNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/categories", label: "Event Types", icon: Layers },
  { href: "/admin/orders", label: "Orders & Gate", icon: ShoppingCart },
  { href: "/admin/media", label: "Media & Stories", icon: Clapperboard },
  { href: "/admin/inquiries", label: "B2B Inquiries", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
];

const settingsNavItems: NavItem[] = [
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
}

export function AdminSidebar({
  isOpen,
  onClose,
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const renderNavGroup = (items: NavItem[], groupTitle?: string) => (
    <div className="space-y-0.5">
      {groupTitle && (
        <div className="px-3 pt-2.5 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
          {groupTitle}
        </div>
      )}
      {items.map((item) => {
        const active = isItemActive(item);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={onClose}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 theme-radius-sm text-[13px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              active
                ? "theme-nav-active"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            )}
          >
            <item.icon
              className={clsx("w-4 h-4 shrink-0", active ? "opacity-95" : "text-slate-400")}
            />
            <span className="truncate">{item.label}</span>
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
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none border-r border-slate-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <BrandLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoDarkUrl={logoDarkUrl}
            variant="dark"
            subtitle="Admin Workspace"
          />
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="dark-scrollbar flex-1 py-2.5 px-3 overflow-y-auto space-y-2">
          {renderNavGroup(mainNavItems)}
          {renderNavGroup(settingsNavItems, "System & Settings")}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <ChevronLeft className="w-4 h-4" />
            View Public Site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
