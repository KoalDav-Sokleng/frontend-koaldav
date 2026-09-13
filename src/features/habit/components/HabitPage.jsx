// src/features/habit/HabitPage.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import confetti from "canvas-confetti";
import { useHabits, todayStr } from "../hooks/useHabits";
import {
  Plus,
  Check,
  Flame,
  Droplets,
  Dumbbell,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  X,
  Pencil,
  Trash2,
  Trophy,
  Sparkles,
  Snowflake,
  Info,
  Menu,
} from "lucide-react";

const HABIT_TYPES = [
  { id: "water", label: "Water", icon: Droplets, fg: "#6C63FF", bg: "#E7E2FF" },
  {
    id: "workout",
    label: "Workout",
    icon: Dumbbell,
    fg: "#EA580C",
    bg: "#FFEDD5",
  },
  { id: "read", label: "Read", icon: BookOpen, fg: "#0D9488", bg: "#CCFBF1" },
  {
    id: "study",
    label: "Study",
    icon: GraduationCap,
    fg: "#D97706",
    bg: "#FEF3C7",
  },
  {
    id: "other",
    label: "Other",
    icon: MoreHorizontal,
    fg: "#64748B",
    bg: "#F1F5F9",
  },
];

/* =========================================================================
   GARDEN / STREAK / FREEZE SYSTEM
   -------------------------------------------------------------------------
   - "garden.streak"      : consecutive CALENDAR DAYS all habits in the list
                             were completed (global, list-wide streak).
   - "garden.bestStreak"  : highest streak ever reached (never decreases).
   - "garden.growthStage" : 0-7, drives the sunflower visual. +1 on a
                             completed day (capped at 7), -1 on a missed,
                             unprotected day. This is intentionally more
                             forgiving than the raw streak number.
   - "garden.freezes"     : banked freeze tokens the user can spend.
   - "garden.freezeUsedDates" / "garden.lastPerfectDate": date bookkeeping
                             used to figure out, once per day, whether
                             yesterday was covered (completed or frozen).
   All date logic is gated by calendar date (YYYY-MM-DD), so re-toggling
   checkboxes back and forth on the same day can never inflate anything —
   only the FIRST time a day reaches 100%, or the first freeze click that
   day, has any effect.
   ========================================================================= */

const GROWTH_STAGES = [
  {
    label: "Bare Soil",
    desc: "Complete every habit today to plant your first seed.",
  },
  {
    label: "Seed Planted",
    desc: "Your seed is in the ground. Come back tomorrow.",
  },
  {
    label: "Sprout",
    desc: "A little green sprout just broke through the soil.",
  },
  { label: "Growing Stem", desc: "The stem is getting taller and stronger." },
  { label: "Leafy Stem", desc: "Leaves are filling out nicely." },
  { label: "Bud Forming", desc: "A bud has formed at the top of the stem." },
  {
    label: "Bud Opening",
    desc: "Almost there — the bloom is starting to open.",
  },
  {
    label: "Full Bloom 🌻",
    desc: "Your sunflower is in full bloom. Keep showing up to keep it blooming.",
  },
];

