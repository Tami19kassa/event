"use client";

import { useEffect, useState } from "react";
import { Trash2, Layers, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { CreateCategoryForm } from "@/components/admin/categories/CreateCategoryForm";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setSuccess(`Category "${catName}" deleted.`);
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
            Back-Office Operations
          </span>
          <h1 className="text-3xl font-display text-slate-900">
            Event Types & Categories
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Define official event classifications for your catalog.
          </p>
        </div>
        <button
          onClick={loadCategories}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateCategoryForm
            onCreated={loadCategories}
            onError={setError}
            onSuccess={setSuccess}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white theme-radius-card border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg">Active Event Categories</h2>
              <p className="text-xs text-slate-400">{categories.length} categories configured</p>
            </div>

            {loading && categories.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <Layers className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-base">No categories found</h3>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl theme-badge border flex items-center justify-center text-2xl shadow-2xs">
                        {cat.icon || "📌"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">/{cat.slug}</span>
                          <span>•</span>
                          <span>{cat.count ?? 0} published events</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
