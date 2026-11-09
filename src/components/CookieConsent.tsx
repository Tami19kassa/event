"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (type: "all" | "essential") => {
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({
        essential: true,
        analytics: type === "all",
        marketing: type === "all",
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">
              We value your privacy
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking
              &quot;Accept All&quot;, you consent to our use of cookies.{" "}
              <a href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => accept("all")}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Accept All
              </button>
              <button
                onClick={() => accept("essential")}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
