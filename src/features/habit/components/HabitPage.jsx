// src/features/habit/HabitPage.jsx
import React, { useState } from "react";
import confetti from "canvas-confetti";
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
  Clock,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  Trophy,
  Sparkles,
} from "lucide-react";

const HABIT_TYPES = [
  { id: "water", label: "Water", icon: Droplets, fg: "#6C63FF", bg: "#E7E2FF" },
  { id: "workout", label: "Workout", icon: Dumbbell, fg: "#EA580C", bg: "#FFEDD5" },
  { id: "read", label: "Read", icon: BookOpen, fg: "#0D9488", bg: "#CCFBF1" },
  { id: "study", label: "Study", icon: GraduationCap, fg: "#D97706", bg: "#FEF3C7" },
  { id: "other", label: "Other", icon: MoreHorizontal, fg: "#64748B", bg: "#F1F5F9" },
];

const TIME_OPTIONS = [
  { value: "", label: "No reminder" },
  { value: "06:00 AM", label: "06:00 AM" },
  { value: "07:00 AM", label: "07:00 AM" },
  { value: "08:00 AM", label: "08:00 AM" },
  { value: "09:00 AM", label: "09:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "02:00 PM", label: "02:00 PM" },
  { value: "05:00 PM", label: "05:00 PM" },
  { value: "08:00 PM", label: "08:00 PM" },
  { value: "09:00 PM", label: "09:00 PM" },
];

function fireGrandCelebrationConfetti() {
  try {
    // Initial center burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6C63FF", "#5B52E6", "#E7E2FF", "#38BDF8", "#34D399", "#FBBF24"],
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
        colors: ["#6C63FF", "#E7E2FF", "#34D399", "#FBBF24"],
      });
    }, 200);

    // Right cannon
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-slate-800">
          Today's progress
        </p>
        <span className="text-2xl font-bold text-[#6C63FF] tabular-nums">
          {percent}%
        </span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden bg-[#E7E2FF]">
        <div
          className="h-full rounded-full bg-[#6C63FF] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-slate-700">{completed}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span> habits complete
      </p>
    </div>
  );
}

