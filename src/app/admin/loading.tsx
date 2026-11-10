import { RefreshCw } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="p-10 min-h-[55vh] flex flex-col items-center justify-center gap-3 text-slate-400">
      <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      <span className="text-sm font-medium">Loading workspace...</span>
    </div>
  );
}
