import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Flame,
  Droplets,
  Dumbbell,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  ArrowRight,
  Plus,
  Snowflake,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";

const HABIT_ICONS = {
  water: Droplets,
  workout: Dumbbell,
  read: BookOpen,
  study: GraduationCap,
  other: MoreHorizontal,
};

function FlowerMiniSVG({ stage = 0, size = 38 }) {
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
      <ellipse cx="60" cy="136" rx="42" ry="9" fill="#B98354" />
      <ellipse cx="60" cy="133" rx="42" ry="8" fill="#8B6239" />
      {s > 0 && (
        <path
          d={`M60 ${stemBaseY} Q ${s % 2 === 0 ? 64 : 56} ${(stemBaseY + stemTopY) / 2} 60 ${stemTopY}`}
          stroke="#4C9A63"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {showSeed && <circle cx="60" cy="130" r="3.5" fill="#7A4A24" />}
      {leaves}
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
      {showBloom && (
        <g>
          {petals}
          <circle cx="60" cy={stemTopY - 16} r="11" fill="#7A4A24" />
        </g>
      )}
    </svg>
  );
}

export default function HabitsWidget({
  habits = [],
  garden = {},
  onToggleHabit,
  loading = false,
}) {
  const [updatingId, setUpdatingId] = useState(null);

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const handleCheck = async (habitId) => {
    if (!onToggleHabit || updatingId) return;
    setUpdatingId(habitId);
    try {
      const res = await onToggleHabit(habitId);
      if (res?.habit?.completed) {
        try {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.75 },
            colors: ["#6C63FF", "#34D399", "#E7E2FF"],
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to toggle habit from dashboard", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Daily Habits
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300">
                {completedCount}/{habits.length} Done
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Check off your routines to keep your streak alive
            </p>
          </div>

          <Link
            to="/habit"
            className="p-1.5 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] hover:bg-purple-100 dark:hover:bg-[#25223A] transition-colors"
            title="Open Habit Page"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>

        {/* Garden / Streak Banner */}
        <div className="mb-4 rounded-xl p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#24211D] dark:to-[#221B24] border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
              <FlowerMiniSVG stage={garden.growthStage ?? 0} size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200 truncate">
                Sunflower Garden
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                <span className="flex items-center gap-0.5 font-semibold">
                  <Flame className="w-3 h-3 text-orange-500" />{" "}
                  {garden.streak || 0}d streak
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Trophy className="w-3 h-3 text-[#6C63FF]" /> Best:{" "}
                  {garden.bestStreak || 0}d
                </span>
              </div>
            </div>
          </div>

          {garden.freezes > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shrink-0">
              <Snowflake className="w-3 h-3 text-sky-500" /> {garden.freezes}{" "}
              freeze
            </div>
          )}
        </div>

        {/* Daily progress bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Today's Progress</span>
            <span className="font-bold text-[#6C63FF] dark:text-[#A49DFF]">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#242430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-indigo-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Habit items list */}
        <div className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              Loading habits...
            </div>
          ) : habits.length === 0 ? (
            <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No habits created yet. Start one to build your daily momentum!
            </div>
          ) : (
            habits.slice(0, 5).map((habit) => {
              const Icon = HABIT_ICONS[habit.type] || MoreHorizontal;
              const isChecked = habit.completed;

              return (
                <div
                  key={habit.id}
                  onClick={() => handleCheck(habit.id)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-purple-50/50 dark:bg-[#1D1B2B]/60 border-purple-200/60 dark:border-purple-900/40"
                      : "bg-slate-50/50 dark:bg-[#1A1A24]/60 border-slate-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-[#1E1E2A]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isChecked
                          ? "bg-[#6C63FF] text-white"
                          : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isChecked
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {habit.title}
                      </p>
                      {habit.target && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {habit.target}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-orange-500 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {habit.streak || 0}d
                    </span>

                    <button
                      type="button"
                      disabled={updatingId === habit.id}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#6C63FF] text-white"
                          : "bg-white dark:bg-[#242430] border border-slate-300 dark:border-slate-600 text-transparent hover:border-[#6C63FF]"
                      }`}
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Click any habit to check off
        </span>
        <Link
          to="/habit"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          Open Habit Hub <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
