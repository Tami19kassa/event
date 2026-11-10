"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface Props {
  categoryId: string;
  categories: Array<{ id: string; name: string }>;
  canCreateCategory: boolean;
  onSelect: (categoryId: string) => void;
  onCategoryAdded: (cat: { id: string; name: string }) => void;
}

export function CategoryQuickSelect({
  categoryId,
  categories,
  canCreateCategory,
  onSelect,
  onCategoryAdded,
}: Props) {
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState("");

  const handleCreateCategory = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    setCatSaving(true);
    setCatError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, icon: "📌" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not create event type");
      onCategoryAdded({ id: json.id, name: json.name });
      onSelect(json.id);
      setNewCatName("");
      setAddingCat(false);
    } catch (err: any) {
      setCatError(err.message || "Failed to add event type");
    } finally {
      setCatSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Event Type / Category
        </label>
        {canCreateCategory && (
          <button
            type="button"
            onClick={() => setAddingCat((v) => !v)}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[var(--color-primary-ink,var(--color-primary))] hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" /> {addingCat ? "Cancel" : "Quick Add"}
          </button>
        )}
      </div>

      {addingCat ? (
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
              placeholder="New type (e.g. Agro Expo)"
              className="flex-1 min-w-0 px-3 py-2 border border-slate-200 theme-radius-sm text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              type="button"
              disabled={catSaving || !newCatName.trim()}
              onClick={handleCreateCategory}
              className="px-3 py-2 text-xs font-bold theme-btn-primary disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1"
            >
              {catSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
            </button>
          </div>
          {catError && <p className="text-[11px] text-rose-600 font-medium">{catError}</p>}
        </div>
      ) : (
        <select
          value={categoryId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 theme-radius-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
