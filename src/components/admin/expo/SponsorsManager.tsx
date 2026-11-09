"use client";

import { useState } from "react";
import { Plus, Trash2, Award, Image as ImageIcon } from "lucide-react";
import { SponsorItem } from "@/lib/expo-settings";

interface Props {
  sponsors: SponsorItem[];
  onChange: (sponsors: SponsorItem[]) => void;
}

export function SponsorsManager({ sponsors, onChange }: Props) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [tier, setTier] = useState<"STRATEGIC" | "PLATINUM" | "GOLD" | "MEDIA">("STRATEGIC");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSponsor: SponsorItem = {
      id: `sp-${Date.now()}`,
      name: name.trim(),
      logoText: name.trim(),
      logoUrl: logoUrl.trim() || undefined,
      tier,
      websiteUrl: websiteUrl.trim() || undefined,
    };

    onChange([...sponsors, newSponsor]);
    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
  };

  const handleDelete = (id: string) => {
    onChange(sponsors.filter((s) => s.id !== id));
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Commercial Sponsors & Strategic Partners</h2>
          <p className="text-xs text-slate-500">Attach official company logos and configure tiers on the homepage.</p>
        </div>
      </div>

      {/* Add New Sponsor Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Logo Image URL (PNG/SVG transparent recommended)
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Partner with Logo
          </button>
        </div>
      </form>

      {/* Sponsors Table / List */}
      <div className="space-y-2">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                s.tier === "STRATEGIC" ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-slate-100 text-slate-700"
              }`}>
                {s.tier}
              </span>
              {s.logoUrl ? (
                <img
                  src={s.logoUrl}
                  alt={s.name}
                  className="h-6 max-w-[100px] object-contain border border-slate-100 rounded px-1"
                />
              ) : (
                <span className="p-1 rounded bg-slate-100 text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </span>
              )}
              <span className="font-bold text-sm text-slate-900">{s.name}</span>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(s.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
