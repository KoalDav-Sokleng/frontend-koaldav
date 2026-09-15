import { useState } from "react";
import {
  X,
  Wallet,
  Target,
  Loader2,
  AlertTriangle,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../../../context/ThemeContext";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Education",
  "Health",
  "Other",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "💡",
  Education: "📚",
  Health: "💊",
  Other: "📦",
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export default function AddExpenseModal({
  onClose,
  onSubmit,
  wallets = [],
  budgets = [],
  onOpenTopUp,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const defaultWallet = wallets.find((w) => w.isDefault) || wallets[0];
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: getTodayDate(),
    note: "",
    walletId: defaultWallet ? String(defaultWallet.id) : "",
    budgetId: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const amountNum = parseFloat(form.amount) || 0;
  const selectedWallet = wallets.find(
    (w) => String(w.id) === String(form.walletId),
  );
  const selectedBudget = budgets.find(
    (b) => String(b.id) === String(form.budgetId),
  );

  // Wallet balance calculation
  const walletBalance = selectedWallet
    ? Number(selectedWallet.balance || 0)
    : null;
  const isInsufficientWallet =
    selectedWallet && amountNum > 0 && walletBalance < amountNum;

  // Budget calculations
  const budgetLimit = selectedBudget
    ? Number(selectedBudget.limitAmount || 0)
    : 0;
  const currentSpent = selectedBudget
    ? Number(selectedBudget.spentAmount || 0)
    : 0;
  const newSpent = currentSpent + amountNum;
  const budgetPercent =
    budgetLimit > 0 ? Math.round((newSpent / budgetLimit) * 100) : 0;
  const isOverBudget =
    selectedBudget && amountNum > 0 && newSpent > budgetLimit;
  const isNearBudget =
    selectedBudget && amountNum > 0 && budgetPercent >= 80 && !isOverBudget;

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(amountNum) || amountNum <= 0)
      e.amount = "Enter a valid amount greater than 0";
    if (!form.category) e.category = "Pick a category";
    return e;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const eMap = validate();
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      return;
    }

    // ── 1. Check Insufficient Wallet Balance ──
    if (isInsufficientWallet) {
      const shortage = amountNum - walletBalance;
      const result = await Swal.fire({
        title: "⚠️ Insufficient Wallet Balance!",
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: ${isDark ? "#CBD5E1" : "#475569"};">
            <p style="margin-bottom: 8px;">
              You are recording an expense of <b style="color:${isDark ? "#fff" : "#111827"};">$${amountNum.toFixed(2)}</b> from <b>${selectedWallet.name}</b>, but its balance is only <b style="color: #F43F5E;">$${walletBalance.toFixed(2)}</b>.
            </p>
            <div style="background: ${isDark ? "#26161C" : "#FFF1F2"}; border: 1px solid ${isDark ? "#881337" : "#FECDD3"}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Current Balance:</span> <b>$${walletBalance.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Required Amount:</span> <b>$${amountNum.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between; color: #F43F5E; font-weight: bold;">
                <span>Shortage:</span> <span>-$${shortage.toFixed(2)}</span>
              </div>
            </div>
            <p style="margin-bottom: 0; font-size: 12px;">
              Please top up your wallet first before completing this transaction.
            </p>
          </div>
        `,
        icon: "error",
        iconColor: "#F43F5E",
        showCancelButton: true,
        confirmButtonText: "💳 Top Up Wallet Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        background: isDark ? "#17171F" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-700",
        },
      });

      if (result.isConfirmed) {
        onClose();
        onOpenTopUp?.(selectedWallet);
      }
      return;
    }

    // ── 2. Check Over-Budget (>100% Red Danger Alert) ──
    if (isOverBudget) {
      const overAmount = newSpent - budgetLimit;
      const result = await Swal.fire({
        title: "🚨 Over-Budget Alert!",
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: ${isDark ? "#CBD5E1" : "#475569"};">
            <p style="margin-bottom: 8px;">
              This expense of <b style="color:${isDark ? "#fff" : "#111827"};">$${amountNum.toFixed(2)}</b> will exceed your <b>${selectedBudget.name}</b> limit by <b style="color: #F43F5E;">$${overAmount.toFixed(2)}</b> (${budgetPercent}% used).
            </p>
            <div style="background: ${isDark ? "#26161C" : "#FFF1F2"}; border: 1px solid ${isDark ? "#881337" : "#FECDD3"}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Current Spent:</span> <b>$${currentSpent.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Budget Limit:</span> <b>$${budgetLimit.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between; color: #F43F5E; font-weight: bold;">
                <span>Projected Spent:</span> <span>$${newSpent.toFixed(2)} (${budgetPercent}%)</span>
              </div>
            </div>
            <p style="margin-bottom: 0; font-size: 12px;">
              You can Top Up your wallet/budget first to stay financially safe, or proceed anyway.
            </p>
          </div>
        `,
        icon: "error",
        iconColor: "#F43F5E",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "💳 Top Up Wallet First",
        denyButtonText: "Proceed Anyway",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#10B981",
        denyButtonColor: "#F43F5E",
        cancelButtonColor: "#6B7280",
        background: isDark ? "#17171F" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-700",
        },
      });

      if (result.isConfirmed) {
        onClose();
        onOpenTopUp?.(selectedWallet || wallets[0]);
        return;
      }
      if (!result.isDenied) {
        return; // User clicked Cancel
      }
      // If user clicked 'Proceed Anyway' (isDenied), continue saving
    }

    // ── 3. Check Near Budget (80%-100% Yellow Warning Alert) ──
    if (isNearBudget) {
      const remainingAfter = Math.max(0, budgetLimit - newSpent);
      const result = await Swal.fire({
        title: "⚠️ Approaching Budget Limit!",
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: ${isDark ? "#CBD5E1" : "#475569"};">
            <p style="margin-bottom: 8px;">
              Adding this expense of <b style="color:${isDark ? "#fff" : "#111827"};">$${amountNum.toFixed(2)}</b> will use <b style="color: #D97706;">${budgetPercent}%</b> of your <b>${selectedBudget.name}</b> cap.
            </p>
            <div style="background: ${isDark ? "#2A2011" : "#FEF3C7"}; border: 1px solid ${isDark ? "#78350F" : "#FDE68A"}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Budget Limit:</span> <b>$${budgetLimit.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>New Total Spent:</span> <b style="color: #D97706;">$${newSpent.toFixed(2)}</b>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Remaining Cushion:</span> <b style="color: #059669;">$${remainingAfter.toFixed(2)}</b>
              </div>
            </div>
            <p style="margin-bottom: 0; font-size: 12px;">
              You are almost out of budget for this category. Do you want to proceed or top up first?
            </p>
          </div>
        `,
        icon: "warning",
        iconColor: "#F59E0B",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Record Expense",
        denyButtonText: "💳 Top Up Wallet First",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#6C63FF",
        denyButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        background: isDark ? "#17171F" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-700",
        },
      });

      if (result.isDenied) {
        onClose();
        onOpenTopUp?.(selectedWallet || wallets[0]);
        return;
      }
      if (!result.isConfirmed) {
        return; // User canceled
      }
    }

    setSubmitting(true);
    try {
      await onSubmit?.(form);
      setSubmitted(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setErrors({ server: err?.message || "Failed to record expense" });
    } finally {
      setSubmitting(false);
    }
  }

  function field(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-match budget if category changed and user hasn't explicitly selected one
      if (key === "category") {
        const matchingBudget = budgets.find((b) => b.category === value);
        if (matchingBudget) {
          next.budgetId = String(matchingBudget.id);
        }
      }
      return next;
    });
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      delete next.server;
      return next;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/50 dark:bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-[#ECEBF5] dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#F0EEFF] dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Add Expense
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
              Record a transaction from a wallet & budget
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[#1E1B2E] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-[#EDE9FE] dark:bg-[#1E1B2E]">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Expense Recorded!
            </p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-400">
              {CATEGORY_ICONS[form.category]} {form.title} — $
              {parseFloat(form.amount || 0).toFixed(2)}
            </p>
          </div>
        ) : (
          /* Scrollable Form Body */
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
          >
            {errors.server && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.server}
              </div>
            )}

            {/* Live Visual Alert Banners */}
            {isInsufficientWallet && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3 text-xs text-rose-700 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>
                    <strong>Wallet Shortage:</strong> Balance is $
                    {walletBalance.toFixed(2)} (needs $
                    {(amountNum - walletBalance).toFixed(2)} more).
                  </span>
                </div>
                {onOpenTopUp && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTopUp(selectedWallet);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
                  >
                    <PlusCircle size={12} /> Top Up
                  </button>
                )}
              </div>
            )}

            {isOverBudget && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertTriangle size={16} className="shrink-0 text-rose-600" />
                <span>
                  <strong>🚨 Over Budget Warning:</strong> Exceeds{" "}
                  {selectedBudget.name} cap by $
                  {(newSpent - budgetLimit).toFixed(2)} ({budgetPercent}% used).
                  Please top up wallet or adjust limit.
                </span>
              </div>
            )}

            {isNearBudget && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle size={16} className="shrink-0 text-amber-600" />
                <span>
                  <strong>⚠️ Warning:</strong> Reaching {budgetPercent}% of{" "}
                  {selectedBudget.name} budget (${newSpent.toFixed(2)} / $
                  {budgetLimit.toFixed(2)}).
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Expense Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch at Cafe, Grab Ride, Supermarket"
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                  errors.title
                    ? "border border-red-500"
                    : "border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF]"
                }`}
                autoFocus
              />
              {errors.title && (
                <p className="text-xs mt-1 text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Amount ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => field("amount", e.target.value)}
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white ${
                      errors.amount
                        ? "border border-red-500"
                        : "border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF]"
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs mt-1 text-red-500">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => field("date", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF]"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => field("category", cat)}
                    className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                      form.category === cat
                        ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] font-bold"
                        : "border-[#ECEBF5] dark:border-[#2A2A38] bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-700 dark:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-xs truncate">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Selector & Budget Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Wallet Picker */}
              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Wallet size={13} className="text-[#6C63FF]" /> Pay From
                  Wallet
                </label>
                <select
                  value={form.walletId}
                  onChange={(e) => field("walletId", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF] cursor-pointer"
                >
                  <option value="">-- No specific wallet --</option>
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (${Number(w.balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Picker */}
              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Target size={13} className="text-[#6C63FF]" /> Track in
                  Budget
                </label>
                <select
                  value={form.budgetId}
                  onChange={(e) => field("budgetId", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF] cursor-pointer"
                >
                  <option value="">-- None / General Expense --</option>
                  {budgets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (${Number(b.spentAmount || 0).toFixed(2)}/ $
                      {Number(b.limitAmount || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note / Description */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Additional details about this transaction..."
                value={form.note}
                onChange={(e) => field("note", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-[#ECEBF5] dark:border-[#2A2A38] focus:border-[#6C63FF] resize-none"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EEFF] dark:border-[#1E1B2E]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                <span>Record Expense</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
