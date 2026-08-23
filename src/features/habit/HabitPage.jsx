import React, { useState } from "react";
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
} from "lucide-react";

const HABIT_TYPES = [
  { id: "water", label: "Water", icon: Droplets, fg: "#4648D4", bg: "#E7E9F8" },
  { id: "workout", label: "Workout", icon: Dumbbell, fg: "#B9563A", bg: "#F7E9E2" },
  { id: "read", label: "Read", icon: BookOpen, fg: "#4A8A6F", bg: "#E4F0E9" },
  { id: "study", label: "Study", icon: GraduationCap, fg: "#8A6D3B", bg: "#F3ECDD" },
  { id: "other", label: "Other", icon: MoreHorizontal, fg: "#4A4E44", bg: "#EFEDE5" },
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

// ---- shared tokens ----
const INK = "#20241F";
const MUTED = "#8A8F82";
const SUBTLE = "#EDEBE2";
const PAPER = "#FFFFFF";
const ACCENT = "#4648D4";
const CARD_SHADOW = "0 1px 2px rgba(32,36,31,0.04), 0 8px 20px -12px rgba(32,36,31,0.10)";
const CARD_BORDER = `1px solid ${SUBTLE}`;

function ProgressBar({ percent, completed, total }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-semibold" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>
          Today's progress
        </p>
        <span className="font-mono text-[30px] font-bold tabular-nums" style={{ color: ACCENT }}>
          {percent}%
        </span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#E7E9F8" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, background: ACCENT, transition: "width 0.5s ease" }}
        />
      </div>
      <p className="text-[14px]" style={{ color: MUTED }}>
        <span className="font-mono font-medium" style={{ color: "#4A4E44" }}>{completed}</span> of{" "}
        <span className="font-mono font-medium" style={{ color: "#4A4E44" }}>{total}</span> habits complete
      </p>
    </div>
  );
}

