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
} from "lucide-react";
import MilestoneRow from "./MilestoneRow";
import { useProjectGoals } from "../hooks/useProjectGoals";
import { useAmbientSound } from "../hooks/useAmbientSound";
import { goalProgress, goalStatusLabel } from "../utils/goalHelpers";

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

function GoalCard({ goal, onClick }) {
  const progress = goalProgress(goal);
  const status = goalStatusLabel(goal);
  const isCompleted = status === "Completed";
  const milestoneCount = goal.milestones?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isCompleted
                ? "bg-emerald-50 text-emerald-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {status}
          </span>
          <h3 className="mt-2 text-base font-semibold text-slate-900">
            {goal.title}
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <ListChecks className="h-3.5 w-3.5" />
              {milestoneCount === 0
                ? "No milestones yet"
                : `${milestoneCount} milestone${milestoneCount > 1 ? "s" : ""}`}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDueDate(goal.deadline)}
            </span>
          </div>
        </div>
        <div className="flex w-28 shrink-0 flex-col items-end">
          <span className="mb-2 text-xs text-slate-400">Overall Progress</span>
          <span
            className={`text-lg font-semibold ${isCompleted ? "text-emerald-600" : "text-indigo-600"}`}
          >
            {progress}%
          </span>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ---------------- New Goal modal ---------------- */

function NewGoalModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
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
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-6 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create Goal
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Define your vision, then add milestones next.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {titleError && (
              <p className="mt-1 text-xs text-rose-500">{titleError}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Target Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (dateError) setDateError("");
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                dateError
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            {dateError && (
              <p className="mt-1 text-xs text-rose-500">{dateError}</p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <p className="text-xs text-indigo-700">
              Specific, measurable, time-bound goals keep momentum and are
              easiest to track.
            </p>
          </div>

          {saveError && <p className="text-xs text-rose-500">{saveError}</p>}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Goal"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Add Milestone modal ---------------- */

function AddMilestoneModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Give the milestone a title to continue.");
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: title.trim() });
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
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 pt-5 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Add Milestone
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Milestone"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Focus duration modal ---------------- */

function FocusDurationModal({ milestoneTitle, onClose, onStart }) {
  const [minutes, setMinutes] = useState(25);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 pt-5 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Set Focus Duration
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              How long do you want to focus on {milestoneTitle}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
                onClick={() => setMinutes(p)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  minutes === p
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {p}m
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 py-3 text-center">
            <span className="text-2xl font-semibold tabular-nums text-slate-900">
              {formatClock(minutes * 60)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onStart(minutes * 60)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => onExit(elapsed, false)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Leave Session
        </button>
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-10 text-center text-white shadow-xl">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300">
            Active Session
          </p>
          <p className="mt-1 text-sm text-indigo-100">
            {goalTitle} &middot; {milestoneTitle}
          </p>
          <div className="relative mx-auto mt-8 h-56 w-56">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="10"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#818cf8"
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
              <span className="mt-1 text-[11px] uppercase tracking-widest text-indigo-300">
                remaining
              </span>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-400"
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-[11px] uppercase tracking-widest text-indigo-300">
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
                      : "bg-white/10 text-indigo-100 hover:bg-white/20"
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
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <PartyPopper className="h-7 w-7 text-emerald-500" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Nice work!
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          You completed {minutes} minute{minutes === 1 ? "" : "s"} of focus on{" "}
          <span className="font-medium text-slate-700">{milestoneTitle}</span>.
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
}) {
  const progress = goalProgress(goal);
  const status = goalStatusLabel(goal);
  const isCompleted = status === "Completed";

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Goals
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {status}
            </span>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {goal.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {formatDueDate(goal.deadline)}
            </p>
          </div>
          <button
            onClick={onAddMilestone}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add Milestone
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Overall Progress</span>
            <span
              className={`font-semibold ${isCompleted ? "text-emerald-600" : "text-indigo-600"}`}
            >
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Milestones
        </h2>

        {goal.milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
            <ListChecks className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              No milestones yet
            </p>
            <button
              onClick={onAddMilestone}
              className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Add Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {goal.milestones.map((m) => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                onToggleComplete={() => onToggleMilestone(m.id)}
                onStartFocus={() => onStartFocus(m.id)}
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
    loading,
    error,
    createGoal,
    addMilestone,
    completeMilestone,
    logFocusSession,
  } = useProjectGoals();

  const [view, setView] = useState("list");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [focusDurationSeconds, setFocusDurationSeconds] = useState(null);

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [congrats, setCongrats] = useState(null);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;
  const activeMilestone =
    selectedGoal?.milestones.find((m) => m.id === activeMilestoneId) ?? null;

  const handleSaveGoal = async (payload) => {
    const goal = await createGoal(payload);
    setIsNewGoalModalOpen(false);
    setSelectedGoalId(goal.id);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedGoalId(null);
  };

  const handleAddMilestone = async (payload) => {
    await addMilestone(selectedGoalId, payload);
    setIsMilestoneModalOpen(false);
  };

  const handleToggleMilestone = (milestoneId) =>
    completeMilestone(selectedGoalId, milestoneId);

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

    if (elapsedSeconds > 0) {
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
          goal={selectedGoal}
          onBack={backToList}
          onAddMilestone={() => setIsMilestoneModalOpen(true)}
          onToggleMilestone={handleToggleMilestone}
          onStartFocus={handleStartFocusClick}
        />
        {isMilestoneModalOpen && (
          <AddMilestoneModal
            onClose={() => setIsMilestoneModalOpen(false)}
            onSave={handleAddMilestone}
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
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your Goals
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage your active goals.
            </p>
          </div>
          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No goals yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Create your first goal to start tracking progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={() => {
                  setSelectedGoalId(goal.id);
                  setView("detail");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {isNewGoalModalOpen && (
        <NewGoalModal
          onClose={() => setIsNewGoalModalOpen(false)}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  );
}
