"use client";

import { useState } from "react";
import { Award, Send, Loader2 } from "lucide-react";
import { InquiryModalShell } from "./InquiryModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorInquiryModal({ isOpen, onClose }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState("Strategic / Title Partner");
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
          type: "SPONSOR",
          companyName,
          contactName,
          email,
          phone,
          selection: tier,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit sponsorship application");
      setSubmittedRef(data.inquiry?.id?.slice(-8).toUpperCase() || "RECEIVED");
      setCompanyName("");
      setContactName("");
      setPhone("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Unable to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InquiryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="Commercial Partnership"
      eyebrowClassName="text-amber-600"
      title={submittedRef ? "Sponsorship Application Logged" : "Become an Official Sponsor"}
      icon={<Award className="w-4 h-4" />}
      iconWrapperClassName="bg-amber-50 text-amber-600"
      submittedRef={submittedRef}
      successTitle="Application Received"
      successDescription={
        <>
          Reference <span className="font-mono font-bold text-slate-900">#{submittedRef}</span> has been recorded.
          Our partnerships team will reach out to <span className="font-semibold text-[var(--color-primary)]">{email}</span> with sponsorship tiers and placement options.
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company / Brand Name *</label>
          <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Commercial Bank of Ethiopia" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
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
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sponsorships@company.com" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Desired Sponsorship Level *</label>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
            <option value="Strategic / Title Partner">Strategic / Title Partner</option>
            <option value="Platinum Partner">Platinum Partner</option>
            <option value="Gold Sponsor">Gold Sponsor</option>
            <option value="Official Media Partner">Official Media Partner</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Partnership Goals (Optional)</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Keynote branding, VIP lounge, co-branding goals..." className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
        </div>

        <button type="submit" disabled={submitting} style={{ backgroundColor: "var(--color-primary, #4F46E5)" }} className="w-full py-3.5 mt-2 text-white font-bold rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Sponsorship Inquiry
        </button>
      </form>
    </InquiryModalShell>
  );
}
