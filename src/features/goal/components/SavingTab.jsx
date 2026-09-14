import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  X,
  Calendar,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Laptop,
  Plane,
  Car,
  PiggyBank,
  CreditCard,
  StickyNote,
  Target,
  Wallet,
  Trash2,
  RefreshCw,
  Loader2,
  Lock,
  Search,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSavingGoals } from "../hooks/useSavingGoals";

/* ------------------------------------------------------------------ */
/* Design tokens & Icons                                               */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F8F7FC",
  primary: "#6C4DFF",
  primaryDark: "#5A3DEF",
  secondary: "#8B6CFF",
  text: "#1F1B2E",
  subtext: "#8B879C",
  border: "#ECE9F7",
  green: "#1FAA6D",
  greenBg: "#E7F8F0",
  amber: "#D97B2D",
  amberBg: "#FDF1E6",
  red: "#E0483C",
  redBg: "#FCEAE8",
};

const ICONS = {
  laptop: Laptop,
  plane: Plane,
  car: Car,
  piggy: PiggyBank,
  target: Target,
};

const ICON_OPTIONS = [
  { id: "piggy", label: "Piggy Bank", icon: PiggyBank },
  { id: "laptop", label: "Laptop / Tech", icon: Laptop },
  { id: "plane", label: "Travel / Trip", icon: Plane },
  { id: "car", label: "Vehicle", icon: Car },
  { id: "target", label: "General Target", icon: Target },
];

