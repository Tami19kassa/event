"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, Eye, EyeOff, Wand2, AlertCircle } from "lucide-react";
import {
  ROLE_META,
  generateStrongPassword,
  type AdminUserItem,
  type UserRole,
} from "@/lib/users-admin-helpers";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (user: AdminUserItem, message: string) => void;
}

export function UserFormModal({ isOpen, onClose, onCreated }: ModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("ORGANIZER");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setEmail("");
    setRole("ORGANIZER");
    setPassword("");
    setShowPass(false);
    setError("");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const staffRole = role === "ADMIN" || role === "ORGANIZER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      onCreated(data as AdminUserItem, `Added ${data.email} (${ROLE_META[role].label}).`);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creating account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-white theme-radius-card border border-slate-200 w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 theme-radius-sm theme-icon-soft border flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg text-slate-900">Create Team or User Account</h2>
              <p className="text-[11px] text-slate-500">Grant dashboard staff credentials or register an account.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-2 theme-radius-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name or Organization</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Selamawit Tadesse or Horizon Expos"
              className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@utopia-expos.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Permission Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["ORGANIZER", "ADMIN", "ATTENDEE"] as UserRole[]).map((r) => (
                <button
                  key={r} type="button" onClick={() => setRole(r)}
                  className={`py-2 px-3 theme-radius-sm text-xs font-bold border cursor-pointer transition ${
                    role === r ? "theme-nav-active" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {ROLE_META[r].label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">{ROLE_META[role].desc}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password {staffRole ? "*" : "(Optional)"}
              </label>
              <button
                type="button" onClick={() => { setPassword(generateStrongPassword()); setShowPass(true); }}
                className="text-[11px] font-bold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" /> Generate Strong
              </button>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} required={staffRole} minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={staffRole ? "Minimum 8 characters" : "Leave blank for guest buyer"}
                className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 theme-radius-sm text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                type="button" onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 theme-radius-sm border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold theme-btn-primary cursor-pointer disabled:opacity-50">
              {saving ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
