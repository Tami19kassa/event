"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ExternalLink, X } from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { AdminNavBadges } from "./AdminLayoutShell";
import { ADMIN_NAV_GROUPS, type AdminNavItem } from "./admin-nav-items";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  navBadges?: AdminNavBadges;
  userRole?: string;
}

export function AdminSidebar({
  isOpen,
  onClose,
  siteName = "Utopia",
  logoUrl,
  logoDarkUrl,
  navBadges,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = userRole === "ADMIN";
  const visibleGroups = ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || isAdmin),
  })).filter((group) => group.items.length > 0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isItemActive = (item: AdminNavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

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
        style={{
          backgroundColor: "var(--admin-sidebar-bg, #09090B)",
          color: "var(--admin-sidebar-fg, #F8FAFC)",
          borderRight: "1px solid var(--admin-sidebar-border, rgba(255,255,255,0.1))",
        }}
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          style={{ borderBottom: "1px solid var(--admin-sidebar-border, rgba(255,255,255,0.1))" }}
          className="h-16 flex items-center justify-between px-5 shrink-0"
        >
          <BrandLogo
            siteName={siteName}
            logoUrl={logoUrl}
            logoDarkUrl={logoDarkUrl}
            variant="sidebar"
            subtitle={isAdmin ? "Admin Workspace" : "Organizer Portal"}
          />
          <button
            onClick={onClose}
            style={{ color: "var(--admin-sidebar-muted)" }}
            className="md:hidden p-1.5 theme-radius-sm hover:opacity-80 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="sidebar-scrollbar flex-1 py-5 px-3.5 overflow-y-auto space-y-6">
          {visibleGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div
                style={{ color: "var(--admin-sidebar-group, rgba(241,245,249,0.48))" }}
                className="px-3 pb-1 text-[10px] leading-none font-bold uppercase tracking-widest"
              >
                {group.title}
              </div>

              {group.items.map((item) => {
                const active = isItemActive(item);
                const badgeCount = item.badgeKey ? navBadges?.[item.badgeKey] || 0 : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center justify-between gap-2.5 px-3 py-2.5 theme-radius-sm text-[13px] leading-snug transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-current/35",
                      active ? "admin-sidebar-link-active font-semibold" : "admin-sidebar-link-idle font-medium"
                    )}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <item.icon className={clsx("w-4 h-4 shrink-0", active ? "opacity-100" : "opacity-80")} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {badgeCount > 0 && (
                      <span
                        style={{
                          backgroundColor: "var(--admin-sidebar-badge-bg, var(--color-accent))",
                          color: "var(--admin-sidebar-badge-fg, #0F172A)",
                        }}
                        className="px-1.5 py-0.5 text-[10px] font-bold leading-none rounded-full shrink-0"
                      >
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          style={{ borderTop: "1px solid var(--admin-sidebar-border, rgba(255,255,255,0.1))" }}
          className="p-2.5 grid grid-cols-2 gap-2 shrink-0"
        >
          <Link
            href="/"
            target="_blank"
            style={{
              backgroundColor: "var(--admin-sidebar-surface-btn, rgba(255,255,255,0.06))",
              color: "var(--admin-sidebar-fg, #F8FAFC)",
            }}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold theme-radius-sm hover:opacity-85 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Site
          </Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--admin-sidebar-surface-btn, rgba(255,255,255,0.06))",
              color: "var(--admin-sidebar-muted, rgba(241,245,249,0.72))",
            }}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold theme-radius-sm hover:opacity-85 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
