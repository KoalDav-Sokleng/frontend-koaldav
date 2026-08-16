import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Calendar,
  FolderKanban,
  DollarSign,
  Heart,
  Briefcase,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trash2,
  ListChecks,
  Timer,
  Pause,
  Play,
  CloudRain,
  Waves,
  Music2,
  VolumeX,
  PartyPopper,
  Check,
} from "lucide-react";

/**
 * ProjectGoal.jsx
 *
 * Flow:
 *  - "Your Goals" list. Click "New Goal" -> modal to create a goal.
 *  - Saving the goal takes you straight to that goal's detail page,
 *    where you build out milestones one at a time.
 *  - Click any goal card in the list to jump back into its detail page.
 *  - Detail page: "Add Milestone" opens a small modal (title + optional
 *    due date). Milestones render as cards you can check off or delete.
 *  - Each milestone card has "Start Focus": pick a duration in a small
 *    modal, then land on a full focus timer page with optional ambient
 *    background sound (rain / brown noise / soft hum, all synthesized
 *    in-browser, no external audio files needed). Time spent is logged
 *    against the milestone, and finishing a session shows a small
 *    congratulations screen.
 *
 * No router is used — navigation is just local state ("list"/"detail"/"focus").
 * Sidebar is intentionally NOT included — compose this next to your own sidebar.
 */

const GOAL_TYPES = [
  { id: "project", label: "Project", icon: FolderKanban },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "health", label: "Health", icon: Heart },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "learning", label: "Learning", icon: BookOpen },
];

const DURATION_PRESETS = [15, 25, 30, 45, 60];

const SOUND_OPTIONS = [
  { id: "none", label: "None", icon: VolumeX },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "brown", label: "Brown Noise", icon: Waves },
  { id: "hum", label: "Soft Hum", icon: Music2 },
];

function typeMeta(typeId) {
  return GOAL_TYPES.find((t) => t.id === typeId) ?? GOAL_TYPES[0];
}

function formatDueDate(dateStr) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return `Due ${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// mm:ss or h:mm:ss display for a countdown
function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Logged-time chip, e.g. "1h 12m focused"
function formatLoggedTime(totalSeconds) {
  if (!totalSeconds) return null;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.round((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m focused`;
  return `${m}m focused`;
}

// Overall progress for a goal is the average of its milestones' progress.
// A goal with no milestones yet just shows 0%.
function goalProgress(goal) {
  if (!goal.milestones || goal.milestones.length === 0) return 0;
  const total = goal.milestones.reduce((sum, m) => sum + m.progress, 0);
  return Math.round(total / goal.milestones.length);
}

function goalStatus(goal) {
  const progress = goalProgress(goal);
  if (goal.milestones?.length > 0 && progress === 100) return "Completed";
  return "In Progress";
}

