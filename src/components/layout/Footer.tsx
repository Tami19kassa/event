import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

type Props = {
  siteName?: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
};

export function Footer({ siteName = "Utopia", logoUrl, logoDarkUrl }: Props) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="mb-4">
              <BrandLogo
                siteName={siteName}
                logoUrl={logoUrl}
                logoDarkUrl={logoDarkUrl}
                variant="dark"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier platform for discovering trade expos, summits, concerts, and cultural experiences across Ethiopia.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Explore Events</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/discover" className="hover:text-white transition">
                  All Events &amp; Expos
                </Link>
              </li>
              <li>
                <Link href="/discover?category=technology" className="hover:text-white transition">
                  Technology &amp; Startups
                </Link>
              </li>
              <li>
                <Link href="/discover?category=music" className="hover:text-white transition">
                  Concerts &amp; Live Shows
                </Link>
              </li>
              <li>
                <Link href="/discover?category=business" className="hover:text-white transition">
                  Business Summits &amp; Expos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Featured Venues</h3>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-300">Millennium Hall</span></li>
              <li><span className="text-slate-300">Ethiopian Skylight Convention Center</span></li>
              <li><span className="text-slate-300">Friendship Park &amp; Meskel Sq</span></li>
              <li><span className="text-slate-300">UNECA Conference Center</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Accepted Payments</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Official instant ticket verification with Telebirr and Commercial Bank of Ethiopia (CBE), plus Pay at Gate.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                Telebirr
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-amber-400">
                CBE Birr / CBE
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
                Pay on Arrival
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/discover" className="hover:text-slate-300 transition">
              Events Directory
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="/privacy" className="hover:text-slate-300 transition">
              Privacy &amp; Cookies
            </Link>
            <span className="text-slate-700">·</span>
            <span>East Africa Time (UTC+3)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
