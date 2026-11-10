"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

export function ResetCookiesButton() {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    localStorage.removeItem("cookie_consent");
    setResetDone(true);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      {resetDone ? "Reloading preferences..." : "Update Cookie Preferences"}
    </button>
  );
}
