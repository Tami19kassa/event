"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

const SUGGESTED_ICONS = ["🚀", "💻", "🎵", "💼", "🎨", "⚽", "🍷", "🎓", "🍔", "🎪", "🏃‍♂️", "🩺"];

interface FormProps {
  onCreated: () => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export function CreateCategoryForm({ onCreated, onError, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("🚀");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, icon }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      onSuccess(`Category "${name}" created successfully!`);
      setName("");
      setSlug("");
      onCreated();
    } catch (err: any) {
      onError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-8">
      <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" /> Add Event Type
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Type / Category Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
            }}
            placeholder="e.g. Technology & AI"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Icon (Emoji)
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_ICONS.map((ic) => (
              <button
                type="button"
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-slate-100 transition ${
                  icon === ic ? "bg-indigo-100 border border-indigo-400" : "bg-slate-50"
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
        >
          {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Category
        </button>
      </form>
    </div>
  );
}