const INITIAL_GOALS = [
  {
    id: "g1",
    title: "Build Ecommerce Website",
    description:
      "Next-gen headless commerce platform for high-end boutique brands. Transitioning from prototype to beta launch.",
    type: "project",
    dueDate: "2025-12-15",
    updatedLabel: "Updated 2h ago",
    milestones: [
      {
        id: "m1",
        title: "Frontend Development",
        status: "Completed",
        progress: 100,
        dueDate: "2024-10-28",
        timeSpentSeconds: 5400,
      },
      {
        id: "m2",
        title: "Backend API & Auth",
        status: "In Progress",
        progress: 33,
        dueDate: "2024-11-05",
        timeSpentSeconds: 3600,
      },
      {
        id: "m3",
        title: "Content CMS",
        status: "Planned",
        progress: 0,
        dueDate: "2024-11-12",
        timeSpentSeconds: 0,
      },
    ],
  },
  {
    id: "g2",
    title: "Mobile App Redesign",
    description:
      "Complete overhaul of the UI for iOS and Android applications, focusing on accessibility and speed.",
    type: "project",
    dueDate: "2025-01-29",
    updatedLabel: "Updated 1d ago",
    milestones: [
      {
        id: "m4",
        title: "Design System Audit",
        status: "In Progress",
        progress: 55,
        dueDate: "2024-12-01",
        timeSpentSeconds: 1800,
      },
    ],
  },
  {
    id: "g3",
    title: "Marketing Brand Guide",
    description:
      "Standardizing the brand identity across all digital and print mediums for the upcoming Q4 campaign.",
    type: "project",
    dueDate: "2024-10-12",
    updatedLabel: "Oct 12, 2024",
    milestones: [
      {
        id: "m5",
        title: "Logo & Color System",
        status: "Completed",
        progress: 100,
        dueDate: "2024-09-20",
        timeSpentSeconds: 7200,
      },
      {
        id: "m6",
        title: "Print Templates",
        status: "Completed",
        progress: 100,
        dueDate: "2024-10-10",
        timeSpentSeconds: 5400,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Ambient sound engine — synthesized in-browser, no external files.   */
/* ------------------------------------------------------------------ */
function useAmbientSound() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const [active, setActive] = useState("none");

  const stop = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try {
        if (n.stop) n.stop();
        n.disconnect && n.disconnect();
      } catch (e) {
        /* already stopped */
      }
    });
    nodesRef.current = [];
  }, []);

  const play = useCallback(
    (type) => {
      stop();
      setActive(type);
      if (type === "none") return;

      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (type === "rain" || type === "brown") {
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = type === "rain" ? 1400 : 500;

        const gain = ctx.createGain();
        gain.gain.value = type === "rain" ? 0.12 : 0.16;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        nodesRef.current = [source, filter, gain];
      } else if (type === "hum") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 110;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.015;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        lfo.start();

        nodesRef.current = [osc, lfo, lfoGain, gain];
      }
    },
    [stop]
  );

  useEffect(() => stop, [stop]);

  return { active, play, stop };
}

/* ------------------------------------------------------------------ */
/* Goal list + cards                                                   */
/* ------------------------------------------------------------------ */

