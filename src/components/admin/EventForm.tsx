"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { BasicInfoSection } from "./events/BasicInfoSection";
import { DateTimeFormatSection } from "./events/DateTimeFormatSection";
import { LocationSection } from "./events/LocationSection";
import { TicketTiersSection } from "./events/TicketTiersSection";

export type TicketTierInput = {
  name: string;
  price: number;
  quantity: number;
  remaining?: number;
  description?: string;
  earlyBird?: boolean;
};

export type EventFormData = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  timezone: string;
  format: "IN_PERSON" | "ONLINE" | "HYBRID";
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "ENDED" | "CANCELLED";
  capacity: number;
  isFeatured: boolean;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
  categoryId: string;
  ticketTiers: TicketTierInput[];
};

const emptyForm: EventFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  startDate: "",
  endDate: "",
  timezone: "Africa/Addis_Ababa",
  format: "IN_PERSON",
  status: "DRAFT",
  capacity: 100,
  isFeatured: false,
  locationName: "",
  locationAddress: "",
  locationCity: "Addis Ababa",
  locationCountry: "Ethiopia",
  categoryId: "",
  ticketTiers: [{ name: "General Admission", price: 0, quantity: 100 }],
};

interface Props {
  initialData?: Partial<EventFormData> & { id?: string };
  mode: "create" | "edit";
  categories?: Array<{ id: string; name: string }>;
}

export function EventForm({ initialData, mode, categories = [] }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState(categories);
  const [form, setForm] = useState<EventFormData>({
    ...emptyForm,
    ...initialData,
    ticketTiers: initialData?.ticketTiers?.length ? initialData.ticketTiers : emptyForm.ticketTiers,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories && categories.length > 0) {
      setActiveCategories(categories);
    } else {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setActiveCategories(data);
        })
        .catch(() => {});
    }
  }, [categories]);

  const update = (key: keyof EventFormData, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && mode === "create") {
        next.slug = value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
      }
      return next;
    });
  };

  const updateTier = (index: number, field: string, value: any) => {
    setForm((prev) => {
      const tiers = [...prev.ticketTiers];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, ticketTiers: tiers };
    });
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { name: "VIP Pass", price: 500, quantity: 50 }],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/events" : `/api/events/${initialData?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/events"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {mode === "create" ? "Publish Event" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <BasicInfoSection form={form} update={update} categories={activeCategories} />
      <DateTimeFormatSection form={form} update={update} />
      <LocationSection form={form} update={update} />
      <TicketTiersSection
        tiers={form.ticketTiers}
        updateTier={updateTier}
        addTier={addTier}
        removeTier={removeTier}
      />
    </form>
  );
}
