"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, CalendarPlus, ShieldCheck } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide on admin routes (which have their own dedicated admin sidebar)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass,
      isActive: pathname.startsWith("/discover"),
    },
    {
      label: "Host Event",
      href: "/admin/events/new",
      icon: CalendarPlus,
      isActive: pathname === "/admin/events/new",
    },
    {
      label: "Admin",
      href: "/admin/dashboard",
      icon: ShieldCheck,
      isActive: pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                active
                  ? "text-[var(--color-primary)] font-bold"
                  : "text-slate-400 hover:text-slate-700 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  active ? "bg-indigo-50 text-[var(--color-primary)]" : "text-slate-400"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
