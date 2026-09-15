import React, { useState, useEffect } from "react";
import {
  X,
  Laptop,
  Plane,
  Car,
  PiggyBank,
  Target,
  Loader2,
  Calendar,
  CreditCard,
  StickyNote,
} from "lucide-react";
import Swal from "sweetalert2";

export const SAVING_ICON_OPTIONS = [
  { id: "piggy", label: "Piggy Bank", icon: PiggyBank },
  { id: "laptop", label: "Laptop / Tech", icon: Laptop },
  { id: "plane", label: "Travel / Trip", icon: Plane },
  { id: "car", label: "Vehicle", icon: Car },
  { id: "target", label: "General Target", icon: Target },
];

function formatCurrency(n) {
  return (
    "$" +
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
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

/* ------------------------------------------------------------------ */
/* 1. Create Saving Goal Modal                                         */
/* ------------------------------------------------------------------ */
export function CreateSavingGoalModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("piggy");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetNum = parseFloat(targetAmount);
    if (!title.trim()) {
      setError("Please enter a goal title");
      return;
    }
    if (!targetNum || targetNum <= 0) {
      setError("Please enter a valid target amount greater than $0");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        title: title.trim(),
        icon,
        targetAmount: targetNum,
        currentAmount: 0,
        deadline: deadline || null,
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create saving goal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Saving Goal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set a target amount and deadline for your future goal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              placeholder="e.g. New Laptop, Emergency Fund, Summer Vacation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SAVING_ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setIcon(opt.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF]"
                        : "border-slate-200 dark:border-[#2A2A38] text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <IconComp size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="1500.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Saving for M3 MacBook Pro 16GB"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title || !targetAmount}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Create Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Edit Saving Goal Modal                                           */
/* ------------------------------------------------------------------ */
export function EditSavingGoalModal({ open, goal, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("piggy");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setIcon(goal.icon || "piggy");
      setTargetAmount(String(goal.targetAmount || ""));
      setDeadline(goal.deadline || "");
      setDescription(goal.description || "");
    }
  }, [goal]);

  if (!open || !goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetNum = parseFloat(targetAmount);
    if (!title.trim()) {
      setError("Please enter a goal title");
      return;
    }
    if (!targetNum || targetNum <= 0) {
      setError("Target amount must be greater than $0");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(goal.id, {
        title: title.trim(),
        icon,
        targetAmount: targetNum,
        deadline: deadline || null,
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update saving goal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Saving Goal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update details or adjust target amount
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SAVING_ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setIcon(opt.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF]"
                        : "border-slate-200 dark:border-[#2A2A38] text-slate-500"
                    }`}
                  >
                    <IconComp size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Deposit to Saving Goal Modal                                     */
/* ------------------------------------------------------------------ */
export function DepositSavingGoalModal({ open, goal, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState("Bank Transfer");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !goal) return null;

  const current = Number(goal.currentAmount || 0);
  const target = Number(goal.targetAmount || 0);
  const remaining = Math.max(0, target - current);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const depositNum = parseFloat(amount);
    if (!depositNum || depositNum <= 0) {
      setError("Please enter a valid deposit amount greater than $0");
      return;
    }
    if (depositNum > remaining) {
      setError(`Deposit cannot exceed remaining target of ${formatCurrency(remaining)}`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(goal.id, {
        title: "Deposit",
        date: date || new Date().toISOString().slice(0, 10),
        source: source.trim() || "Salary",
        amount: depositNum,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to record deposit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-md my-auto flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Add Deposit to “{goal.title}”
            </h2>
            <p className="text-xs text-slate-400">
              Contribute funds toward this goal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-[#1E1B2E]/70 border border-purple-100 dark:border-[#2A2440] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Remaining Target:
            </span>
            <span className="font-extrabold text-[#6C63FF] dark:text-[#A49DFF] tabular-nums text-sm">
              {formatCurrency(remaining)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deposit Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                max={remaining}
                step="0.01"
                placeholder={`Max: ${remaining.toFixed(2)}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-base font-bold border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deposit Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Source
              </label>
              <input
                type="text"
                placeholder="e.g. Salary, Side gig"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly contribution"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !amount || remaining <= 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Confirm Deposit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Saving Goal History / Details Modal                              */
/* ------------------------------------------------------------------ */
export function SavingGoalHistoryModal({ open, goal, onClose }) {
  if (!open || !goal) return null;

  const deposits = goal.deposits || [];
  const percent =
    goal.targetAmount > 0
      ? Math.min(100, Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100))
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {goal.title} — Deposit History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} ({percent}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-3">
          {deposits.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No deposits recorded yet for this goal.
            </div>
          ) : (
            deposits.map((dep, idx) => (
              <div
                key={dep.id || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#2A2A38]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
                    <CreditCard size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {dep.title || "Deposit"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(dep.date)} • {dep.source || "Transfer"}
                    </p>
                    {dep.notes && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {dep.notes}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{formatCurrency(dep.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end px-6 py-3 border-t border-slate-100 dark:border-[#1E1B2E]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E1B2E]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
