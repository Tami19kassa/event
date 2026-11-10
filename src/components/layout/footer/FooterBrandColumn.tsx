import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  defaultThemeSettings,
  sanitizePublicHttpUrl,
  type ThemeSettings,
} from "@/lib/theme-types";

type Props = {
  theme: ThemeSettings;
};

export function FooterBrandColumn({ theme }: Props) {
  const tagline = theme.footerTagline?.trim() || defaultThemeSettings.footerTagline;
  const telegram = sanitizePublicHttpUrl(theme.socialTelegram);
  const instagram = sanitizePublicHttpUrl(theme.socialInstagram);
  const linkedin = sanitizePublicHttpUrl(theme.socialLinkedIn);
  const xUrl = sanitizePublicHttpUrl(theme.socialX);

  const socials = [
    { label: "Telegram", href: telegram, kind: "telegram" as const },
    { label: "Instagram", href: instagram, kind: "instagram" as const },
    { label: "LinkedIn", href: linkedin, kind: "linkedin" as const },
    { label: "X", href: xUrl, kind: "x" as const },
  ].filter((s) => Boolean(s.href));

  return (
    <div className="lg:col-span-4 space-y-4">
      <BrandLogo
        siteName={theme.siteName}
        logoUrl={theme.logoUrl}
        logoDarkUrl={theme.logoDarkUrl}
        variant="dark"
      />

      <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-sm">
        {tagline}
      </p>

      <div className="space-y-2 text-xs text-slate-300 pt-1">
        {theme.contactCity && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-secondary-on-dark)" }} />
            <span>{theme.contactCity}</span>
          </div>
        )}
        {theme.supportEmail && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-primary-on-dark)" }} />
            <a href={`mailto:${theme.supportEmail}`} className="footer-link truncate">
              {theme.supportEmail}
            </a>
          </div>
        )}
        {theme.supportPhone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-primary-on-dark)" }} />
            <a href={`tel:${theme.supportPhone}`} className="footer-link">
              {theme.supportPhone}
            </a>
          </div>
        )}
      </div>

      {socials.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Social Media">
          {socials.map((s) => (
            <a
              key={s.kind}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="footer-social-btn w-9 h-9 border border-slate-800 bg-slate-900/80 text-slate-300 flex items-center justify-center"
            >
              <SocialIcon kind={s.kind} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialIcon({ kind }: { kind: "telegram" | "instagram" | "linkedin" | "x" }) {
  if (kind === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
      <path d="m4 20 6.768-6.768m2.46-2.46L20 4" />
    </svg>
  );
}
