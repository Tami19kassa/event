"use client";

import { useEffect, ReactNode } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  eyebrowClassName?: string;
  title: string;
  icon: ReactNode;
  iconWrapperClassName?: string;
  submittedRef: string;
  successTitle: string;
  successDescription: ReactNode;
  children: ReactNode;
}

export function InquiryModalShell({
  isOpen,
  onClose,
  eyebrow,
  eyebrowClassName = "text-[var(--color-primary)]",
  title,
  icon,
  iconWrapperClassName = "bg-indigo-50 text-[var(--color-primary)]",
  submittedRef,
  successTitle,
  successDescription,
  children,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overscroll-none"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconWrapperClassName}`}>
              {icon}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest block ${eyebrowClassName}`}>
                {eyebrow}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto overscroll-contain space-y-4">
          {submittedRef ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">{successTitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">{successDescription}</p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition mt-3 cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
