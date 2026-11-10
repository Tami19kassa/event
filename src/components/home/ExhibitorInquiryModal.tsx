"use client";

import { useState } from "react";
import { Building2, Send, Loader2 } from "lucide-react";
import { InquiryModalShell } from "./InquiryModalShell";

interface Props {
  expoTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ExhibitorInquiryModal({ expoTitle, isOpen, onClose }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [boothType, setBoothType] = useState("Standard Shell Scheme (9m²)");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    setSubmittedRef("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EXHIBITOR",
          companyName,
          contactName,
          email,
          phone,
          expoTitle: expoTitle || "B2B Trade Expo 2026",
          selection: boothType,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry");
      setSubmittedRef(data.inquiry?.id?.slice(-8).toUpperCase() || "RECEIVED");
      setCompanyName("");
      setContactName("");
      setPhone("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Unable to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InquiryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="B2B Exhibition Space"
      title={submittedRef ? "Inquiry Logged" : "Book an Exhibition Stand"}
      icon={<Building2 className="w-4 h-4" />}
      submittedRef={submittedRef}
      successTitle="Booth Inquiry Received"
      successDescription={
        <>
          Reference <span className="font-mono font-bold text-slate-900">#{submittedRef}</span> has been registered.
          Our exhibition team will contact <span className="font-semibold text-[var(--color-primary)]">{email}</span> with floor plans and booth availability.
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          Selected Expo: <span className="font-bold text-slate-900">{expoTitle || "B2B Trade Expo 2026"}</span>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company / Organization *</label>
          <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Eurasia Manufacturing PLC" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Person *</label>
            <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full Name" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone *</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09... / +251..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Corporate Work Email *</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="director@company.com" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Desired Booth Space *</label>
          <select value={boothType} onChange={(e) => setBoothType(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="Standard Shell Scheme (9m²)">Standard Shell Scheme (9m²)</option>
            <option value="Corner Shell Scheme (18m²)">Corner Shell Scheme (18m²)</option>
            <option value="Bare Space Floor (36m²+)">Bare Space Floor (36m²+)</option>
            <option value="Sponsor Stand / Custom Pavilion">Sponsor Stand / Custom Pavilion</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Requirements / Notes (Optional)</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Power, corner placement, product category..." className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
        </div>

        <button type="submit" disabled={submitting} style={{ backgroundColor: "var(--color-primary, #4F46E5)" }} className="w-full py-3.5 mt-2 text-white font-bold rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Request Floor Plan & Prospectus
        </button>
      </form>
    </InquiryModalShell>
  );
}