/* ---------------- Sunflower growth SVG (stages 0-7) ---------------- */
function FlowerSVG({ stage, size = 96 }) {
  const s = Math.max(0, Math.min(7, stage));
  const stemTopY = [128, 122, 104, 88, 72, 58, 46, 38][s];
  const stemBaseY = 132;
  const leafCount = [0, 0, 1, 2, 3, 3, 4, 4][s];
  const showSeed = s === 1;
  const showBud = s === 5 || s === 6;
  const showBloom = s === 7;
  const budScale = s === 5 ? 0.6 : 1;

  const leaves = [];
  for (let i = 0; i < leafCount; i++) {
    const t = (i + 1) / (leafCount + 1);
    const y = stemBaseY - (stemBaseY - stemTopY) * t;
    const dir = i % 2 === 0 ? 1 : -1;
    leaves.push(
      <ellipse
        key={i}
        cx={60 + dir * 11}
        cy={y}
        rx="10"
        ry="5.5"
        fill="#4C9A63"
        transform={`rotate(${dir * -30} ${60 + dir * 11} ${y})`}
      />,
    );
  }

  const petals = [];
  if (showBloom) {
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i;
      petals.push(
        <ellipse
          key={i}
          cx="60"
          cy={stemTopY - 16}
          rx="6.5"
          ry="14"
          fill="#FBBF24"
          transform={`rotate(${angle} 60 ${stemTopY - 16}) translate(0 -14)`}
        />,
      );
    }
  }

  return (
    <svg
      viewBox="0 0 120 150"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* soil */}
      <ellipse cx="60" cy="136" rx="42" ry="9" fill="#B98354" />
      <ellipse cx="60" cy="133" rx="42" ry="8" fill="#8B6239" />

      {/* stem */}
      {s > 0 && (
        <path
          d={`M60 ${stemBaseY} Q ${s % 2 === 0 ? 64 : 56} ${(stemBaseY + stemTopY) / 2} 60 ${stemTopY}`}
          stroke="#4C9A63"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* seed marker */}
      {showSeed && <circle cx="60" cy="130" r="3.5" fill="#7A4A24" />}

      {/* leaves */}
      {leaves}

      {/* bud */}
      {showBud && (
        <g transform={`translate(60 ${stemTopY}) scale(${budScale})`}>
          <ellipse
            cx="0"
            cy="-6"
            rx="8"
            ry="11"
            fill={s === 6 ? "#F2C94C" : "#7CB342"}
          />
          <ellipse
            cx="0"
            cy="-6"
            rx="4.5"
            ry="9"
            fill={s === 6 ? "#FBBF24" : "#66A650"}
          />
        </g>
      )}

      {/* full bloom */}
      {showBloom && (
        <g>
          {petals}
          <circle cx="60" cy={stemTopY - 16} r="11" fill="#7A4A24" />
          <circle
            cx="60"
            cy={stemTopY - 16}
            r="11"
            fill="url(#seedPattern)"
            opacity="0.25"
          />
        </g>
      )}
    </svg>
  );
}