function GoalCard({ goal, onClick }) {
  const progress = goalProgress(goal);
  const status = goalStatus(goal);
  const isCompleted = status === "Completed";
  const { icon: Icon } = typeMeta(goal.type);
  const milestoneCount = goal.milestones?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {status}
            </span>
            <span className="text-xs text-slate-400">
              &middot; {goal.updatedLabel}
            </span>
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            {goal.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {goal.description}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <ListChecks className="h-3.5 w-3.5" />
              {milestoneCount === 0
                ? "No milestones yet"
                : `${milestoneCount} milestone${milestoneCount > 1 ? "s" : ""}`}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {isCompleted ? "Finished" : formatDueDate(goal.dueDate)}
            </span>
          </div>
        </div>

        <div className="flex w-28 shrink-0 flex-col items-end">
          <span className="mb-2 flex items-center gap-1 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5" />
            Overall Progress
          </span>
          <span
            className={`text-lg font-semibold ${
              isCompleted ? "text-emerald-600" : "text-indigo-600"
            }`}
          >
            {progress}%
          </span>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                isCompleted ? "bg-emerald-500" : "bg-indigo-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function NewGoalModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("project");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");

  const handleSave = () => {
    const missingTitle = !name.trim();
    const missingDate = !targetDate;

    setTitleError(missingTitle ? "Give a goal title to continue." : "");
    setDateError(missingDate ? "Pick a due date to continue." : "");

      if (missingTitle || missingDate) return;
  
    onSave({
      id: `g${Date.now()}`,
      title: name.trim(),
      description: description.trim() || "No description added yet.",
      type,
      dueDate: targetDate,
      updatedLabel: "Updated just now",
      milestones: [],
    });
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
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                 if (titleError) setTitleError("");
              }}
              placeholder="e.g. Master React & Tailwind"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {titleError && <p className="mt-1 text-xs text-rose-500">{titleError}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Goal Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOAL_TYPES.map(({ id, label, icon: Icon }) => {
                const active = type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setType(id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Goal Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what success looks like for this goal..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Target Date
            </label>
            <input
  type="date"
  value={targetDate}
  onChange={(e) => {
    setTargetDate(e.target.value);
    if (dateError) setDateError("");
  }}
  className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
    dateError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
  }`}
/>
{dateError && <p className="mt-1 text-xs text-rose-500">{dateError}</p>}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <p className="text-xs text-indigo-700">
              Specific, measurable, time-bound goals keep momentum and are
              easiest to track.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Save Goal
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddMilestoneModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError("Give the milestone a title to continue.");
      return;
    }
    onSave({
      id: `m${Date.now()}`,
      title: title.trim(),
      status: "Planned",
      progress: 0,
      dueDate,
      timeSpentSeconds: 0,
    });
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
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Due Date <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
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
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Save Milestone
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Focus duration picker modal                                         */
/* ------------------------------------------------------------------ */
function FocusDurationModal({ milestoneTitle, onClose, onStart }) {
  const [minutes, setMinutes] = useState(25);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isCustom, setIsCustom] = useState(false);

  const effectiveMinutes = isCustom
    ? customHours * 60 + customMinutes
    : minutes;

  const handleStart = () => {
    const totalSeconds = Math.max(60, effectiveMinutes * 60);
    onStart(totalSeconds);
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
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map((p) => {
              const active = !isCustom && minutes === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setIsCustom(false);
                    setMinutes(p);
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p}m
                </button>
              );
            })}
            <button
              onClick={() => setIsCustom(true)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isCustom
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="flex items-center justify-center gap-3 rounded-xl bg-slate-50 py-4">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={customHours}
                  onChange={(e) =>
                    setCustomHours(Math.max(0, Number(e.target.value)))
                  }
                  className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-lg font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                  hours
                </span>
              </div>
              <span className="pb-4 text-lg font-semibold text-slate-300">
                :
              </span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={customMinutes}
                  onChange={(e) =>
                    setCustomMinutes(
                      Math.min(59, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-lg font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                  minutes
                </span>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-100 bg-slate-50 py-3 text-center">
            <span className="text-2xl font-semibold tabular-nums text-slate-900">
              {formatClock(effectiveMinutes * 60)}
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
            onClick={handleStart}
            disabled={effectiveMinutes <= 0}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Focus session page                                                  */
/* ------------------------------------------------------------------ */
function FocusPage({ goalTitle, milestoneTitle, durationSeconds, onExit }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const { active: activeSound, play: playSound } = useAmbientSound();

  useEffect(() => {
    if (isPaused || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused, remaining]);

  useEffect(() => {
    if (remaining === 0) {
      onExit(durationSeconds, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const elapsed = durationSeconds - remaining;
  const fraction = durationSeconds > 0 ? elapsed / durationSeconds : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);

  const handleFinishNow = () => {
    if (elapsed < 1) return;
    onExit(elapsed, true);
  };

  const handleLeave = () => {
    onExit(elapsed, false);
  };

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-xl">
        <button
          onClick={handleLeave}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Leave Session
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
              className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Session
                </>
              )}
            </button>
            <button
              onClick={handleFinishNow}
              aria-label="Finish session now"
              title="Finish session now"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[11px] uppercase tracking-widest text-indigo-300">
              Background sound
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SOUND_OPTIONS.map(({ id, label, icon: Icon }) => {
                const active = activeSound === id;
                return (
                  <button
                    key={id}
                    onClick={() => playSound(id)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-white text-indigo-900"
                        : "bg-white/10 text-indigo-100 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Back to Milestones
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Milestone row + goal detail page                                    */
/* ------------------------------------------------------------------ */

function MilestoneRow({ milestone, onToggleComplete, onDelete, onStartFocus }) {
  const isCompleted = milestone.status === "Completed";
  const dueLabel = formatShortDate(milestone.dueDate);
  const loggedLabel = formatLoggedTime(milestone.timeSpentSeconds);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <button
        onClick={onToggleComplete}
        aria-label={isCompleted ? "Mark as not complete" : "Mark as complete"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 hover:border-indigo-400"
        }`}
      >
        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4
            className={`text-sm font-medium ${
              isCompleted ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {milestone.title}
          </h4>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isCompleted
                ? "bg-emerald-50 text-emerald-600"
                : milestone.status === "In Progress"
                ? "bg-indigo-50 text-indigo-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {milestone.status}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          {dueLabel && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dueLabel}
            </span>
          )}
          {loggedLabel && (
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {loggedLabel}
            </span>
          )}
        </div>
      </div>

      <div className="hidden w-28 shrink-0 sm:block">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              isCompleted ? "bg-emerald-500" : "bg-indigo-500"
            }`}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onStartFocus}
          disabled={isCompleted}
          className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <Timer className="h-3.5 w-3.5" />
          Start Focus
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete milestone"
          className="shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function GoalDetailPage({
  goal,
  onBack,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onStartFocus,
}) {
  const progress = goalProgress(goal);
  const status = goalStatus(goal);
  const isCompleted = status === "Completed";
  const { icon: Icon } = typeMeta(goal.type);

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Goals
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {status}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDueDate(goal.dueDate)}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {goal.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{goal.description}</p>
            </div>
          </div>

          <button
            onClick={onAddMilestone}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Overall Progress</span>
            <span
              className={`font-semibold ${
                isCompleted ? "text-emerald-600" : "text-indigo-600"
              }`}
            >
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                isCompleted ? "bg-emerald-500" : "bg-indigo-500"
              }`}
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
            <p className="mt-1 text-xs text-slate-400">
              Break this goal down into a few concrete steps.
            </p>
            <button
              onClick={onAddMilestone}
              className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {goal.milestones.map((m) => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                onToggleComplete={() => onToggleMilestone(m.id)}
                onDelete={() => onDeleteMilestone(m.id)}
                onStartFocus={() => onStartFocus(m.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top-level component                                                 */
/* ------------------------------------------------------------------ */

export default function ProjectGoal() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [view, setView] = useState("list"); // "list" | "detail" | "focus"
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [focusDurationSeconds, setFocusDurationSeconds] = useState(null);

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [congrats, setCongrats] = useState(null); // { minutes, milestoneTitle } | null

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;
  const activeMilestone =
    selectedGoal?.milestones.find((m) => m.id === activeMilestoneId) ?? null;

  const handleSaveGoal = (goal) => {
    setGoals((prev) => [goal, ...prev]);
    setIsNewGoalModalOpen(false);
    setSelectedGoalId(goal.id);
    setView("detail");
  };

  const openGoal = (goalId) => {
    setSelectedGoalId(goalId);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedGoalId(null);
  };

  const handleAddMilestone = (milestone) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoalId
          ? { ...g, milestones: [...g.milestones, milestone] }
          : g
      )
    );
    setIsMilestoneModalOpen(false);
  };

  const handleToggleMilestone = (milestoneId) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoalId
          ? {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === milestoneId
                  ? {
                      ...m,
                      status: m.status === "Completed" ? "In Progress" : "Completed",
                      progress: m.status === "Completed" ? 0 : 100,
                    }
                  : m
              ),
            }
          : g
      )
    );
  };

  const handleDeleteMilestone = (milestoneId) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
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

  // elapsedSeconds is always logged against the milestone. congrats only
  // shows when the person actually finished the session (fullyCompleted).
  const handleExitFocus = (elapsedSeconds, fullyCompleted) => {
    const milestoneTitle = activeMilestone?.title ?? "your milestone";

    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoalId
          ? {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === activeMilestoneId
                  ? {
                      ...m,
                      timeSpentSeconds:
                        (m.timeSpentSeconds || 0) + Math.round(elapsedSeconds),
                      status:
                        m.status === "Planned" && elapsedSeconds > 0
                          ? "In Progress"
                          : m.status,
                    }
                  : m
              ),
            }
          : g
      )
    );

    setView("detail");
    setFocusDurationSeconds(null);

    if (fullyCompleted && elapsedSeconds > 0) {
      setCongrats({
        minutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        milestoneTitle,
      });
    }
    setActiveMilestoneId(null);
  };

  if (view === "focus" && selectedGoal && activeMilestone && focusDurationSeconds) {
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
          onDeleteMilestone={handleDeleteMilestone}
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
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              No goals yet
            </p>
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
                onClick={() => openGoal(goal.id)}
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