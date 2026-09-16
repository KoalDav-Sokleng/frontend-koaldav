import React, { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Edit3,
  ShieldCheck,
  Sparkles,
  Flame,
} from "lucide-react";

export default function ProfileHeaderCard({ profile, onEditClick }) {
  const [imgError, setImgError] = useState(false);

  const name = profile?.name || profile?.username || "Guest User";
  const email = profile?.email || "user@example.com";
  const bio =
    profile?.bio ||
    "Passionate about setting ambitious goals, building lasting habits, and optimizing personal growth.";
  const avatarUrl = profile?.avatar || "https://i.pravatar.cc/150?img=68";
  const focusMinutes = Number(profile?.totalFocusMinutes || 0);
  const focusHours = (focusMinutes / 60).toFixed(1);

  const joinDateFormatted = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member since 2026";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm p-6 sm:p-8 transition-colors">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6C63FF]/15 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Avatar & Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-[#6C63FF] via-indigo-400 to-purple-300 shadow-md">
              {!imgError && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-[22px] bg-slate-100 dark:bg-[#1A1A24]"
                />
              ) : (
                <div className="w-full h-full rounded-[22px] bg-[#6C63FF] text-white flex items-center justify-center text-2xl font-black">
                  {initials || <User size={32} />}
                </div>
              )}
            </div>
            {/* Online status indicator */}
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white dark:border-[#12121A]" />
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] border border-purple-200/50 dark:border-purple-900/40">
                <ShieldCheck size={13} /> Active Pro
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                Joined {joinDateFormatted}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 max-w-2xl leading-relaxed">
              {bio}
            </p>
          </div>
        </div>

        {/* Right: Quick action buttons & Highlights */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0 self-stretch md:self-auto justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-[#1E1B2E]">
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-[#F4F2FF] dark:bg-[#1A1A26] border border-[#ECEBF5] dark:border-[#242430] flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#6C63FF]/15 text-[#6C63FF] flex items-center justify-center">
                <Clock size={15} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Focus Time
                </p>
                <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {focusHours} hrs ({focusMinutes}m)
                </p>
              </div>
            </div>
          </div>

          {onEditClick && (
            <button
              onClick={onEditClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
