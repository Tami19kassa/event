"use client";

import { useState, useEffect } from "react";
import { Mic2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { makeClientKey, type SpeakerInput } from "@/lib/event-form-types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  speaker?: SpeakerInput | null;
  onSave: (speaker: SpeakerInput) => void;
}

export function AdminSpeakerModal({ isOpen, onClose, speaker, onSave }: Props) {
  const isEditing = Boolean(speaker);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (speaker) {
        setName(speaker.name || "");
        setTitle(speaker.title || "");
        setCompany(speaker.company || "");
        setBio(speaker.bio || "");
        setImageUrl(speaker.imageUrl || "");
      } else {
        setName("");
        setTitle("");
        setCompany("");
        setBio("");
        setImageUrl("");
      }
      setError("");
    }
  }, [isOpen, speaker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide the speaker's full name.");
      return;
    }

    onSave({
      ...(speaker || {}),
      clientKey: speaker?.clientKey || makeClientKey("sp"),
      name: name.trim(),
      title: title.trim(),
      company: company.trim(),
      bio: bio.trim(),
      imageUrl: imageUrl.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Speaker" : "Add Speaker"}
      subtitle="Feature keynote presenters, moderators, and panel experts"
      icon={<Mic2 className="w-4 h-4" />}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 theme-radius-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-bold theme-btn-primary theme-radius-sm shadow-xs transition cursor-pointer"
          >
            {isEditing ? "Save Speaker" : "Add Speaker"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 theme-radius-sm text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
              placeholder="e.g. Dr. Dawit Tadesse"
              className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Head of Engineering"
              className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. EthioCloud"
              className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Short Biography
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Background highlights, topic preview, industry accolades..."
            className="w-full px-3 py-2 bg-white border border-slate-200 theme-radius-sm text-sm focus:border-slate-400 focus:outline-hidden resize-none"
          />
        </div>

        <div>
          <ImageUpload
            label="Portrait Photo (Optional)"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="https://..."
            previewVariant="square"
          />
        </div>
      </form>
    </Modal>
  );
}
