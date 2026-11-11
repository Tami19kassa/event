import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Users,
  Palette,
  Cookie,
  CreditCard,
  Layers,
  Building2,
  Mail,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import type { AdminNavBadges } from "./AdminLayoutShell";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: keyof AdminNavBadges;
  adminOnly?: boolean;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Operations",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/orders", label: "Orders & Gate", icon: ShoppingCart, badgeKey: "orders" },
      { href: "/admin/inquiries", label: "B2B Inquiries", icon: Mail, badgeKey: "inquiries", adminOnly: true },
    ],
  },
  {
    title: "Catalog & Media",
    items: [
      { href: "/admin/events", label: "Events", icon: Calendar },
      { href: "/admin/categories", label: "Event Types", icon: Layers, adminOnly: true },
      { href: "/admin/media", label: "Media & Stories", icon: Clapperboard, adminOnly: true },
    ],
  },
  {
    title: "Admin & Settings",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
      { href: "/admin/settings", label: "Branding & Theme", icon: Palette, exact: true, adminOnly: true },
      { href: "/admin/settings/expo", label: "Expo & Hero Slider", icon: Building2, exact: true, adminOnly: true },
      { href: "/admin/settings/payments", label: "Payment Gateways", icon: CreditCard, exact: true, adminOnly: true },
      { href: "/admin/settings/cookies", label: "Cookies", icon: Cookie, exact: true, adminOnly: true },
    ],
  },
];
