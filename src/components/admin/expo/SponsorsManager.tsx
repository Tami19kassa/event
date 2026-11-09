"use client";

import { useState } from "react";
import { Plus, Trash2, Award, Pencil, X, Check } from "lucide-react";
import { SponsorItem } from "@/lib/expo-settings";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  sponsors: SponsorItem[];
  onChange: (sponsors: SponsorItem[]) => void;
}

export function SponsorsManager({ sponsors, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [tier, setTier] = useState<"STRATEGIC" | "PLATINUM" | "GOLD" | "MEDIA">("STRATEGIC");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLogoUrl("");
    setTier("STRATEGIC");
    setWebsiteUrl("");
  };

  const startEdit = (s: SponsorItem) => {
    setEditingId(s.id);
    setName(s.name);
    setLogoUrl(s.logoUrl || "");
    setTier(s.tier);
    setWebsiteUrl(s.websiteUrl || "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = sponsors.map((s) =>
        s.id === editingId
          ? { ...s, name: name.trim(), logoText: name.trim(), logoUrl: logoUrl.trim() || undefined, tier, websiteUrl: websiteUrl.trim() || undefined }
          : s
      );
      onChange(updated);
    } else {
      const newSponsor: SponsorItem = {
        id: `sp-${Date.now()}`,
        name: name.trim(),
        logoText: name.trim(),
        logoUrl: logoUrl.trim() || undefined,
        tier,
        websiteUrl: websiteUrl.trim() || undefined,
      };
      onChange([...sponsors, newSponsor]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(sponsors.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Commercial Sponsors & Strategic Partners</h2>
            <p className="text-xs text-slate-500">Attach company logos (local upload or URL) and configure tiers.</p>
          </div>
        </div>
      </div>

      {/* Sponsor Form (Create & Edit) */}
      <form onSubmit={handleSave} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {editingId ? "✏️ Edit Sponsor Details" : "➕ Add New Sponsor Partner"}
          </span>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company / Sponsor Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ethiopian Airlines"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Sponsorship Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600"
            >
              <option value="STRATEGIC">Strategic / Title Partner</option>
              <option value="PLATINUM">Platinum Partner</option>
              <option value="GOLD">Gold Sponsor</option>
              <option value="MEDIA">Official Media Partner</option>
            </select>
          </div>
        </div>

        <ImageUpload
          label="Sponsor Logo (Local Upload or URL)"
          value={logoUrl}
          onChange={setLogoUrl}
          placeholder="https://... or upload local PNG/SVG"
        />

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editingId ? "Update Sponsor" : "Add Partner with Logo"}
          </button>
        </div>
      </form>

      {/* Sponsors Table / List with Edit and Delete */}
      <div className="space-y-2">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition ${
              editingId === s.id ? "border-indigo-500 bg-indigo-50/30 shadow-xs" : "border-slate-100 hover:border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                s.tier === "STRATEGIC" ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-slate-100 text-slate-700"
              }`}>
                {s.tier}
              </span>
              {s.logoUrl && (
                <img
                  src={s.logoUrl}
                  alt={s.name}
                  className="h-6 max-w-[90px] object-contain border border-slate-100 rounded px-1"
                />
              )}
              <span className="font-bold text-sm text-slate-900">{s.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Edit Sponsor"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Delete Sponsor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
