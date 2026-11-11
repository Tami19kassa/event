"use client";

import { useEffect, useState } from "react";
import { X, Shield, Eye, EyeOff, Trash2, AlertCircle, Save } from "lucide-react";
import {
  ROLE_META,
  formatAdminUserDate,
  type AdminUserItem,
  type UserActivityDetail,
  type UserRole,
} from "@/lib/users-admin-helpers";
import { UserActivityPanel } from "./UserActivityPanel";

interface DrawerProps {
  user: AdminUserItem | null;
  currentAdminId: string;
  busy: boolean;
  onClose: () => void;
  onSave: (id: string, payload: { name: string; role: UserRole; password?: string }) => Promise<string | null>;
  onDelete: (user: AdminUserItem) => Promise<void>;
}

export function UserDetailDrawer({
  user, currentAdminId, busy, onClose, onSave, onDelete,
}: DrawerProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("ATTENDEE");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [detail, setDetail] = useState<UserActivityDetail | null>(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setRole(user.role);
    setPassword("");
    setShowPass(false);
    setConfirmDelete(false);
    setLocalError("");
    setDetail(null);

    fetch(`/api/users/${user.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.id === user.id) setDetail(d); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  if (!user) return null;

  const isSelf = user.id === currentAdminId;
  const hasRecords = user.organizedEventsCount > 0 || user.ordersCount > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (password && password.length < 8) { setLocalError("New password must be at least 8 characters."); return; }
    const err = await onSave(user.id, { name, role, ...(password ? { password } : {}) });
    if (err) { setLocalError(err); return; }
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 w-full max-w-md bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${ROLE_META[user.role].badgeClass}`}>
                {ROLE_META[user.role].label}
              </span>
              <span className="text-[11px] text-slate-400">Joined {formatAdminUserDate(user.createdAt)}</span>
            </div>
            <h2 className="font-display text-lg text-slate-900 truncate mt-1">{user.name || "Unnamed User"}</h2>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close drawer"
            className="p-2 theme-radius-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {localError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Display Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Account holder name"
              className="w-full px-3.5 py-2 border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role &amp; Access</label>
            <div className="grid grid-cols-3 gap-2">
              {(["ADMIN", "ORGANIZER", "ATTENDEE"] as UserRole[]).map((r) => {
                const blockedSelf = isSelf && r !== "ADMIN";
                return (
                  <button
                    key={r} type="button" disabled={blockedSelf} onClick={() => setRole(r)}
                    className={`py-2 px-2 theme-radius-sm text-xs font-bold border transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                      role === r ? "theme-nav-active" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {ROLE_META[r].label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {isSelf ? "Active session account — role stays Admin to prevent lockout." : ROLE_META[role].desc}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Set / Reset Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={user.hasPassword ? "Leave blank to keep existing password" : "Set 8+ character password"}
                className="w-full pl-3.5 pr-10 py-2 border border-slate-200 theme-radius-sm text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                type="button" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="w-full py-2.5 text-xs font-bold theme-btn-primary inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
            <Save className="w-3.5 h-3.5" />
            <span>{busy ? "Saving..." : "Save Account Changes"}</span>
          </button>

          <UserActivityPanel user={user} detail={detail} />
        </form>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          {isSelf || hasRecords ? (
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {isSelf
                  ? "Active admin account cannot be deleted."
                  : "Linked to hosted events or orders — demote to Attendee to revoke access."}
              </span>
            </p>
          ) : !confirmDelete ? (
            <button
              type="button" onClick={() => setConfirmDelete(true)}
              className="w-full py-2 text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 theme-radius-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Account
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button" disabled={busy} onClick={() => onDelete(user)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold theme-radius-sm cursor-pointer disabled:opacity-50"
              >
                Confirm Delete
              </button>
              <button
                type="button" disabled={busy} onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold theme-radius-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
