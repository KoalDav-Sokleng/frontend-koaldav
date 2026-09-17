// src/features/goal/components/ProjectGoalTab.jsx
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  X,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ListChecks,
  Pause,
  Play,
  CloudRain,
  Waves,
  Music2,
  VolumeX,
  PartyPopper,
  Check,
  Sparkles,
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  AlertTriangle,
  CalendarX,
  Clock,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
import MilestoneRow from "./MilestoneRow";
import { useProjectGoals } from "../hooks/useProjectGoals";
import { useAmbientSound } from "../hooks/useAmbientSound";
import {
  goalProgress,
  goalStatusLabel,
  isGoalMissed,
  isGoalCompleted,
} from "../utils/goalHelpers";

const STATUS_TABS = [
  { id: "IN_PROGRESS", label: "Active", icon: Clock },
  { id: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { id: "MISSED", label: "Missed", icon: AlertCircle },
];

const DURATION_PRESETS = [15, 25, 30, 45, 60];
const SOUND_OPTIONS = [
  { id: "none", label: "None", icon: VolumeX },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "brown", label: "Brown Noise", icon: Waves },
  { id: "hum", label: "Soft Hum", icon: Music2 },
];

function formatDueDate(dateStr) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return `Due ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ---------------- Goal card ---------------- */

function GoalCard({ goal, onClick, onEdit, onDelete }) {
  const progress = goalProgress(goal);
  const status = goalStatusLabel(goal);
  const isCompleted = isGoalCompleted(goal);
  const isMissed = isGoalMissed(goal);
  const milestoneCount = goal.milestones?.length ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition-all hover:shadow-md ${
        isMissed
          ? "border-rose-200 bg-rose-50/20 hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:border-rose-800"
          : isCompleted
            ? "border-slate-200 bg-white hover:border-emerald-200 dark:border-slate-700 dark:bg-[#17171F] dark:hover:border-emerald-400"
            : "border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-700 dark:bg-[#17171F] dark:hover:border-indigo-400"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <button onClick={onClick} className="min-w-0 flex-1 text-left">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                : isMissed
                  ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800"
            }`}
          >
            {isMissed && <AlertCircle className="h-3 w-3" />}
            {isCompleted && <CheckCircle2 className="h-3 w-3" />}
            {status}
          </span>
          <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
            {goal.title}
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
              <ListChecks className="h-3.5 w-3.5" />
              {milestoneCount === 0
                ? "No milestones yet"
                : `${milestoneCount} milestone${milestoneCount > 1 ? "s" : ""}`}
            </span>
            <span
              className={`flex items-center gap-1 text-xs ${
                isMissed
                  ? "font-medium text-rose-600 dark:text-rose-400"
                  : "text-slate-400 dark:text-slate-400"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatDueDate(goal.deadline)}
              {isMissed && " (Passed)"}
            </span>
          </div>
        </button>
        <div className="flex w-28 shrink-0 flex-col items-end">
          <div className="relative -mt-2 -mr-2 self-end">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Goal actions"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-[#1E1B2E]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
          <span className="mb-2 text-xs text-slate-400 dark:text-slate-400">
            Overall Progress
          </span>
          <span
            className={`text-lg font-semibold ${
              isCompleted
                ? "text-emerald-600 dark:text-emerald-400"
                : isMissed
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-indigo-600 dark:text-[#A49DFF]"
            }`}
          >
            {progress}%
          </span>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${
                isCompleted
                  ? "bg-emerald-500"
                  : isMissed
                    ? "bg-rose-500"
                    : "bg-indigo-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- New Goal modal ---------------- */

function NewGoalModal({ onClose, onSave, goal }) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [deadline, setDeadline] = useState(goal?.deadline ?? "");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    const missingTitle = !title.trim();
    const missingDate = !deadline;
    setTitleError(missingTitle ? "Give a goal title to continue." : "");
    setDateError(missingDate ? "Pick a due date to continue." : "");
    if (missingTitle || missingDate) return;

    setSaving(true);
    setSaveError("");
    try {
      await onSave({ title: title.trim(), deadline });
    } catch (err) {
      setSaveError(err.message || "Couldn't save this goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-[#17171F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-6 pt-5 pb-4 dark:border-slate-800 dark:bg-[#17171F]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {goal ? "Edit Goal" : "Create Goal"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-400">
                {goal
                  ? "Update your goal details."
                  : "Define your vision, then add milestones next."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Goal Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="e.g. Master React & Tailwind"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#242430] dark:text-white dark:placeholder:text-slate-500"
            />
            {titleError && (
              <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                {titleError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Target Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (dateError) setDateError("");
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 dark:text-white dark:bg-[#242430] focus:outline-none focus:ring-2 ${
                dateError
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-800"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700"
              }`}
            />
            {dateError && (
              <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                {dateError}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-3 py-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              Specific, measurable, time-bound goals keep momentum and are
              easiest to track.
            </p>
          </div>

          {goal?.status === "MISSED" && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Extending this goal's deadline to a future date will
                automatically reactivate it back into your Active goals.
              </p>
            </div>
          )}

          {saveError && (
            <p className="text-xs text-rose-500 dark:text-rose-400">
              {saveError}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-[#17171F]">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : goal ? "Save Changes" : "Save Goal"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Add Milestone modal ---------------- */

function AddMilestoneModal({
  onClose,
  onSave,
  milestone,
  existingMilestones = [],
}) {
  const [title, setTitle] = useState(milestone?.title ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Give the milestone a title to continue.");
      return;
    }

    const isDuplicate = existingMilestones.some(
      (m) =>
        m.title?.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
        (!milestone || String(m.id) !== String(milestone.id)),
    );

    if (isDuplicate) {
      setError("A milestone with this name already exists in this goal.");
      return;
    }

    setSaving(true);
    try {
      await onSave({ title: trimmedTitle });
    } catch (err) {
      setError(err.message || "Couldn't save this milestone.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl dark:bg-[#17171F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 pt-5 pb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {milestone ? "Edit Milestone" : "Add Milestone"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Milestone Title
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="e.g. Wireframe & Prototype Design"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#242430] dark:text-white dark:placeholder:text-slate-500"
            />
            {error && (
              <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : milestone
                ? "Save Changes"
                : "Save Milestone"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Focus duration modal ---------------- */

function FocusDurationModal({ milestoneTitle, onClose, onStart }) {
  const [minutes, setMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");
  const [error, setError] = useState("");

  const selectPreset = (preset) => {
    setMinutes(preset);
    setCustomMinutes("");
    setError("");
  };

  const handleCustomMinutes = (value) => {
    setCustomMinutes(value);
    const parsed = Number(value);
    if (!value) {
      setError("");
      return;
    }
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 480) {
      setError("Enter a whole number from 1 to 480 minutes.");
      return;
    }
    setMinutes(parsed);
    setError("");
  };

  const handleStart = () => {
    if (error || !minutes) return;
    onStart(minutes * 60);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl dark:bg-[#17171F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 pt-5 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Set Focus Duration
            </h2>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-400">
              How long do you want to focus on {milestoneTitle}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => selectPreset(p)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  minutes === p
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-[#A49DFF] dark:border-indigo-500"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {p}m
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Or set a custom duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="480"
              step="1"
              inputMode="numeric"
              value={customMinutes}
              onChange={(event) => handleCustomMinutes(event.target.value)}
              placeholder="e.g. 90"
              className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-[#242430] dark:text-white dark:placeholder:text-slate-500 ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-800" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700"}`}
            />
            {error && (
              <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 py-3 text-center dark:border-slate-800 dark:bg-[#242430]">
            <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {formatClock(minutes * 60)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={Boolean(error)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-4 w-4" /> Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Focus page ---------------- */

function FocusPage({ goalTitle, milestoneTitle, durationSeconds, onExit }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const { active: activeSound, play: playSound } = useAmbientSound();
  const hasExitedRef = useRef(false);

  useEffect(() => {
    if (isPaused || remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [isPaused, remaining]);

  useEffect(() => {
    if (remaining === 0 && !hasExitedRef.current) {
      hasExitedRef.current = true;
      onExit(durationSeconds, true);
    }
  }, [remaining, durationSeconds, onExit]);

  const elapsed = durationSeconds - remaining;
  const fraction = durationSeconds > 0 ? elapsed / durationSeconds : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 px-8 py-8 dark:from-[#0F0F14] dark:via-[#14141C] dark:to-[#1B1830]">
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => onExit(elapsed, false)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Leave Session
        </button>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-10 text-center text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet-300/20 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
              Active Session
            </p>
            <p className="mt-1 text-sm text-indigo-100/90">
              {goalTitle} &middot; {milestoneTitle}
            </p>
            <div className="relative mx-auto mt-8 h-56 w-56">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold tabular-nums">
                  {formatClock(remaining)}
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-widest text-indigo-100">
                  remaining
                </span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-950/10 hover:bg-indigo-50"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" /> Pause Session
                  </>
                )}
              </button>
              <button
                onClick={() => onExit(elapsed, true)}
                aria-label="Finish session now"
                title="Finish session now"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-widest text-indigo-100">
                Background sound
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SOUND_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => playSound(id)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ${
                      activeSound === id
                        ? "bg-white text-indigo-900"
                        : "border border-white/10 bg-white/10 text-indigo-50 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Congrats modal ---------------- */

function CongratsModal({ minutes, milestoneTitle, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#17171F] p-6 text-center shadow-xl dark:border dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
          <PartyPopper className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Nice work!
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          You completed {minutes} minute{minutes === 1 ? "" : "s"} of focus on{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {milestoneTitle}
          </span>
          .
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to Milestones
        </button>
      </div>
    </div>
  );
}

/* ---------------- Goal detail page ---------------- */

function GoalDetailPage({
  goal,
  onBack,
  onAddMilestone,
  onToggleMilestone,
  onStartFocus,
  onEditMilestone,
  onDeleteMilestone,
  onExtendDeadline,
  searchTerm,
  onSearchChange,
}) {
  const progress = goalProgress(goal);
  const status = goalStatusLabel(goal);
  const isCompleted = isGoalCompleted(goal);
  const isMissed = isGoalMissed(goal);

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8 dark:bg-[#0F0F14]">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Goals
        </button>

        {isMissed && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/30 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-rose-100 dark:bg-rose-900/60 p-2 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                    Goal Deadline Passed (Missed)
                  </h3>
                  <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-400">
                    This goal is locked because its target date has passed.
                    Focus sessions and milestone completions are disabled.
                    Extend the deadline to a future date to reactivate this
                    goal.
                  </p>
                </div>
              </div>
              <button
                onClick={onExtendDeadline}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Extend Deadline
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/30 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/60 p-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Goal Completed! 🎉
                </h3>
                <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                  Congratulations! All milestones have been completed. This goal
                  is preserved in read-only history mode.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  : isMissed
                    ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800"
              }`}
            >
              {isMissed && <AlertCircle className="h-3 w-3" />}
              {isCompleted && <CheckCircle2 className="h-3 w-3" />}
              {status}
            </span>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {goal.title}
            </h1>
            <p
              className={`mt-1 text-sm ${
                isMissed
                  ? "font-medium text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {formatDueDate(goal.deadline)}
              {isMissed && " (Past Deadline)"}
            </p>
          </div>
          {isCompleted ? (
            <button
              disabled
              title="Goal is completed."
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />{" "}
              Completed
            </button>
          ) : isMissed ? (
            <button
              disabled
              title="Goal deadline has passed. Extend deadline to add milestones."
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
            >
              <Lock className="h-4 w-4" /> Add Milestone
            </button>
          ) : (
            <button
              onClick={onAddMilestone}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Milestone
            </button>
          )}
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search milestone title..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#17171F] dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#17171F]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Overall Progress
            </span>
            <span
              className={`font-semibold ${
                isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isMissed
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-indigo-600 dark:text-[#A49DFF]"
              }`}
            >
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${
                isCompleted
                  ? "bg-emerald-500"
                  : isMissed
                    ? "bg-rose-500"
                    : "bg-indigo-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Milestones
        </h2>

        {goal.milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center dark:border-slate-700 dark:bg-[#17171F]">
            <ListChecks className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {searchTerm ? "No matching milestones" : "No milestones yet"}
            </p>
            {!searchTerm && !isMissed && !isCompleted && (
              <button
                onClick={onAddMilestone}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" /> Add Milestone
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {goal.milestones.map((m) => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                isGoalMissed={isMissed}
                isGoalCompleted={isCompleted}
                onToggleComplete={() => onToggleMilestone(m.id)}
                onStartFocus={() => onStartFocus(m.id)}
                onEdit={() => onEditMilestone(m)}
                onDelete={() => onDeleteMilestone(m)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Top-level tab ---------------- */

export default function ProjectGoalTab() {
  const {
    goals,
    allGoals,
    counts,
    loading,
    error,
    status,
    setStatus,
    createGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
    logFocusSession,
  } = useProjectGoals("IN_PROGRESS");

  const [view, setView] = useState("list");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [focusDurationSeconds, setFocusDurationSeconds] = useState(null);

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [congrats, setCongrats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Deep-link support: arriving here with `?goal=<id>` (e.g. from a
  // notification bell) opens that goal's detail once the list has loaded.
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkGoalId = searchParams.get("goal");
  const [appliedDeepLink, setAppliedDeepLink] = useState(false);
  useEffect(() => {
    if (loading || appliedDeepLink || !deepLinkGoalId) return;
    const target = (allGoals || goals).find(
      (g) => String(g.id) === deepLinkGoalId,
    );
    if (target) {
      setSelectedGoalId(target.id);
      setView("detail");
      setSearchTerm("");
      setSearchParams({}, { replace: true });
    }
    setAppliedDeepLink(true);
  }, [
    loading,
    appliedDeepLink,
    deepLinkGoalId,
    allGoals,
    goals,
    setSearchParams,
  ]);

  const selectedGoal =
    (allGoals || goals).find((g) => g.id === selectedGoalId) ?? null;
  const activeMilestone =
    selectedGoal?.milestones.find((m) => m.id === activeMilestoneId) ?? null;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredGoals = normalizedSearch
    ? goals.filter((goal) =>
        goal.title.toLowerCase().includes(normalizedSearch),
      )
    : goals;
  const filteredMilestones =
    selectedGoal?.milestones.filter((milestone) =>
      milestone.title.toLowerCase().includes(normalizedSearch),
    ) ?? [];

  const handleSaveGoal = async (payload) => {
    const isEditingMissed = isGoalMissed(editingGoal);
    const goal = editingGoal
      ? await updateGoal(editingGoal.id, payload)
      : await createGoal(payload);
    setIsNewGoalModalOpen(false);
    setEditingGoal(null);
    setSearchTerm("");

    if (isEditingMissed && !isGoalMissed(goal)) {
      await Swal.fire({
        title: "Goal Reactivated! 🎉",
        text: `“${goal.title}” deadline extended. The goal is now Active again!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setStatus("IN_PROGRESS");
    }

    setSelectedGoalId(goal.id);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedGoalId(null);
    setSearchTerm("");
  };

  const handleAddMilestone = async (payload) => {
    if (editingMilestone)
      await updateMilestone(selectedGoalId, editingMilestone.id, payload);
    else await addMilestone(selectedGoalId, payload);
    setIsMilestoneModalOpen(false);
    setEditingMilestone(null);
  };

  const confirmDeleteGoal = async (goal) => {
    const result = await Swal.fire({
      title: "Delete this goal?",
      text: `“${goal.title}” and its milestones will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteGoal(goal.id);
      if (selectedGoalId === goal.id) backToList();
      await Swal.fire({
        title: "Deleted",
        text: "The goal was deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Couldn't delete goal",
        err.message || "Please try again.",
        "error",
      );
    }
  };

  const confirmDeleteMilestone = async (milestone) => {
    const result = await Swal.fire({
      title: "Delete this milestone?",
      text: `“${milestone.title}” will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteMilestone(selectedGoalId, milestone.id);
      await Swal.fire({
        title: "Deleted",
        text: "The milestone was deleted.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Couldn't delete milestone",
        err.message || "Please try again.",
        "error",
      );
    }
  };

  const confirmEditGoal = async (goal) => {
    const result = await Swal.fire({
      title: "Edit this goal?",
      text: `Update “${goal.title}” in the form that follows.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Continue to edit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
    });
    if (result.isConfirmed) {
      setEditingGoal(goal);
      setIsNewGoalModalOpen(true);
    }
  };

  const confirmEditMilestone = async (milestone) => {
    const result = await Swal.fire({
      title: "Edit this milestone?",
      text: `Update “${milestone.title}” in the form that follows.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Continue to edit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
    });
    if (result.isConfirmed) {
      setEditingMilestone(milestone);
      setIsMilestoneModalOpen(true);
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    if (!selectedGoalId || !selectedGoal) return;
    await completeMilestone(selectedGoalId, milestoneId);
    if (selectedGoal) {
      const allDone = selectedGoal.milestones.every(
        (m) => m.id === milestoneId || m.status === "COMPLETED",
      );
      if (allDone) {
        await Swal.fire({
          title: "Goal Completed! 🎉",
          text: `Congratulations! You finished all milestones for “${selectedGoal.title}”.`,
          icon: "success",
          confirmButtonText: "Awesome!",
          confirmButtonColor: "#10b981",
        });
      }
    }
  };

  const handleStartFocusClick = (milestoneId) => {
    setActiveMilestoneId(milestoneId);
    setIsDurationModalOpen(true);
  };

  const handleConfirmDuration = (durationSeconds) => {
    setFocusDurationSeconds(durationSeconds);
    setIsDurationModalOpen(false);
    setView("focus");
  };

  const handleExitFocus = async (elapsedSeconds, fullyCompleted) => {
    const milestoneTitle = activeMilestone?.title ?? "your milestone";
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));

    if (elapsedSeconds > 0 && selectedGoalId && activeMilestoneId) {
      await logFocusSession(selectedGoalId, activeMilestoneId, {
        durationMinutes: minutes,
      });
    }

    setView("detail");
    setFocusDurationSeconds(null);
    if (fullyCompleted && elapsedSeconds > 0) {
      setCongrats({ minutes, milestoneTitle });
    }
    setActiveMilestoneId(null);
  };

  if (loading)
    return <div className="p-8 text-sm text-slate-400">Loading goals...</div>;
  if (error)
    return (
      <div className="space-y-2 p-8 text-sm text-rose-500">
        <p>Couldn't load goals — check the backend connection.</p>
        <p className="text-xs text-rose-400">{error.message}</p>
      </div>
    );

  if (
    view === "focus" &&
    selectedGoal &&
    activeMilestone &&
    focusDurationSeconds
  ) {
    return (
      <FocusPage
        goalTitle={selectedGoal.title}
        milestoneTitle={activeMilestone.title}
        durationSeconds={focusDurationSeconds}
        onExit={handleExitFocus}
      />
    );
  }

  if (view === "detail" && selectedGoal) {
    return (
      <>
        <GoalDetailPage
          goal={{ ...selectedGoal, milestones: filteredMilestones }}
          onBack={backToList}
          onAddMilestone={() => {
            setEditingMilestone(null);
            setIsMilestoneModalOpen(true);
          }}
          onToggleMilestone={handleToggleMilestone}
          onStartFocus={handleStartFocusClick}
          onEditMilestone={confirmEditMilestone}
          onDeleteMilestone={confirmDeleteMilestone}
          onExtendDeadline={() => confirmEditGoal(selectedGoal)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {isMilestoneModalOpen && (
          <AddMilestoneModal
            onClose={() => {
              setIsMilestoneModalOpen(false);
              setEditingMilestone(null);
            }}
            onSave={handleAddMilestone}
            milestone={editingMilestone}
            existingMilestones={selectedGoal?.milestones || []}
          />
        )}
        {isDurationModalOpen && activeMilestone && (
          <FocusDurationModal
            milestoneTitle={activeMilestone.title}
            onClose={() => {
              setIsDurationModalOpen(false);
              setActiveMilestoneId(null);
            }}
            onStart={handleConfirmDuration}
          />
        )}
        {congrats && (
          <CongratsModal
            minutes={congrats.minutes}
            milestoneTitle={congrats.milestoneTitle}
            onClose={() => setCongrats(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8 dark:bg-[#0F0F14]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Your Goals
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track, focus, and manage your progress across active, completed,
              and missed goals.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsNewGoalModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Goal
          </button>
        </div>

        {/* 3-Tab Status Navigation (Microsoft Teams style) */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.id;
            const Icon = tab.icon;
            const isMissedTab = tab.id === "MISSED";
            const count = counts?.[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchTerm("");
                  setStatus(tab.id);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? isMissedTab
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-[#17171F] dark:text-slate-300 dark:hover:bg-[#242430] dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isMissedTab && count > 0
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search goal title..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#17171F] dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-[#17171F]">
            {status === "MISSED" ? (
              <CalendarX className="mb-3 h-8 w-8 text-rose-300 dark:text-rose-500" />
            ) : (
              <CheckCircle2 className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
            )}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {searchTerm
                ? "No matching goals"
                : status === "IN_PROGRESS"
                  ? "No active goals in progress"
                  : status === "COMPLETED"
                    ? "No completed goals yet"
                    : "No missed goals"}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {searchTerm
                ? "Try changing your search keywords."
                : status === "IN_PROGRESS"
                  ? "Create your first goal to start tracking progress."
                  : status === "COMPLETED"
                    ? "Goals will appear here once all their milestones are finished."
                    : "Great job! All your goals are on track or completed."}
            </p>
            {status === "IN_PROGRESS" && !searchTerm && (
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsNewGoalModalOpen(true);
                }}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" /> New Goal
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGoalId(goal.id);
                  setView("detail");
                }}
                onEdit={() => confirmEditGoal(goal)}
                onDelete={() => confirmDeleteGoal(goal)}
              />
            ))}
          </div>
        )}
      </div>

      {isNewGoalModalOpen && (
        <NewGoalModal
          onClose={() => {
            setIsNewGoalModalOpen(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
          goal={editingGoal}
        />
      )}
    </div>
  );
}
