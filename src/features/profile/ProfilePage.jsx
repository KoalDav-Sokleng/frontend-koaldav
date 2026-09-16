import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Link as LinkIcon,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import useProfile from "./hooks/useProfile";
import UserAvatar from "../../components/UserAvatar";

export default function ProfilePage() {
  const outletContext = useOutletContext();
  const fileInputRef = useRef(null);

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
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  const [avatarMode, setAvatarMode] = useState("device"); // 'device' | 'url'

  // Sync loaded profile into form state
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        avatar: profile.avatar || "",
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

  // Handle local image file upload from device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    clearMessages();
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: reader.result, // base64 string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    clearMessages();
    setFormData((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    clearMessages();
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        avatar: profile.avatar || "",
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    `${formData.firstName} ${formData.lastName}`.trim() ||
    formData.firstName ||
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
              My Profile
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
          {/* Header Gradient Banner */}
          <div className="h-32 sm:h-36 bg-gradient-to-r from-[#6C63FF] via-[#8B7CFF] to-[#A399FF] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]" />
          </div>

          {/* Profile Info Row */}
          <div className="px-6 pb-6 pt-0 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Avatar with click-to-upload */}
              <div className="relative group self-start">
                <UserAvatar
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  email={formData.email}
                  avatar={formData.avatar}
                  className="w-24 h-24 sm:w-28 sm:h-28 text-3xl sm:text-4xl rounded-2xl ring-4 ring-white dark:ring-[#12121A] shadow-md cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white shadow-lg transition-transform active:scale-95 cursor-pointer ring-2 ring-white dark:ring-[#12121A]"
                  title="Upload avatar photo"
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
                Update your first name, last name, and profile picture.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields (First Name, Last Name) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Emily"
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
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Profile Avatar Options */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAvatarMode("device")}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      avatarMode === "device"
                        ? "bg-purple-100 dark:bg-[#1E1B2E] text-[#6C63FF]"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Upload from device
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMode("url")}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      avatarMode === "url"
                        ? "bg-purple-100 dark:bg-[#1E1B2E] text-[#6C63FF]"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {avatarMode === "device" ? (
                /* Device File Upload */
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#15151E] flex flex-col sm:flex-row items-center gap-4">
                  <UserAvatar
                    firstName={formData.firstName}
                    lastName={formData.lastName}
                    email={formData.email}
                    avatar={formData.avatar}
                    className="w-14 h-14 text-lg rounded-xl"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {formData.avatar
                        ? "Custom photo uploaded"
                        : "Using purple initials avatar"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, GIF or WEBP (Max 5MB)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={13} />
                      Choose File
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove photo & use initials"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* URL Input */
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon size={14} />
                    </div>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-medium"
                    />
                  </div>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A38] text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      Clear
                    </button>
                  )}
                </div>
              )}
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
                    Saving...
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
