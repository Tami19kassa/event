"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  downloadUsersCsv,
  filterAdminUsers,
  type AdminUserItem,
  type AdminUsersSummary,
  type UserRole,
  type UserRoleFilter,
} from "@/lib/users-admin-helpers";
import { UserStats } from "./UserStats";
import { UserFilterBar } from "./UserFilterBar";
import { UsersTable } from "./UsersTable";
import { UserFormModal } from "./UserFormModal";
import { UserDetailDrawer } from "./UserDetailDrawer";

interface WorkspaceProps {
  initialUsers: AdminUserItem[];
  initialSummary: AdminUsersSummary;
  currentAdminId: string;
}

export function UsersWorkspace({ initialUsers, initialSummary, currentAdminId }: WorkspaceProps) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [summary, setSummary] = useState<AdminUsersSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<AdminUserItem | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => { setError(""); setToast(msg); setTimeout(() => setToast(""), 3500); };

  const reloadSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to refresh user accounts.");
      const data = await res.json();
      if (Array.isArray(data.users)) setUsers(data.users);
      if (data.summary) setSummary(data.summary);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const upsertLocal = (item: AdminUserItem) => {
    setUsers((prev) => (prev.some((u) => u.id === item.id) ? prev.map((u) => (u.id === item.id ? item : u)) : [item, ...prev]));
    setSelected((prev) => (prev?.id === item.id ? item : prev));
  };

  const handleSaveDetail = async (id: string, payload: { name: string; role: UserRole; password?: string }): Promise<string | null> => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Failed to update account.";
      upsertLocal(data as AdminUserItem);
      showToast(payload.password ? `Updated ${data.email} & reset password.` : `Saved changes for ${data.email}.`);
      await reloadSnapshot();
      return null;
    } catch {
      return "Network error while updating account.";
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (user: AdminUserItem) => {
    setBusyId(user.id);
    setError("");
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Could not delete account.");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selected?.id === user.id) setSelected(null);
      showToast(`Deleted account ${user.email}.`);
      await reloadSnapshot();
    } catch {
      setError("Network error while deleting account.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => filterAdminUsers(users, search, roleFilter), [users, search, roleFilter]);

  return (
    <div className="p-4 sm:p-6 md:px-8 md:py-6 space-y-4 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold theme-radius shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: "var(--color-secondary-ink, var(--color-secondary))" }}>
            Admin &amp; Settings
          </span>
          <h1 className="text-2xl font-display text-slate-900">Users &amp; Access Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create staff logins, assign Organizer or Admin roles, reset passwords, and audit customer accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={() => downloadUsersCsv(filtered)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button type="button" onClick={reloadSnapshot} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} /> Refresh
          </button>
          <button type="button" onClick={() => setCreateOpen(true)} className="px-4 py-2 text-xs sm:text-sm font-bold theme-btn-primary inline-flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <Plus className="w-4 h-4" /> <span>Add Account</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 theme-radius flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError("")} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      <UserStats summary={summary} roleFilter={roleFilter} onSelectRole={setRoleFilter} />

      <UserFilterBar
        summary={summary} search={search} onSearchChange={setSearch}
        roleFilter={roleFilter} onRoleFilterChange={setRoleFilter}
      />

      <UsersTable users={filtered} currentAdminId={currentAdminId} busyId={busyId} onInspect={setSelected} onDelete={handleDelete} />

      <UserFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(user, msg) => { upsertLocal(user); showToast(msg); reloadSnapshot(); }}
      />

      <UserDetailDrawer
        user={selected} currentAdminId={currentAdminId}
        busy={Boolean(selected && busyId === selected.id)}
        onClose={() => setSelected(null)} onSave={handleSaveDetail} onDelete={handleDelete}
      />
    </div>
  );
}