/* ---------------- Flower growth detail modal ---------------- */
function FlowerGrowthModal({ garden, onClose }) {
  const stage = Math.max(0, Math.min(7, garden.growthStage));
  const info = GROWTH_STAGES[stage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#171720] p-6 text-center shadow-2xl border border-amber-100 dark:border-amber-900/60 overflow-hidden">
        <div className="absolute -top-14 -right-14 w-36 h-36 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-36 h-36 bg-[#E7E2FF]/70 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <p className="relative text-xs font-semibold text-slate-400 tracking-wide">
          Your Habit Garden
        </p>

        <div className="relative mx-auto my-3 flex items-center justify-center w-48 h-56 rounded-3xl bg-gradient-to-b from-sky-50 to-amber-50 border border-amber-100">
          <FlowerSVG stage={stage} size={150} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {info.label}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed px-2">
          {info.desc}
        </p>

        {/* stage stepper */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {GROWTH_STAGES.map((g, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= stage
                  ? "w-5 bg-amber-400"
                  : "w-3 bg-slate-200 dark:bg-slate-700"
              }`}
              title={g.label}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-medium">Streak</div>
            <div className="text-base font-bold text-orange-500">
              {garden.streak}d
            </div>
          </div>
          <div className="text-center border-l border-r border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-medium">Best</div>
            <div className="text-base font-bold text-[#6C63FF]">
              {garden.bestStreak}d
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-medium">
              Freezes
            </div>
            <div className="text-base font-bold text-sky-500">
              {garden.freezes}
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-left text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          <Info size={13} className="shrink-0 mt-0.5" />
          Missing a single day only wilts your flower one stage back — it
          doesn't reset to soil. Use a freeze on a day you know you'll miss to
          protect today's growth entirely.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md shadow-[#6C63FF]/25 active:scale-95 transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function fireGrandCelebrationConfetti() {
  try {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        "#6C63FF",
        "#5B52E6",
        "#E7E2FF",
        "#38BDF8",
        "#34D399",
        "#FBBF24",
      ],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
        colors: ["#6C63FF", "#E7E2FF", "#34D399", "#FBBF24"],
      });
    }, 200);
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.7 },
        colors: ["#6C63FF", "#E7E2FF", "#38BDF8", "#F43F5E"],
      });
    }, 400);
  } catch {
    // ignore if canvas-confetti is not supported
  }
}

function fireSingleHabitConfetti() {
  try {
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.75 },
      colors: ["#6C63FF", "#34D399", "#E7E2FF"],
    });
  } catch {
    // ignore
  }
}

function ProgressBar({ percent, completed, total }) {
  return (
    <div className="space-y-2 sm:space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-base font-semibold text-slate-800 dark:text-slate-200">
            Today's progress
          </p>
          <span className="text-[11px] sm:text-sm text-slate-400 font-medium">
            ({completed} of {total} complete)
          </span>
        </div>
        <span className="text-base sm:text-lg font-bold text-[#6C63FF] tabular-nums">
          {percent}%
        </span>
      </div>
      <div className="w-full h-3.5 sm:h-4 rounded-full overflow-hidden bg-[#E7E2FF] dark:bg-[#2b2742]">
        <div
          className="h-full rounded-full bg-[#6C63FF] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------- 100% Celebration Modal ---------------- */
function HabitCelebrationModal({ onClose, totalHabits, habitTitle, streak }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#171720] p-7 text-center shadow-2xl border border-purple-100 dark:border-purple-900/60 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#E7E2FF]/80 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#6C63FF]/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7E2FF] text-[#6C63FF] shadow-inner ring-8 ring-[#F4F2FF]">
          <Trophy size={40} className="animate-bounce" />
          <Sparkles
            size={20}
            className="absolute -top-1 -right-1 text-amber-500"
          />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7E2FF] text-[#6C63FF] mb-2">
          <Sparkles size={13} /> 100% Completed Today!
        </span>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Awesome Work Today! 🎉
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {habitTitle ? (
            <>
              You just finished{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                &ldquo;{habitTitle}&rdquo;
              </strong>{" "}
              and reached 100% completion for all habits today!
            </>
          ) : (
            <>
              You completed all{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {totalHabits} habits
              </strong>{" "}
              scheduled for today. Your flower grew a little more.
            </>
          )}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-medium">
              Daily Progress
            </div>
            <div className="text-lg font-bold text-[#6C63FF]">100%</div>
          </div>
          <div className="text-center border-l border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">
              Garden Streak
            </div>
            <div className="text-lg font-bold text-emerald-600">{streak}d</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md shadow-[#6C63FF]/25 active:scale-95 transition-all cursor-pointer"
        >
          Keep Up the Streak!
        </button>
      </div>
    </div>
  );
}

export default function HabitPage() {
  const { onOpenMobileMenu } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationHabitTitle, setCelebrationHabitTitle] = useState("");
  const [showFlowerModal, setShowFlowerModal] = useState(false);
  const [actionError, setActionError] = useState("");

  const {
    habits,
    garden,
    loading,
    error,
    reload,
    addHabit,
    editHabit,
    removeHabit,
    toggleHabit: toggleHabitApi,
    useFreezeToday: triggerFreezeToday,
  } = useHabits();

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const today = todayStr();
  const frozenToday = garden.freezeUsedDates?.includes(today);
  const alreadyPerfectToday = garden.lastPerfectDate === today;

  /* All streak / growth-stage / freeze math now lives on the server —
     see habitApi.js and useHabits.js. This component only reacts to
     what the API returns (habit + garden + justReachedPerfectDay). */

  const toggleHabit = async (id) => {
    setActionError("");
    try {
      const res = await toggleHabitApi(id);
      if (res.habit?.completed) {
        if (res.justReachedPerfectDay) {
          fireGrandCelebrationConfetti();
          setCelebrationHabitTitle(res.habit.title);
          setShowCelebrationModal(true);
        } else {
          fireSingleHabitConfetti();
        }
      }
    } catch (err) {
      console.error("Failed to toggle habit", err);
      setActionError("Couldn't update that habit. Please try again.");
    }
  };

  const useFreezeToday = async () => {
    setActionError("");
    try {
      await triggerFreezeToday();
    } catch (err) {
      console.error("Failed to use freeze", err);
      setActionError("Couldn't use a freeze right now. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setActionError("");
    try {
      await removeHabit(deletingId);
    } catch (err) {
      console.error("Failed to delete habit", err);
      setActionError("Couldn't delete that habit. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    setActionError("");
    try {
      if (editingHabit) {
        await editHabit(editingHabit.id, habitData);
      } else {
        await addHabit(habitData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save habit", err);
      setActionError("Couldn't save that habit. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const freezeDisabled =
    (garden.freezes ?? 0) <= 0 || frozenToday || alreadyPerfectToday;
  const freezeLabel = alreadyPerfectToday
    ? "Completed today"
    : frozenToday
      ? "Protected today"
      : "Use freeze";

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white dark:bg-[#101016]">
        <p className="text-sm text-slate-400">Loading your habits…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#101016] px-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          Couldn't load your habits.
        </p>
        <p className="text-xs text-slate-400">
          {String(error.message || error)}
        </p>
        <button
          onClick={reload}
          className="mt-2 text-xs font-semibold px-4 py-2 rounded-xl text-white bg-[#6C63FF] hover:bg-[#5B52E6] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col px-3 sm:px-8 py-2 sm:py-5 space-y-2 sm:space-y-3.5 overflow-visible bg-white dark:bg-[#101016]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
            className="lg:hidden shrink-0 p-1.5 -ml-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#242430]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
            Your Habits
          </h1>
          <p className="hidden sm:block text-xs mt-0.5 text-slate-500 dark:text-slate-400">
            Small repeats, tracked honestly.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>New habit</span>
        </button>
      </div>

      {actionError && (
        <div className="shrink-0 flex items-center justify-between gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError("")}
            className="text-rose-400 hover:text-rose-600 shrink-0"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Garden / streak / freeze widget */}
      <div className="rounded-2xl min-h-[92px] sm:min-h-[108px] px-3 sm:px-5 py-2 sm:py-2.5 lg:py-2 shrink-0 bg-gradient-to-br from-white to-[#FBF9FF] dark:from-[#171720] dark:to-[#1d1b2b] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2.5 sm:gap-4">
        <button
          onClick={() => setShowFlowerModal(true)}
          className="relative shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="See your flower grow"
        >
          <FlowerSVG stage={garden.growthStage} size={20} />
        </button>

        <div className="flex-1 flex items-center justify-between sm:grid sm:grid-cols-3 gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1 sm:block min-w-0">
            <Flame size={13} className="text-orange-500 shrink-0" />
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-500 ml-1">
              Streak
            </span>
            <p className="text-xs sm:text-base font-bold text-slate-800 dark:text-slate-200 sm:mt-0.5 ml-1 sm:ml-0">
              {garden.streak}
              <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                d
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1 sm:block min-w-0">
            <Trophy size={13} className="text-[#6C63FF] shrink-0" />
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-500 ml-1">
              Best
            </span>
            <p className="text-xs sm:text-base font-bold text-slate-800 dark:text-slate-200 sm:mt-0.5 ml-1 sm:ml-0">
              {garden.bestStreak}
              <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                d
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1 sm:block min-w-0">
            <Snowflake size={13} className="text-sky-500 shrink-0" />
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-500 ml-1">
              Freezes
            </span>
            <p className="text-xs sm:text-base font-bold text-slate-800 dark:text-slate-200 sm:mt-0.5 ml-1 sm:ml-0">
              {garden.freezes}
            </p>
          </div>
        </div>

        <button
          onClick={useFreezeToday}
          disabled={freezeDisabled}
          title={freezeLabel}
          className={`shrink-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold w-8 h-8 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl transition-all ${
            freezeDisabled
              ? "bg-slate-50 dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700 cursor-not-allowed"
              : "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 active:scale-95 cursor-pointer"
          }`}
        >
          <Snowflake size={13} />
          <span className="hidden sm:inline">{freezeLabel}</span>
        </button>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl min-h-[92px] sm:min-h-[108px] px-4 sm:px-5 py-4 sm:py-5 shrink-0 bg-white dark:bg-[#171720] border border-slate-100 dark:border-slate-700 shadow-sm">
        <ProgressBar
          percent={progressPercent}
          completed={completedCount}
          total={habits.length}
        />
      </div>

      {/* Habits list */}
      <div className="space-y-1.5 sm:space-y-2.5 pr-0.5 flex-none">
        {habits.length === 0 && (
          <div className="rounded-2xl px-6 py-10 text-center bg-white dark:bg-[#171720] border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              No habits yet
            </p>
            <p className="text-xs mt-1 text-slate-400">
              Add one to start building your streak.
            </p>
          </div>
        )}

        {habits.map((habit) => {
          const typeObj =
            HABIT_TYPES.find((t) => t.id === habit.type) || HABIT_TYPES[4];
          const Icon = typeObj.icon;

          return (
            <div
              key={habit.id}
              className="rounded-2xl min-h-[62px] sm:min-h-[78px] px-3 sm:px-5 py-2 sm:py-3.5 flex flex-row items-center gap-2.5 sm:gap-4 justify-between group transition-all bg-white dark:bg-[#171720] border border-slate-100 dark:border-slate-700 shadow-sm hover:border-[#6C63FF]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: typeObj.bg, color: typeObj.fg }}
                >
                  <Icon size={18} className="sm:hidden" />
                  <Icon size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {habit.title}
                  </h3>
                  <p className="hidden sm:block text-xs text-slate-500 truncate mt-0.5">
                    {habit.target}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {habit.completed ? (
                  <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 shrink-0 bg-[#E7E2FF] text-[#6C63FF]">
                    <Check size={11} strokeWidth={3} className="sm:hidden" />
                    <Check
                      size={13}
                      strokeWidth={3}
                      className="hidden sm:block"
                    />
                    <span className="hidden sm:inline">Done today</span>
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 shrink-0 bg-orange-50 text-orange-600">
                    <Flame size={11} className="sm:hidden" />
                    <Flame size={13} className="hidden sm:block" />
                    {habit.streak}d
                    <span className="hidden sm:inline">&nbsp;streak</span>
                  </span>
                )}

                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit habit"
                    >
                      <Pencil size={14} className="sm:hidden" />
                      <Pencil size={15} className="hidden sm:block" />
                    </button>
                    <button
                      onClick={() => setDeletingId(habit.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 size={14} className="sm:hidden" />
                      <Trash2 size={15} className="hidden sm:block" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      habit.completed
                        ? "bg-[#6C63FF] text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-[#6C63FF] hover:text-[#6C63FF]"
                    }`}
                  >
                    <Check size={15} strokeWidth={2.5} className="sm:hidden" />
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      className="hidden sm:block"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flower growth modal */}
      {showFlowerModal && (
        <FlowerGrowthModal
          garden={garden}
          onClose={() => setShowFlowerModal(false)}
        />
      )}

      {/* 100% Celebration Modal */}
      {showCelebrationModal && (
        <HabitCelebrationModal
          totalHabits={habits.length}
          habitTitle={celebrationHabitTitle}
          streak={garden.streak}
          onClose={() => setShowCelebrationModal(false)}
        />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <HabitModal
          open={isModalOpen}
          initialData={editingHabit}
          onClose={handleCloseModal}
          onSave={handleSaveHabit}
        />
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4 bg-white dark:bg-[#171720] shadow-xl">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-rose-50 text-rose-600">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Delete habit?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HabitModal({ open, initialData, onClose, onSave }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [selectedType, setSelectedType] = useState(
    initialData ? initialData.type : "water",
  );
  const [target, setTarget] = useState(initialData ? initialData.target : "");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      type: selectedType,
      target: target.trim() || "Daily goal",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md my-auto rounded-2xl p-6 space-y-4 bg-white dark:bg-[#171720] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {initialData ? "Edit Habit" : "Create New Habit"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep it small enough to repeat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Habit Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drink water"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Habit Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {HABIT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#6C63FF] bg-[#E7E2FF] text-[#6C63FF] font-semibold"
                        : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-[11px] leading-tight text-center">
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target / Description
            </label>
            <textarea
              rows={2}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 8 glasses of water every day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold bg-[#6C63FF] hover:bg-[#5B52E6] transition-colors shadow-sm cursor-pointer"
            >
              {initialData ? "Save changes" : "Create habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