/* ---------------- 100% Celebration Modal ---------------- */
function HabitCelebrationModal({ onClose, totalHabits, habitTitle }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl border border-purple-100 overflow-hidden">
        {/* Glow backdrop decorative circles */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#E7E2FF]/80 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#6C63FF]/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Trophy icon */}
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

        <h3 className="text-xl font-bold text-slate-900">
          Awesome Work Today! 🎉
        </h3>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {habitTitle ? (
            <>
              You just finished <strong className="text-slate-800">&ldquo;{habitTitle}&rdquo;</strong> and reached 100% completion for all habits today!
            </>
          ) : (
            <>
              You completed all <strong className="text-slate-800">{totalHabits} habits</strong> scheduled for today. Keep building your consistency!
            </>
          )}
        </p>

        {/* Stats card */}
        <div className="mt-5 grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-medium">Daily Progress</div>
            <div className="text-lg font-bold text-[#6C63FF]">100%</div>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-[11px] text-slate-400 font-medium">Completed</div>
            <div className="text-lg font-bold text-emerald-600">
              {totalHabits} / {totalHabits}
            </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationHabitTitle, setCelebrationHabitTitle] = useState("");

  const [habits, setHabits] = useState([
    { id: 1, title: "Drink Water", target: "Daily goal: 8 glasses", type: "water", streak: 12, completed: false, reminder: "09:00 AM" },
    { id: 2, title: "Read Book", target: "Daily goal: 30 mins", type: "read", streak: 5, completed: false, reminder: "09:00 PM" },
    { id: 3, title: "Workout", target: "Daily goal: 45 mins", type: "workout", streak: 0, completed: true, reminder: "07:00 AM" },
  ]);

  const toggleHabit = (id) => {
    setHabits((prev) => {
      const nextHabits = prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed;
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      });

      const toggledHabit = nextHabits.find((h) => h.id === id);
      const total = nextHabits.length;
      const completedCount = nextHabits.filter((h) => h.completed).length;

      // If user checked this habit as complete
      if (toggledHabit && toggledHabit.completed) {
        if (total > 0 && completedCount === total) {
          // Reached 100%!
          fireGrandCelebrationConfetti();
          setCelebrationHabitTitle(toggledHabit.title);
          setShowCelebrationModal(true);
        } else {
          // Mini celebration burst
          fireSingleHabitConfetti();
        }
      }

      return nextHabits;
    });
  };

  const confirmDelete = () => {
    if (deletingId) {
      setHabits((prev) => prev.filter((h) => h.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      setHabits((prev) => prev.map((h) => (h.id === editingHabit.id ? { ...h, ...habitData } : h)));
    } else {
      setHabits((prev) => [...prev, { id: Date.now(), ...habitData, streak: 0, completed: false }]);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col px-6 sm:px-8 py-6 sm:py-7 space-y-6 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Your Habits
          </h1>
          <p className="text-sm mt-1 text-slate-500">
            Small repeats, tracked honestly.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          <span>New habit</span>
        </button>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl px-6 sm:px-7 py-6 shrink-0 bg-white border border-slate-100 shadow-sm">
        <ProgressBar percent={progressPercent} completed={completedCount} total={habits.length} />
      </div>

      {/* Habits list */}
      <div className="space-y-3.5 pr-0.5 flex-1 min-h-0 overflow-y-auto">
        {habits.length === 0 && (
          <div className="rounded-2xl px-6 py-14 text-center bg-white border border-dashed border-slate-200">
            <p className="text-base font-medium text-slate-800">No habits yet</p>
            <p className="text-sm mt-1 text-slate-400">Add one to start building your streak.</p>
          </div>
        )}

        {habits.map((habit) => {
          const typeObj = HABIT_TYPES.find((t) => t.id === habit.type) || HABIT_TYPES[4];
          const Icon = typeObj.icon;

          return (
            <div
              key={habit.id}
              className="rounded-2xl px-6 py-4.5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between group transition-all bg-white border border-slate-100 shadow-sm hover:border-[#6C63FF]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: typeObj.bg, color: typeObj.fg }}
                >
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-800 truncate">
                    {habit.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {habit.target}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                {habit.completed ? (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 bg-[#E7E2FF] text-[#6C63FF]">
                    <Check size={13} strokeWidth={3} /> Done today
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 bg-orange-50 text-orange-600">
                    <Flame size={13} /> {habit.streak}d streak
                  </span>
                )}

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit habit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(habit.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      habit.completed
                        ? "bg-[#6C63FF] text-white shadow-sm"
                        : "bg-white text-slate-300 border border-slate-200 hover:border-[#6C63FF] hover:text-[#6C63FF]"
                    }`}
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 100% Celebration Modal */}
      {showCelebrationModal && (
        <HabitCelebrationModal
          totalHabits={habits.length}
          habitTitle={celebrationHabitTitle}
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
          <div className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4 bg-white shadow-xl">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-rose-50 text-rose-600">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete habit?</h3>
              <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
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

function CustomTimeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = TIME_OPTIONS.find((opt) => opt.value === value) || TIME_OPTIONS[0];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm bg-white border transition-all ${
          isOpen
            ? "border-[#6C63FF] ring-2 ring-[#6C63FF]/20"
            : "border-slate-200 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-slate-400" />
          <span className="font-medium text-slate-800">{selectedOption.label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#6C63FF]" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-52 overflow-y-auto rounded-xl p-1.5 space-y-0.5 bg-white border border-slate-100 shadow-lg">
            {TIME_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-[#E7E2FF] text-[#6C63FF] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function HabitModal({ open, initialData, onClose, onSave }) {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [selectedType, setSelectedType] = useState(initialData ? initialData.type : "water");
  const [target, setTarget] = useState(initialData ? initialData.target : "");
  const [reminder, setReminder] = useState(initialData?.reminder || "08:00 AM");
  const [startDate, setStartDate] = useState("2026-08-18");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), type: selectedType, target: target.trim() || "Daily goal", reminder });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md my-auto rounded-2xl p-6 space-y-4 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Habit" : "Create New Habit"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Keep it small enough to repeat.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Habit Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drink water"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-[11px] leading-tight text-center">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target / Description
            </label>
            <textarea
              rows={2}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 8 glasses of water every day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reminder (Optional)
            </label>
            <CustomTimeSelect value={reminder} onChange={setReminder} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Start Date
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
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