export default function HabitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [habits, setHabits] = useState([
    { id: 1, title: "Drink Water", target: "Daily goal: 8 glasses", type: "water", streak: 12, completed: false, reminder: "09:00 AM" },
    { id: 2, title: "Read Book", target: "Daily goal: 30 mins", type: "read", streak: 5, completed: false, reminder: "09:00 PM" },
    { id: 3, title: "Workout", target: "Daily goal: 45 mins", type: "workout", streak: 0, completed: true, reminder: "07:00 AM" },
  ]);

  const toggleHabit = (id) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
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
    <div className="w-full h-full flex flex-col px-6 sm:px-8 py-6 sm:py-7 space-y-5 sm:space-y-6 overflow-hidden" style={{ background: PAPER }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        * { font-family: 'Inter', ui-sans-serif, system-serif; }
        .hp-btn:focus-visible, .hp-input:focus-visible, .hp-icon-btn:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>
            Your Habits
          </h1>
          <p className="text-[15px] mt-1" style={{ color: MUTED }}>
            Small repeats, tracked honestly.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          className="hp-btn flex items-center justify-center gap-2 active:scale-95 text-white text-[15px] font-semibold px-6 py-3.5 rounded-full transition-all shrink-0"
          style={{ background: INK, boxShadow: "0 1px 2px rgba(32,36,31,0.15)" }}
        >
          <Plus size={18} />
          <span>New habit</span>
        </button>
      </div>

      {/* Progress card */}
      <div className="rounded-3xl px-6 sm:px-7 py-6 shrink-0" style={{ background: "#FFFFFF", boxShadow: CARD_SHADOW, border: CARD_BORDER }}>
        <ProgressBar percent={progressPercent} completed={completedCount} total={habits.length} />
      </div>

      {/* Habits list */}
      <div className="space-y-4 pr-0.5 flex-1 min-h-0 overflow-y-auto">
        {habits.length === 0 && (
          <div className="rounded-3xl px-6 py-14 text-center" style={{ background: "#FFFFFF", border: `1px dashed #D7DACF` }}>
            <p className="text-[17px] font-medium" style={{ color: INK }}>No habits yet</p>
            <p className="text-[14px] mt-1.5" style={{ color: MUTED }}>Add one to start building your streak.</p>
          </div>
        )}

        {habits.map((habit) => {
          const typeObj = HABIT_TYPES.find((t) => t.id === habit.type) || HABIT_TYPES[4];
          const Icon = typeObj.icon;

          return (
            <div
              key={habit.id}
              className="rounded-3xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between group transition-shadow"
              style={{ background: "#FFFFFF", boxShadow: CARD_SHADOW, border: CARD_BORDER }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: typeObj.bg, color: typeObj.fg }}>
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[18px] font-semibold truncate" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>
                    {habit.title}
                  </h3>
                  <p className="text-[14px] truncate" style={{ color: MUTED }}>
                    {habit.target}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                {habit.completed ? (
                  <span className="text-[13px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shrink-0" style={{ background: "#E7E9F8", color: ACCENT }}>
                    <Check size={13} strokeWidth={3} /> Done today
                  </span>
                ) : (
                  <span className="text-[13px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-mono shrink-0" style={{ background: "#F7E9E2", color: "#B9563A" }}>
                    <Flame size={13} /> {habit.streak}d streak
                  </span>
                )}

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="hp-icon-btn p-2.5 rounded-xl transition-colors"
                      style={{ color: MUTED }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = SUBTLE; e.currentTarget.style.color = INK; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingId(habit.id)}
                      className="hp-icon-btn p-2.5 rounded-xl transition-colors"
                      style={{ color: MUTED }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F2E4E0"; e.currentTarget.style.color = "#A85340"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="hp-icon-btn w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0"
                    style={
                      habit.completed
                        ? { background: INK, color: "#fff" }
                        : { background: "#FFFFFF", color: "#B7BBAB", border: `1px solid ${SUBTLE}` }
                    }
                  >
                    <Check size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <HabitModal open={isModalOpen} initialData={editingHabit} onClose={handleCloseModal} onSave={handleSaveHabit} />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: "rgba(32,36,31,0.4)", backdropFilter: "blur(2px)" }}>
          <div className="w-full max-w-sm rounded-3xl p-7 text-center space-y-4" style={{ background: "#FFFFFF", boxShadow: "0 20px 40px -12px rgba(32,36,31,0.25)" }}>
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "#F2E4E0", color: "#A85340" }}>
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>Delete habit?</h3>
              <p className="text-[14px] mt-1.5" style={{ color: MUTED }}>This can't be undone.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setDeletingId(null)}
                className="hp-btn w-full py-3 rounded-xl text-[15px] font-semibold transition-colors"
                style={{ border: `1px solid ${SUBTLE}`, color: INK }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="hp-btn w-full py-3 rounded-xl text-white text-[15px] font-semibold transition-colors"
                style={{ background: "#A85340" }}
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
        className="hp-btn w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] transition-all"
        style={{
          background: "#fff",
          color: INK,
          border: isOpen ? `1px solid ${ACCENT}` : `1px solid ${SUBTLE}`,
          boxShadow: isOpen ? "0 0 0 4px rgba(70,72,212,0.12)" : "none",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Clock size={17} style={{ color: MUTED }} />
          <span className="font-medium font-mono">{selectedOption.label}</span>
        </div>
        <ChevronDown size={17} style={{ color: isOpen ? ACCENT : MUTED, transition: "transform 0.2s" }} className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-30 max-h-52 overflow-y-auto rounded-2xl p-1.5 space-y-1" style={{ background: "#fff", border: `1px solid ${SUBTLE}`, boxShadow: "0 12px 28px -8px rgba(32,36,31,0.18)" }}>
            {TIME_OPTIONS.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className="hp-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium font-mono transition-colors"
                  style={isSelected ? { background: "#E7E9F8", color: ACCENT } : { color: "#4A4E44" }}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={16} />}
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
    onSave({ title, type: selectedType, target: target || "Daily goal", reminder });
  };

  const inputStyle = { background: "#fff", border: `1px solid ${SUBTLE}`, color: INK };
  const focusOn = (e) => (e.target.style.boxShadow = "0 0 0 4px rgba(70,72,212,0.12)");
  const focusOff = (e) => (e.target.style.boxShadow = "none");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: "rgba(32,36,31,0.4)", backdropFilter: "blur(2px)" }}>
      <div className="w-full max-w-md rounded-3xl p-7 space-y-5 max-h-[90vh] overflow-y-auto" style={{ background: "#FFFFFF", boxShadow: "0 20px 40px -12px rgba(32,36,31,0.25)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold" style={{ color: INK, fontFamily: "'Fraunces', serif" }}>
              {initialData ? "Edit habit" : "Create new habit"}
            </h2>
            <p className="text-[14px] mt-1" style={{ color: MUTED }}>Keep it small enough to repeat.</p>
          </div>
          <button onClick={onClose} className="hp-icon-btn p-2 rounded-full transition-colors" style={{ color: MUTED }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] font-semibold mb-2" style={{ color: "#4A4E44" }}>Habit title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drink water"
              className="hp-input w-full px-4 py-3.5 rounded-2xl text-[15px] focus:outline-none transition-shadow"
              style={inputStyle}
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-2" style={{ color: "#4A4E44" }}>Habit type</label>
            <div className="grid grid-cols-5 gap-2">
              {HABIT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className="hp-btn flex flex-col items-center justify-center py-3.5 rounded-2xl transition-all"
                    style={
                      isSelected
                        ? { background: type.bg, color: type.fg, border: "1px solid " + type.fg }
                        : { background: "#fff", color: MUTED, border: `1px solid ${SUBTLE}` }
                    }
                  >
                    <Icon size={22} className="mb-1.5" />
                    <span className="text-[10.5px] font-medium leading-tight text-center">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-2" style={{ color: "#4A4E44" }}>Target / description</label>
            <textarea
              rows={2}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 8 glasses of water every day"
              className="hp-input w-full px-4 py-3.5 rounded-2xl text-[15px] focus:outline-none resize-none transition-shadow"
              style={inputStyle}
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-2" style={{ color: "#4A4E44" }}>Reminder (optional)</label>
            <CustomTimeSelect value={reminder} onChange={setReminder} />
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-2" style={{ color: "#4A4E44" }}>Start date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-4 pointer-events-none" style={{ color: MUTED }} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="hp-input w-full pl-12 pr-4 py-3.5 rounded-2xl text-[15px] font-mono focus:outline-none transition-shadow"
                style={inputStyle}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="hp-btn px-5 py-3.5 rounded-2xl text-[15px] font-semibold transition-colors" style={{ border: `1px solid ${SUBTLE}`, color: INK }}>
              Cancel
            </button>
            <button type="submit" className="hp-btn px-5 py-3.5 rounded-2xl text-white text-[15px] font-semibold transition-colors" style={{ background: INK, boxShadow: "0 1px 2px rgba(32,36,31,0.15)" }}>
              {initialData ? "Save changes" : "Create habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}