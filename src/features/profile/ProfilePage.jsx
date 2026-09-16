import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  Menu,
  RefreshCw,
  User,
  Mail,
  Calendar,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Camera,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import useProfile from "./hooks/useProfile";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=256&q=80",
];

export default function ProfilePage() {
  const outletContext = useOutletContext();
  const {
    profile,
    loading,
    saving,
    error,
    successMessage,
    clearMessages,
    refresh,
    updateProfile,
  } = useProfile();

  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    gender: "prefer_not_to_say",
    avatar: "",
  });

  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // Sync profile data to form once loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        gender: profile.gender || "prefer_not_to_say",
        avatar: profile.avatar || AVATAR_PRESETS[0],
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    clearMessages();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectPreset = (url) => {
    clearMessages();
    setFormData((prev) => ({ ...prev, avatar: url }));
    setAvatarPickerOpen(false);
  };

  const handleReset = () => {
    clearMessages();
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        gender: profile.gender || "prefer_not_to_say",
        avatar: profile.avatar || AVATAR_PRESETS[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (err) {
      // Error handled by hook
    }
  };

  const formattedJoinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently joined";

  const displayName =
    `${formData.fullName} ${formData.lastName}`.trim() ||
    formData.fullName ||
    "User";

  return (
    <div
      className="flex flex-col min-h-full bg-slate-50 dark:bg-[#0D0D12] text-slate-900 dark:text-slate-100 transition-colors"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 shrink-0 bg-white/80 dark:bg-[#12121A]/90 backdrop-blur-md gap-3 border-b border-[#ECEBF5] dark:border-[#1E1B2E] transition-colors sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {outletContext?.onMenuClick && (
            <button
              onClick={outletContext.onMenuClick}
              className="lg:hidden p-2 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] hover:bg-purple-100 dark:hover:bg-[#25223A] transition-colors shrink-0"
              title="Open menu"
            >
              <Menu size={18} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link to="/" className="hover:text-[#6C63FF] transition-colors">
                Dashboard
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Profile
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate mt-0.5">
              Account Profile
            </h1>
          </div>
        </div>

        {/* Right action tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={refresh}
            title="Refresh profile"
            className="p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition-all hover:bg-purple-50 dark:hover:bg-[#1E1B2E] bg-white dark:bg-[#1A1A24] border border-slate-200 dark:border-[#2A2A38] text-slate-600 dark:text-slate-300 hover:text-[#6C63FF] cursor-pointer text-xs font-semibold"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-[#6C63FF]" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto flex flex-col gap-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm animate-fadeIn">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-sm">
            <AlertCircle size={20} className="shrink-0 text-rose-500" />
            <span className="font-medium">{String(error)}</span>
          </div>
        )}

        {/* ── Profile Summary Hero Card ── */}
        <div className="relative rounded-3xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm overflow-hidden transition-all">
          {/* Header Banner */}
          <div className="h-32 sm:h-36 bg-gradient-to-r from-[#6C63FF] via-[#8B7CFF] to-[#A399FF] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
          </div>

          {/* Profile Info Row */}
          <div className="px-6 pb-6 pt-0 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Avatar with click-to-change */}
              <div className="relative group self-start">
                <img
                  src={formData.avatar || AVATAR_PRESETS[0]}
                  alt="Profile Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-[#12121A] shadow-md bg-white dark:bg-[#1A1A24]"
                />
                <button
                  type="button"
                  onClick={() => setAvatarPickerOpen(!avatarPickerOpen)}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white shadow-lg transition-transform active:scale-95 cursor-pointer ring-2 ring-white dark:ring-[#12121A]"
                  title="Change avatar"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Account
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#6C63FF] dark:bg-[#1E1B2E] dark:text-[#A49DFF] border border-purple-200/50 dark:border-[#2A244D]">
                  <ShieldCheck size={13} />
                  Verified User
                </span>
              </div>
            </div>

            {/* Avatar Presets Dropdown */}
            {avatarPickerOpen && (
              <div className="mb-6 p-4 rounded-2xl bg-purple-50/50 dark:bg-[#181628] border border-[#6C63FF]/20 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#6C63FF]" />
                    Choose an Avatar Preset:
                  </span>
                  <button
                    type="button"
                    onClick={() => setAvatarPickerOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative rounded-xl overflow-hidden ring-2 transition-all cursor-pointer ${
                        formData.avatar === preset
                          ? "ring-[#6C63FF] scale-105"
                          : "ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600"
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        className="w-12 h-12 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name & Quick Metadata */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {displayName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#6C63FF]" />
                  {formData.email || "No email provided"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#6C63FF]" />
                  Member since {formattedJoinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Edit Personal Information Form ── */}
        <div className="rounded-3xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm p-6 sm:p-8 transition-all">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1E1B2E] mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-[#6C63FF]" />
                Personal Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your name, email, and personal account details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name / First Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  First / Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Rivera"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium cursor-pointer"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Custom Avatar URL input (optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Avatar Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setAvatarPickerOpen(!avatarPickerOpen)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-xs font-bold text-[#6C63FF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Pick Preset
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#1E1B2E]">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A38] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-sm font-bold shadow-md shadow-[#6C63FF]/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
