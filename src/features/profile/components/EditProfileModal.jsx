import React, { useState, useEffect } from "react";
import { X, Loader2, User, Check } from "lucide-react";
import Swal from "sweetalert2";

const AVATAR_PRESETS = [
  "https://i.pravatar.cc/150?img=68",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=59",
  "https://i.pravatar.cc/150?img=60",
];

export default function EditProfileModal({ open, profile, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || profile.username || "");
      setBio(profile.bio || "");
      setAvatar(profile.avatar || AVATAR_PRESETS[0]);
    }
  }, [profile, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
      });
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-3xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your public display name, avatar, and bio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4 overflow-y-auto"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((preset, i) => {
                const isSelected = avatar === preset;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAvatar(preset)}
                    className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer shrink-0 ${
                      isSelected
                        ? "border-[#6C63FF] shadow-md ring-2 ring-[#6C63FF]/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Preset ${i}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#6C63FF]/40 flex items-center justify-center text-white">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sokleng Koaldav"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              autoFocus
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Personal Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short summary about your personal focus and ambitions..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