const STATUS_TABS = [
  { id: "ACTIVE", label: "Active", icon: Clock },
  { id: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { id: "MISSED", label: "Missed", icon: AlertCircle },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatCurrency(n) {
  return (
    "$" +
    Number(n || 0)
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(/\.00$/, "")
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "No deadline";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getProgress(goal) {
  const target = Number(goal?.targetAmount) || 0;
  const current = Number(goal?.currentAmount) || 0;
  if (!target) return 0;
  return Math.min(100, (current / target) * 100);
}

function getGoalStatus(goal) {
  if (goal?.status === "COMPLETED") return "COMPLETED";
  if (goal?.status === "MISSED") return "MISSED";
  if (goal?.status === "ACTIVE") return "ACTIVE";

  const target = Number(goal?.targetAmount) || 0;
  const current = Number(goal?.currentAmount) || 0;
  if (target > 0 && current >= target) return "COMPLETED";
  if (goal?.deadline && new Date(goal.deadline) < new Date()) return "MISSED";
  return "ACTIVE";
}

/* ------------------------------------------------------------------ */
/* Shared UI Components                                                */
/* ------------------------------------------------------------------ */
function GoalIcon({ type, size = 22, color = COLORS.primary }) {
  const Icon = ICONS[type] || PiggyBank;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

function ProgressBar({
  percent,
  height = 10,
  isMissed = false,
  isCompleted = false,
}) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{
        height,
        backgroundColor: isMissed
          ? "#FDEAE8"
          : isCompleted
            ? "#E7F8F0"
            : "#EDEAFB",
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, percent))}%`,
          background: isMissed
            ? COLORS.red
            : isCompleted
              ? COLORS.green
              : `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
        }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE: {
      label: "Active",
      bg: COLORS.amberBg,
      fg: COLORS.amber,
      icon: Clock,
    },
    COMPLETED: {
      label: "Completed",
      bg: COLORS.greenBg,
      fg: COLORS.green,
      icon: CheckCircle2,
    },
    MISSED: {
      label: "Missed",
      bg: COLORS.redBg,
      fg: COLORS.red,
      icon: AlertTriangle,
    },
  };
  const cfg = map[status] || map.ACTIVE;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
      } ${className}`}
      style={{
        backgroundColor: COLORS.primary,
        boxShadow: disabled ? "none" : "0 8px 20px -8px rgba(108,77,255,0.55)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = "", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-[#EFECFC] dark:bg-[#242430] text-[#6C4DFF] dark:text-[#A49DFF] ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:-translate-y-0.5 active:translate-y-0 hover:bg-purple-100 dark:hover:bg-[#2D2A3E]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function DangerButton({ children, onClick, className = "", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 bg-[#FCEAE8] dark:bg-rose-950/40 text-[#E0483C] dark:text-rose-400 border border-transparent dark:border-rose-900/50 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:-translate-y-0.5 active:translate-y-0 hover:bg-rose-100 dark:hover:bg-rose-900/60"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 dark:text-slate-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-150 border border-slate-200 dark:border-slate-700 bg-[#FBFAFE] dark:bg-[#242430] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#6C4DFF] dark:focus:border-[#6C4DFF]";

function TextInput(props) {
  return (
    <input {...props} className={`${inputClass} ${props.className || ""}`} />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-none ${props.className || ""}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Modal shell                                                         */
/* ------------------------------------------------------------------ */
function Modal({ open, onClose, children, maxWidth = 480 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/75 backdrop-blur-sm"
      style={{
        animation: "svg-fade-in 0.18s ease-out",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-white dark:bg-[#17171F] dark:border dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          maxWidth,
          animation: "svg-modal-in 0.22s cubic-bezier(0.16,1,0.3,1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes svg-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes svg-modal-in { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between px-7 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      >
        <X size={18} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Goal Card                                                           */
/* ------------------------------------------------------------------ */
function SavingGoalCard({ goal, onOpen, index }) {
  const percent = getProgress(goal);
  const status = getGoalStatus(goal);
  const isMissed = status === "MISSED";
  const isCompleted = status === "COMPLETED";

  return (
    <div
      onClick={() => onOpen(goal.id)}
      className={`w-full rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
        isMissed
          ? "border border-rose-200 bg-rose-50/20 hover:border-rose-300"
          : isCompleted
            ? "border border-emerald-200 bg-emerald-50/10 hover:border-emerald-300"
            : "border border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-700 dark:bg-[#17171F] dark:hover:border-indigo-400"
      }`}
      style={{
        boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)",
        animation: `svg-card-in 0.4s ease-out both`,
        animationDelay: `${index * 50}ms`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 14px 30px -10px rgba(76,60,140,0.22)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 2px 18px -6px rgba(76,60,140,0.10)")
      }
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex items-center gap-4 md:w-64 shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: isMissed
                ? "#FDEAE8"
                : isCompleted
                  ? "#E7F8F0"
                  : "#EFEAFF",
            }}
          >
            <GoalIcon
              type={goal.icon}
              color={
                isMissed
                  ? COLORS.red
                  : isCompleted
                    ? COLORS.green
                    : COLORS.primary
              }
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate text-slate-900 dark:text-white">
              {goal.title}
            </p>
            <p className="text-xs mt-0.5 text-slate-500">
              Target {formatCurrency(goal.targetAmount)}
            </p>
            <p
              className={`text-xs flex items-center gap-1 mt-0.5 ${
                isMissed ? "font-medium text-rose-600" : "text-slate-400"
              }`}
            >
              <Calendar size={11} /> {formatDate(goal.deadline)}
              {isMissed && " (Past Deadline)"}
            </p>
          </div>
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 text-xs font-medium">
            <span className="text-slate-500">
              Current {formatCurrency(goal.currentAmount)}
            </span>
            <span
              className={`font-semibold ${
                isMissed
                  ? "text-rose-600"
                  : isCompleted
                    ? "text-emerald-600"
                    : "text-indigo-600"
              }`}
            >
              {Math.round(percent)}%
            </span>
            <span className="text-slate-500">
              Target {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <ProgressBar
            percent={percent}
            isMissed={isMissed}
            isCompleted={isCompleted}
          />
        </div>

        {/* Right */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-40 shrink-0">
          <StatusBadge status={status} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(goal.id);
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold transition-transform duration-150 hover:translate-x-0.5 text-indigo-600"
          >
            View Details <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <style>{`@keyframes svg-card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty & Loading States                                              */
