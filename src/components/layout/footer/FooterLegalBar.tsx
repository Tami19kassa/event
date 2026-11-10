"use client";

import Link from "next/link";

type Props = {
  siteName: string;
  privacyPolicyUrl?: string;
  cookiesEnabled?: boolean;
};

function resolvePrivacyHref(raw?: string): string {
  const val = (raw || "").trim();
  if (val.startsWith("/")) return val;
  if (/^https?:\/\//i.test(val)) return val;
  return "/privacy";
}

export function FooterLegalBar({
  siteName,
  privacyPolicyUrl,
  cookiesEnabled = true,
}: Props) {
  const safePrivacyHref = resolvePrivacyHref(privacyPolicyUrl);
  const isExternal = /^https?:\/\//i.test(safePrivacyHref);

  return (
    <div className="mt-12 pt-7 pb-24 md:pb-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
      <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/discover" className="footer-link">
          Events Directory
        </Link>
        <span className="text-slate-700" aria-hidden="true">·</span>
        {isExternal ? (
          <a href={safePrivacyHref} target="_blank" rel="noopener noreferrer" className="footer-link">
            Privacy &amp; Cookies
          </a>
        ) : (
          <Link href={safePrivacyHref} className="footer-link">
            Privacy &amp; Cookies
          </Link>
        )}
        {cookiesEnabled && (
          <>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("utopia:open-cookie-consent"))}
              className="footer-link cursor-pointer"
            >
              Cookie Preferences
            </button>
          </>
        )}
        <span className="text-slate-700" aria-hidden="true">·</span>
        <span className="text-slate-400">East Africa Time (UTC+3)</span>
      </div>
    </div>
  );
}
