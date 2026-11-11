"use client";

import { useState } from "react";
import { Users, Shield, Calendar, ShoppingBag, Mail, KeyRound, Settings2, Trash2, Copy, Check } from "lucide-react";
import { ROLE_META, formatAdminUserDate, type AdminUserItem } from "@/lib/users-admin-helpers";

interface TableProps {
  users: AdminUserItem[];
  currentAdminId: string;
  busyId: string | null;
  onInspect: (user: AdminUserItem) => void;
  onDelete: (user: AdminUserItem) => void;
}

export function UsersTable({ users, currentAdminId, busyId, onInspect, onDelete }: TableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmail = async (user: AdminUserItem) => {
    try {
      await navigator.clipboard.writeText(user.email);
      setCopiedId(user.id);
      setTimeout(() => setCopiedId((prev) => (prev === user.id ? null : prev)), 1800);
    } catch {}
  };

  if (users.length === 0) {
    return (
      <div className="bg-white theme-radius-card border border-slate-200 p-14 text-center text-slate-400 shadow-2xs">
        <Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
        <p className="font-bold text-slate-700 text-sm">No matching accounts found</p>
        <p className="text-xs mt-1">Try clearing your search query or switching role filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white theme-radius-card border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[11px] uppercase tracking-wider">
              <th className="px-5 py-3.5 font-bold">Account</th>
              <th className="px-5 py-3.5 font-bold">Role &amp; Access</th>
              <th className="px-5 py-3.5 font-bold">Activity</th>
              <th className="px-5 py-3.5 font-bold">Joined</th>
              <th className="px-5 py-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = u.id === currentAdminId;
              const busy = busyId === u.id;
              const confirming = confirmDeleteId === u.id;
              const hasRecords = u.organizedEventsCount > 0 || u.ordersCount > 0;
              const roleMeta = ROLE_META[u.role];
              const initial = (u.name?.trim() || u.email).charAt(0).toUpperCase();
              const tone = u.role === "ADMIN" ? "theme-icon-soft" : u.role === "ORGANIZER" ? "theme-icon-secondary" : "bg-slate-50 border-slate-200 text-slate-600";

              return (
                <tr key={u.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 theme-radius-sm border font-bold flex items-center justify-center text-sm shrink-0 ${tone}`}>
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => onInspect(u)} className="font-bold text-slate-900 hover:text-[var(--color-primary)] truncate cursor-pointer text-left">
                            {u.name || "Unnamed User"}
                          </button>
                          {isSelf && <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full theme-badge-accent border shrink-0">You</span>}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{u.email}</span>
                          <button type="button" onClick={() => copyEmail(u)} title="Copy email address" className="p-0.5 text-slate-400 hover:text-[var(--color-primary)] cursor-pointer shrink-0">
                            {copiedId === u.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full whitespace-nowrap ${roleMeta.badgeClass}`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {roleMeta.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <KeyRound className="w-3 h-3" />
                        {u.hasPassword ? "Password set" : "No password"}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-xs font-medium text-slate-700">
                    <div className="flex flex-wrap items-center gap-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {u.organizedEventsCount} {u.organizedEventsCount === 1 ? "event" : "events"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        {u.ordersCount} {u.ordersCount === 1 ? "order" : "orders"}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatAdminUserDate(u.createdAt)}</td>

                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {!confirming ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button type="button" disabled={busy} onClick={() => onInspect(u)} className="px-2.5 py-1.5 theme-radius-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[var(--color-primary)] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50">
                          <Settings2 className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                        {!isSelf && !hasRecords && (
                          <button type="button" disabled={busy} onClick={() => setConfirmDeleteId(u.id)} aria-label={`Delete ${u.email}`} className="p-1.5 theme-radius-sm border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5">
                        <button type="button" disabled={busy} onClick={() => { setConfirmDeleteId(null); onDelete(u); }} className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold theme-radius-sm cursor-pointer disabled:opacity-50">
                          Confirm Delete
                        </button>
                        <button type="button" disabled={busy} onClick={() => setConfirmDeleteId(null)} className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold theme-radius-sm hover:bg-slate-50 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