/* ------------------------------------------------------------------ */
function EmptyState({ status, onCreate, searchTerm }) {
  const isMissed = status === "MISSED";
  const isCompleted = status === "COMPLETED";

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{
          backgroundColor: isMissed
            ? "#FDEAE8"
            : isCompleted
              ? "#E7F8F0"
              : "#EFEAFF",
        }}
      >
        {isMissed ? (
          <AlertCircle size={36} color={COLORS.red} strokeWidth={1.6} />
        ) : isCompleted ? (
          <CheckCircle2 size={36} color={COLORS.green} strokeWidth={1.6} />
        ) : (
          <PiggyBank size={36} color={COLORS.primary} strokeWidth={1.6} />
        )}
      </div>
      <h3 className="text-lg font-bold mb-1.5 text-slate-900 dark:text-white">
        {searchTerm
          ? "No matching saving goals"
          : isMissed
            ? "No missed saving goals"
            : isCompleted
              ? "No completed saving goals yet"
              : "No active saving goals"}
      </h3>
      <p className="text-sm mb-6 max-w-sm text-slate-500 dark:text-slate-400">
        {searchTerm
          ? "Try adjusting your search keywords."
          : isMissed
            ? "Great job! All your active goals are currently on track."
            : isCompleted
              ? "Goals will appear here once you reach 100% of the target amount."
              : "Create your first saving goal to start tracking your deposits and progress."}
      </p>
      {status === "ACTIVE" && !searchTerm && (
        <PrimaryButton onClick={onCreate} className="px-7 py-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <Plus size={17} /> Create Saving Goal
          </span>
        </PrimaryButton>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <Loader2 size={36} className="animate-spin mb-3 text-indigo-600" />
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
        Loading saving goals...
      </p>
      <p className="text-xs mt-1 text-slate-400 dark:text-slate-400">
        Fetching latest data from server
      </p>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-900">
              Couldn't connect to server
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-sm hover:bg-rose-700 transition-colors"
          >
            <RefreshCw size={13} /> Retry
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Create Saving Goal Modal                                            */
/* ------------------------------------------------------------------ */
function CreateSavingGoalModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("piggy");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  function reset() {
    setTitle("");
    setIcon("piggy");
    setTarget("");
    setDate("");
    setDescription("");
    setValidationError("");
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    setValidationError("");
    const parsedTarget = parseFloat(target);
    if (!title.trim()) {
      setValidationError("Please enter a goal title.");
      return;
    }
    if (!target || isNaN(parsedTarget) || parsedTarget <= 0) {
      setValidationError(
        "Target amount must be a positive number greater than 0.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        icon,
        targetAmount: parsedTarget,
        currentAmount: 0,
        deadline: date || null,
        description: description.trim(),
      });
      reset();
    } catch (err) {
      Swal.fire({
        title: "Failed to create goal",
        text: err.message || "Please check your inputs and try again.",
        icon: "error",
        confirmButtonColor: COLORS.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Create Saving Goal"
        subtitle="Set up a new saving goal."
        onClose={handleClose}
      />
      <div className="px-7 pb-2 pt-3">
        {validationError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {validationError}
          </div>
        )}

        <Field label="Goal Title">
          <TextInput
            placeholder="e.g. Buy Laptop, Emergency Fund"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Icon Category">
          <div className="grid grid-cols-5 gap-2">
            {ICON_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = icon === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setIcon(opt.id)}
                  title={opt.label}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-600 dark:text-[#A49DFF] shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-[#FBFAFE] dark:bg-[#242430] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Target Amount ($)">
            <TextInput
              type="number"
              min="0.01"
              step="any"
              placeholder="$0.00"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </Field>
          <Field label="Target Date">
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Description (optional)">
          <TextArea
            rows={3}
            placeholder="Describe what success looks like for this goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Goal Type">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-not-allowed bg-[#6C4DFF] text-white">
            <Wallet size={15} /> Saving Goal
          </div>
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100 dark:border-slate-800">
        <GhostButton onClick={handleClose} disabled={submitting}>
          Cancel
        </GhostButton>
        <PrimaryButton
          onClick={handleSave}
          disabled={!title.trim() || !target || submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            "Save Goal"
          )}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Edit Goal Modal (ACTIVE goals only)                                 */
/* ------------------------------------------------------------------ */
function EditSavingGoalModal({ open, goal, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("piggy");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  React.useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setIcon(goal.icon || "piggy");
      setTarget(String(goal.targetAmount || ""));
      setDate(goal.deadline || "");
      setDescription(goal.description || "");
      setValidationError("");
    }
  }, [goal, open]);

  if (!goal) return null;

  async function handleSave() {
    setValidationError("");
    const parsedTarget = parseFloat(target);
    if (!title.trim()) {
      setValidationError("Goal title cannot be empty.");
      return;
    }
    if (!target || isNaN(parsedTarget) || parsedTarget <= 0) {
      setValidationError(
        "Target amount must be a positive number greater than 0.",
      );
      return;
    }
    const currentAmount = Number(goal.currentAmount) || 0;
    if (parsedTarget < currentAmount) {
      setValidationError(
        `Target amount cannot be less than already deposited amount (${formatCurrency(currentAmount)}).`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSave(goal.id, {
        title: title.trim(),
        icon,
        targetAmount: parsedTarget,
        deadline: date || null,
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      Swal.fire({
        title: "Failed to update goal",
        text: err.message || "Please check your inputs and try again.",
        icon: "error",
        confirmButtonColor: COLORS.primary,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader
        title="Edit Saving Goal"
        subtitle="Update the details of your active saving goal."
        onClose={onClose}
      />
      <div className="px-7 pb-2 pt-3">
        {validationError && (
          <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-400">
            {validationError}
          </div>
        )}

        <Field label="Goal Title">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <Field label="Icon Category">
          <div className="grid grid-cols-5 gap-2">
            {ICON_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = icon === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setIcon(opt.id)}
                  title={opt.label}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-600 dark:text-[#A49DFF] shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-[#FBFAFE] dark:bg-[#242430] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Target Amount ($)">
            <TextInput
              type="number"
              min="0.01"
              step="any"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </Field>
          <Field label="Deadline">
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Description">
          <TextArea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100 dark:border-slate-800">
        <GhostButton onClick={onClose} disabled={submitting}>
          Cancel
        </GhostButton>
        <PrimaryButton onClick={handleSave} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Deposit Modal (Strict Rules Handled)                                */
/* ------------------------------------------------------------------ */
function DepositModal({ open, goal, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState("Bank Transfer");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const current = Number(goal?.currentAmount) || 0;
  const target = Number(goal?.targetAmount) || 0;
  const remaining = Math.max(0, target - current);

  function reset() {
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setSource("Bank Transfer");
    setNotes("");
    setValidationError("");
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    setValidationError("");
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError("Deposit amount must be greater than $0.00.");
      return;
    }

    if (parsedAmount > remaining) {
      setValidationError(
        `Deposit amount cannot exceed the remaining target of ${formatCurrency(remaining)}. You can only add up to ${formatCurrency(remaining)}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        title: "Deposit",
        date,
        source: source.trim() || "Bank Transfer",
        amount: parsedAmount,
        notes: notes.trim(),
      });
      reset();
    } catch (err) {
      setValidationError(err.message || "Failed to record deposit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={450}>
      <ModalHeader
        title="Deposit Funds"
        subtitle={`Add money toward “${goal?.title || "goal"}”.`}
        onClose={handleClose}
      />
      <div className="px-7 pb-2 pt-3">
        {/* Remaining amount banner */}
        <div className="mb-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Remaining to complete:
          </span>
          <span className="text-indigo-700 dark:text-[#A49DFF] font-bold text-sm">
            {formatCurrency(remaining)}
          </span>
        </div>

        {validationError && (
          <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-400">
            {validationError}
          </div>
        )}

        <Field label="Deposit Amount ($)">
          <TextInput
            type="number"
            min="0.01"
            max={remaining}
            step="any"
            placeholder={`Max: ${formatCurrency(remaining)}`}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setValidationError("");
            }}
          />
          <span className="block mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Must be &gt; $0 and &le; {formatCurrency(remaining)} (No overflow).
          </span>
        </Field>

        <Field label="Deposit Date">
          <TextInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <Field label="Source / Method">
          <TextInput
            placeholder="e.g. Bank Transfer, Cash, Salary, Savings"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </Field>

        <Field label="Notes (optional)">
          <TextArea
            rows={2}
            placeholder="e.g. Monthly savings, side project reward..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100 dark:border-slate-800">
        <GhostButton onClick={handleClose} disabled={submitting}>
          Cancel
        </GhostButton>
        <PrimaryButton
          onClick={handleSave}
          disabled={!amount || remaining <= 0 || submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Recording...
            </>
          ) : (
            "Save Deposit"
          )}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Deposit History                                                     */
/* ------------------------------------------------------------------ */
function DepositHistory({ deposits = [] }) {
  const sorted = useMemo(
    () => [...deposits].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [deposits],
  );

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-3xl p-6 border border-[#ECE9F7] dark:border-slate-700 shadow-sm">
      <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
        Deposit History ({sorted.length})
      </h3>
      {sorted.length === 0 ? (
        <p className="text-sm py-8 text-center text-slate-400 dark:text-slate-500">
          No deposits recorded yet. Make a deposit to see your transaction
          history here.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((dep, i) => (
            <div
              key={dep.id || i}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              style={{
                animation: "svg-card-in 0.35s ease-out both",
                animationDelay: `${i * 30}ms`,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#EFEAFF] dark:bg-[#242430]">
                  <CreditCard size={16} color={COLORS.primary} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">
                    {dep.title || "Deposit"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {formatDate(dep.date)} &middot; {dep.source || "Deposit"}
                  </p>
                  {dep.notes && (
                    <p className="text-xs flex items-center gap-1 mt-0.5 text-slate-400 dark:text-slate-500">
                      <StickyNote size={10} /> {dep.notes}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold shrink-0 text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(dep.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Goal Detail (with Strict History / Read-Only Mode)                  */
/* ------------------------------------------------------------------ */
function SavingGoalDetail({ goal, onBack, onDeposit, onEdit, onDelete }) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const percent = getProgress(goal);
  const status = getGoalStatus(goal);
  const isCompleted = status === "COMPLETED";
  const isMissed = status === "MISSED";
  const isHistoryMode = isCompleted || isMissed;

  const current = Number(goal.currentAmount) || 0;
  const target = Number(goal.targetAmount) || 0;
  const remaining = Math.max(0, target - current);

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Delete this saving goal?",
      text: `Are you sure you want to delete “${goal.title}”? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: COLORS.red,
    });

    if (result.isConfirmed) {
      await onDelete(goal.id);
      Swal.fire({
        title: "Deleted!",
        text: `“${goal.title}” has been removed.`,
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  }

  return (
    <div style={{ animation: "svg-fade-in 0.25s ease-out" }}>
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-150 hover:-translate-x-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} /> Back to Saving Goals
        </button>
        <DangerButton onClick={handleDelete}>
          <Trash2 size={15} /> Delete Goal
        </DangerButton>
      </div>

      {/* History Mode Alerts */}
      {isMissed && (
        <div className="mb-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/40 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-rose-100 dark:bg-rose-900/60 p-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                Saving Goal Missed (History / Read-Only Mode)
              </h3>
              <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-400">
                This goal reached its deadline before meeting the target savings
                amount. It is now closed and in read-only mode. Deposits and
                editing are disabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/60 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Saving Goal Completed! 🎉
              </h3>
              <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                Congratulations! You fully funded this goal. It is archived in
                history mode. Deposits and editing are closed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary card */}
      <div
        className={`rounded-3xl p-8 mb-6 bg-white dark:bg-[#17171F] ${
          isMissed
            ? "border border-rose-200 dark:border-rose-900/50"
            : isCompleted
              ? "border border-emerald-200 dark:border-emerald-900/50"
              : "border border-slate-200 dark:border-slate-700"
        } shadow-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isMissed
                  ? "#FDEAE8"
                  : isCompleted
                    ? "#E7F8F0"
                    : "#EFEAFF",
              }}
            >
              <GoalIcon
                type={goal.icon}
                size={26}
                color={
                  isMissed
                    ? COLORS.red
                    : isCompleted
                      ? COLORS.green
                      : COLORS.primary
                }
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {goal.title}
              </h2>
              <p
                className={`text-sm mt-0.5 flex items-center gap-1 ${
                  isMissed
                    ? "font-medium text-rose-600 dark:text-rose-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Calendar size={12} /> Due {formatDate(goal.deadline)}
                {isMissed && " (Past Deadline)"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <span
              className={`text-3xl font-extrabold ${
                isMissed
                  ? "text-rose-600 dark:text-rose-400"
                  : isCompleted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-indigo-600 dark:text-[#A49DFF]"
              }`}
            >
              {Math.round(percent)}%
            </span>
          </div>
        </div>

        {goal.description && (
          <p className="text-sm mb-6 text-slate-600 dark:text-slate-300">
            {goal.description}
          </p>
        )}

        <ProgressBar
          percent={percent}
          height={14}
          isMissed={isMissed}
          isCompleted={isCompleted}
        />

        <div className="flex items-center justify-between mt-2 mb-7 text-sm font-medium">
          <span className="text-slate-900 dark:text-white">
            {formatCurrency(current)} saved
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {isCompleted
              ? "Target Reached! 🚀"
              : isMissed
                ? `${formatCurrency(remaining)} remaining (Missed)`
                : `${formatCurrency(remaining)} left`}
          </span>
          <span className="text-slate-900 dark:text-white">
            {formatCurrency(target)} target
          </span>
        </div>

        {/* Action Buttons: Strict History Rule */}
        <div className="flex flex-wrap items-center gap-3">
          {!isHistoryMode ? (
            <>
              <SecondaryButton onClick={() => setEditOpen(true)}>
                Edit Goal
              </SecondaryButton>
              <PrimaryButton onClick={() => setDepositOpen(true)}>
                Deposit Now
              </PrimaryButton>
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Lock size={14} /> History Mode (Read-Only)
            </div>
          )}
        </div>
      </div>

      <DepositHistory deposits={goal.deposits || []} />

      {!isHistoryMode && (
        <>
          <DepositModal
            open={depositOpen}
            goal={goal}
            onClose={() => setDepositOpen(false)}
            onSave={async (dep) => {
              await onDeposit(goal.id, dep);
              setDepositOpen(false);
              Swal.fire({
                title: "Deposit Recorded! 💰",
                text: `Added ${formatCurrency(dep.amount)} to “${goal.title}”.`,
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
              });
            }}
          />
          <EditSavingGoalModal
            open={editOpen}
            goal={goal}
            onClose={() => setEditOpen(false)}
            onSave={async (id, updates) => {
              await onEdit(id, updates);
              setEditOpen(false);
              Swal.fire({
                title: "Goal Updated! ✨",
                text: "Your changes have been saved successfully.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
              });
            }}
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Savings Tab Page                                              */
/* ------------------------------------------------------------------ */
export default function SavingsPage() {
  const {
    goals,
    allGoals,
    counts,
    loading,
    error,
    status,
    setStatus,
    selectedGoal,
    setSelectedGoalId,
    fetchGoals,
    createGoal,
    updateGoal,
    removeGoal,
    depositFunds,
  } = useSavingGoals("ACTIVE");

  const [createOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const queryGoalId = searchParams.get("goalId");

  useEffect(() => {
    if (
      queryGoalId &&
      (allGoals || []).some((g) => String(g.id) === String(queryGoalId))
    ) {
      setSelectedGoalId(queryGoalId);
    }
  }, [queryGoalId, allGoals, setSelectedGoalId]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredGoals = normalizedSearch
    ? goals.filter((g) => g.title.toLowerCase().includes(normalizedSearch))
    : goals;

  async function handleCreate(goalData) {
    const created = await createGoal(goalData);
    setCreateOpen(false);
    Swal.fire({
      title: "Saving Goal Created! 🎉",
      text: `“${created.title}” is ready to track.`,
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  }

  return (
    <div className="goal-saving-page min-h-screen w-full bg-[#F8F7FC] dark:bg-[#0F0F14]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {selectedGoal ? (
          <SavingGoalDetail
            goal={selectedGoal}
            onBack={() => setSelectedGoalId(null)}
            onDeposit={depositFunds}
            onEdit={updateGoal}
            onDelete={removeGoal}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Savings Goals
                </h1>
                <p className="text-sm mt-1 text-slate-500">
                  Track your personal saving targets and monitor deposit
                  progress.
                </p>
              </div>
              <PrimaryButton onClick={() => setCreateOpen(true)}>
                <span className="inline-flex items-center gap-2">
                  <Plus size={17} /> Create Saving Goal
                </span>
              </PrimaryButton>
            </div>

            {/* 3-Tab Status Navigation */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
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
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isMissedTab && count > 0
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saving goal title..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-[#17171F] dark:text-white"
              />
            </div>

            {error && <ErrorBanner message={error} onRetry={fetchGoals} />}

            {/* List / Loading / Empty */}
            {loading ? (
              <div
                className="bg-white rounded-3xl dark:bg-[#17171F]"
                style={{
                  boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <LoadingState />
              </div>
            ) : filteredGoals.length === 0 ? (
              <div
                className="bg-white rounded-3xl dark:bg-[#17171F]"
                style={{
                  boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <EmptyState
                  status={status}
                  onCreate={() => setCreateOpen(true)}
                  searchTerm={searchTerm}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredGoals.map((goal, i) => (
                  <SavingGoalCard
                    key={goal.id}
                    goal={goal}
                    onOpen={setSelectedGoalId}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateSavingGoalModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <style>{`
        @keyframes svg-fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
