// src/features/goal/components/TripTab.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  X,
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  TrendingUp,
  Compass,
  Sparkles,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Pencil,
} from "lucide-react";
import { useTripGoals } from "../hooks/useTripGoals";
import { isDeadlinePassed } from "../utils/goalHelpers";

// ---------- Static config ----------

const STATUS_TABS = [
  { id: "ACTIVE", label: "Active", icon: Clock },
  { id: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { id: "MISSED", label: "Missed", icon: AlertCircle },
];

const GOAL_TYPES = [{ id: "trip", label: "Trip", icon: Compass }];

const GRADIENTS = [
  "from-violet-600 via-purple-600 to-fuchsia-500",
  "from-sky-600 via-blue-600 to-cyan-400",
  "from-emerald-600 via-teal-500 to-cyan-400",
  "from-orange-500 via-amber-500 to-yellow-400",
  "from-indigo-700 via-violet-600 to-purple-500",
];

function daysLeft(dateStr) {
  if (!dateStr) return 0;
  const target = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function fmtMoney(n) {
  return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtDate(dateStr) {
  if (!dateStr) return "No date set";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function gradientFor(id) {
  return GRADIENTS[(Number(id) || 0) % GRADIENTS.length];
}

function typeMeta(typeId) {
  return GOAL_TYPES.find((t) => t.id === typeId) || GOAL_TYPES[0];
}

// ---------- Progress bar ----------

function ProgressBar({ percent, size = "md" }) {
  const h = size === "lg" ? "h-3" : "h-2";
  const capped = Math.min(100, Math.max(0, percent || 0));
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`bg-gradient-to-r from-violet-500 to-fuchsia-500 ${h} rounded-full transition-all duration-500`}
        style={{ width: `${capped}%` }}
      />
    </div>
  );
}

// ---------- Create / Edit Modal ----------

function GoalModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [target, setTarget] = useState(initial?.target ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline || "");
  const type = initial?.type || "trip";
  const [description, setDescription] = useState(initial?.description || "");
  const [imageMode, setImageMode] = useState("file");
  const [imageUrl, setImageUrl] = useState(
    typeof initial?.image === "string" && !initial.image.startsWith("blob:")
      ? initial.image
      : "",
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUrlBlur = () => {
    if (imageUrl.trim()) {
      setPreview(imageUrl.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a destination or trip name.");
      return;
    }
    const numTarget = Number(target);
    if (!numTarget || numTarget <= 0) {
      setError("Target amount must be greater than $0.");
      return;
    }
    if (!deadline) {
      setError("Please select a target deadline.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("target", numTarget);
      formData.append("deadline", deadline);
      formData.append("type", type);
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (imageMode === "file" && imageFile) {
        formData.append("file", imageFile);
      } else if (imageMode === "url" && imageUrl.trim()) {
        formData.append("imageUrl", imageUrl.trim());
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to save trip goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg my-auto rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              ✈️
            </div>
            <h2 className="font-bold text-slate-800 text-lg">
              {initial ? "Edit Trip Goal" : "New Trip Goal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4 overflow-y-auto"
        >
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Destination / Goal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tokyo Sakura Season"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Budget ($) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="2500"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Date *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Description / Itinerary Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Flights, hotels, pocket money notes..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Cover Photo
              </label>
              <div className="flex gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageMode("file")}
                  className={`px-2 py-0.5 rounded-md ${
                    imageMode === "file"
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-2 py-0.5 rounded-md ${
                    imageMode === "url"
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageMode === "file" ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-violet-400 hover:bg-violet-50/20 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500 font-medium">
                  {imageFile ? imageFile.name : "Click to select a photo"}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            )}

            {preview && (
              <div className="mt-2 relative rounded-xl overflow-hidden h-28 border border-slate-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreview("")}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setImageFile(null);
                    setImageUrl("");
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? "Save Changes" : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Confirm Delete Modal ----------

function ConfirmDelete({ goalName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Delete Trip Goal?
        </h3>
        <p className="text-xs text-slate-500">
          Are you sure you want to delete &ldquo;{goalName}&rdquo;? All saved
          progress for this trip will be removed.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
          >
            Delete Goal
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Goal Card Component ----------

function GoalCard({ goal, onOpen }) {
  const pct = Math.round(((goal.saved || 0) / (goal.target || 1)) * 100) || 0;
  const left = daysLeft(goal.deadline);
  const isMissed = isDeadlinePassed(goal.deadline) && pct < 100;
  const isCompleted = pct >= 100;
  const gradient = gradientFor(goal.id);
  const Icon = typeMeta(goal.type).icon;

  return (
    <div
      onClick={() => onOpen(goal.id)}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-100 flex flex-col cursor-pointer"
    >
      <div
        className={`h-36 relative bg-gradient-to-br ${gradient} flex items-end p-4 overflow-hidden`}
      >
        {goal.image ? (
          <>
            <img
              src={goal.image}
              alt={goal.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <Icon
            className="w-8 h-8 text-white/50 absolute top-4 left-4"
            strokeWidth={1.5}
          />
        )}

        <div className="relative text-white">
          <span
            className={`text-[10px] font-semibold backdrop-blur px-2 py-0.5 rounded-full ${
              isCompleted
                ? "bg-emerald-500/80 text-white"
                : isMissed
                  ? "bg-rose-500/80 text-white"
                  : "bg-white/20 text-white"
            }`}
          >
            {isCompleted ? "Completed" : isMissed ? "Missed" : "Active"}
          </span>
          <h3 className="font-bold text-base mt-1 line-clamp-1 drop-shadow-sm">
            {goal.name}
          </h3>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold text-slate-700">
              ${fmtMoney(goal.saved)}
            </span>
            <span className="text-xs text-slate-400">
              of ${fmtMoney(goal.target)}
            </span>
          </div>
          <ProgressBar percent={pct} />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {fmtDate(goal.deadline)}
          </span>
          <span
            className={`flex items-center gap-1 font-medium ${
              isMissed
                ? "text-rose-500"
                : isCompleted
                  ? "text-emerald-600"
                  : "text-slate-600"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isCompleted ? "Reached!" : isMissed ? "Past Due" : `${left}d left`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Placeholder Create Card ----------

function NewGoalCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-slate-200 hover:border-violet-400 hover:bg-violet-50/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors min-h-[220px]"
    >
      <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
        <Plus className="w-5 h-5" />
      </div>
      <p className="font-semibold text-slate-700 text-sm">Add New Trip</p>
      <p className="text-xs text-slate-400 text-center max-w-[160px]">
        Set budget, target date, and upload cover photo.
      </p>
    </div>
  );
}

// ---------- Detail View ----------

function GoalDetail({ goal, onBack, onEdit, onDelete, onDeposit }) {
  const [amount, setAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const pct = Math.round(((goal.saved || 0) / (goal.target || 1)) * 100) || 0;
  const remaining = Math.max(0, goal.target - goal.saved);
  const left = daysLeft(goal.deadline);
  const isMissed = isDeadlinePassed(goal.deadline) && pct < 100;
  const isCompleted = pct >= 100;
  const isReadOnly = isMissed || isCompleted;

  const gradient = gradientFor(goal.id);
  const Icon = typeMeta(goal.type).icon;

  async function handleDeposit() {
    if (isReadOnly) return;
    const val = Number(amount);
    if (!val || val <= 0) {
      setDepositError("Enter an amount greater than 0.");
      return;
    }
    if (val > remaining) {
      setDepositError(`Maximum allowed deposit is $${fmtMoney(remaining)}.`);
      return;
    }
    try {
      setDepositing(true);
      await onDeposit(goal.id, val);
      setAmount("");
      setDepositError("");
    } catch (err) {
      setDepositError(err.message || "Deposit failed");
    } finally {
      setDepositing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Trip Savings
      </button>

      {isMissed && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-900">
                  Trip Goal Deadline Passed (Missed)
                </h3>
                <p className="mt-0.5 text-xs text-rose-700">
                  This trip goal is locked because its target date has passed.
                  Deposits are disabled. Extend the deadline to reactivate.
                </p>
              </div>
            </div>
            <button
              onClick={() => onEdit(goal)}
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" /> Extend Deadline
            </button>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-900">
                Trip Goal Completed! 🎉
              </h3>
              <p className="mt-0.5 text-xs text-emerald-700">
                Congratulations! You saved the full budget for this trip. This
                goal is preserved in read-only history mode.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div
          className={`relative h-48 bg-gradient-to-br ${gradient} flex items-end p-6 overflow-hidden`}
        >
          {goal.image ? (
            <>
              <img
                src={goal.image}
                alt={goal.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </>
          ) : (
            <Icon
              className="w-10 h-10 text-white/60 absolute top-5 left-6"
              strokeWidth={1.5}
            />
          )}
          <div className="relative text-white">
            <span
              className={`text-xs font-semibold backdrop-blur px-2.5 py-1 rounded-full ${
                isCompleted
                  ? "bg-emerald-500/80 text-white"
                  : isMissed
                    ? "bg-rose-500/80 text-white"
                    : "bg-white/20 text-white"
              }`}
            >
              {isCompleted
                ? "Goal Reached"
                : isMissed
                  ? "Missed"
                  : "In Progress"}
            </span>
            <h1 className="text-2xl font-bold mt-2">{goal.name}</h1>
          </div>
          <div className="relative ml-auto flex gap-2">
            {!isCompleted && (
              <button
                onClick={() => onEdit(goal)}
                title={isMissed ? "Extend deadline" : "Edit goal"}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setConfirmingDelete(true)}
              title="Delete goal"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {goal.description && (
            <p className="text-sm text-slate-500">{goal.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400">Target</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                ${fmtMoney(goal.target)}
              </div>
            </div>
            <div className="bg-violet-50 rounded-xl p-4">
              <div className="text-xs text-violet-400">Saved</div>
              <div className="text-lg font-bold text-violet-700 mt-1">
                ${fmtMoney(goal.saved)}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400">Remaining</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                ${fmtMoney(remaining)}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Progress</span>
              <span
                className={`font-semibold ${
                  isCompleted
                    ? "text-emerald-600"
                    : isMissed
                      ? "text-rose-600"
                      : "text-violet-600"
                }`}
              >
                {pct}%
              </span>
            </div>
            <ProgressBar percent={pct} size="lg" />
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {fmtDate(goal.deadline)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isCompleted
                  ? "Completed"
                  : isMissed
                    ? "Past deadline"
                    : `${left} days left`}
              </span>
            </div>
          </div>

          {/* Deposit section */}
          {!isReadOnly ? (
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                <h3 className="font-semibold text-slate-800 text-sm">
                  Deposit Money
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={remaining}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Amount to add (max $${fmtMoney(remaining)})`}
                    className="w-full rounded-lg border border-slate-200 pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={depositing}
                  className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  {depositing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Funds
                </button>
              </div>
              {depositError && (
                <p className="text-xs text-rose-500 mt-2">{depositError}</p>
              )}
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>
                {isCompleted
                  ? "This goal has reached 100% of its budget. Deposits are closed."
                  : "This goal has passed its deadline. Deposits are locked."}
              </span>
            </div>
          )}
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDelete
          goalName={goal.name}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={async () => {
            setConfirmingDelete(false);
            await onDelete(goal.id);
          }}
        />
      )}
    </div>
  );
}

// ---------- Main TripTab Component ----------

export default function TripTab() {
  const {
    goals,
    allGoals,
    counts,
    status,
    setStatus,
    loading,
    error,
    createGoal,
    updateGoal,
    depositFunds,
    deleteGoal,
  } = useTripGoals("ACTIVE");

  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [searchParams] = useSearchParams();
  const queryGoalId = searchParams.get("goalId");

  useEffect(() => {
    if (
      queryGoalId &&
      (allGoals || []).some((g) => String(g.id) === String(queryGoalId))
    ) {
      setSelectedId(queryGoalId);
      setView("detail");
    }
  }, [queryGoalId, allGoals]);

  const selectedGoal =
    (allGoals || []).find((g) => String(g.id) === String(selectedId)) || null;

  function openCreate() {
    setEditingGoal(null);
    setModalMode("create");
  }

  function openEdit(goal) {
    setEditingGoal(goal);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingGoal(null);
  }

  async function handleSave(data) {
    if (modalMode === "edit" && editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal(data);
    }
  }

  async function handleDelete(id) {
    await deleteGoal(id);
    if (selectedId === id) {
      setSelectedId(null);
      setView("list");
    }
  }

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading trip goals...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10">
      {error && (
        <div className="max-w-5xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm">
          {error}
        </div>
      )}

      {view === "list" && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-violet-600 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> ADVENTURE AWAITS
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Your Trip Savings
              </h1>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Create Trip Goal
            </button>
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
                  onClick={() => setStatus(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? isMissedTab
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-violet-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
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

          {goals.length === 0 ? (
            <div className="max-w-sm mx-auto mt-12 text-center">
              {status === "ACTIVE" ? (
                <NewGoalCard onClick={openCreate} />
              ) : (
                <div className="py-12 px-6 rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
                  <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">
                    No {status.toLowerCase()} trip goals
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {status === "COMPLETED"
                      ? "Trips you reach 100% savings for will appear here."
                      : "Trips past their deadline will appear here."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map((g) => (
                <GoalCard key={g.id} goal={g} onOpen={openDetail} />
              ))}
              {status === "ACTIVE" && <NewGoalCard onClick={openCreate} />}
            </div>
          )}
        </div>
      )}

      {view === "detail" && selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          onBack={() => setView("list")}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDeposit={depositFunds}
        />
      )}

      {modalMode && (
        <GoalModal
          initial={editingGoal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
