import React, { useState, useEffect } from "react";
import { X, Wallet, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { getWallets, getBudgets } from "../api/financeApi";

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
  wallets: initialWallets,
  budgets: initialBudgets,
  onOpenDeposit,
}) {
  const [wallets, setWallets] = useState(initialWallets || []);
  const [budgets, setBudgets] = useState(initialBudgets || []);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [walletId, setWalletId] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch wallets & budgets if not passed
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!initialWallets || initialWallets.length === 0) {
        setLoadingOptions(true);
        try {
          const [wList, bList] = await Promise.all([
            getWallets(),
            getBudgets(),
          ]);
          if (mounted) {
            const wData = Array.isArray(wList) ? wList : wList?.wallets || [];
            const bData = Array.isArray(bList) ? bList : bList?.budgets || [];
            setWallets(wData);
            setBudgets(bData);
            const defW = wData.find((w) => w.isDefault) || wData[0];
            if (defW) setWalletId(String(defW.id));
          }
        } catch (err) {
          console.error("Failed to load options", err);
        } finally {
          if (mounted) setLoadingOptions(false);
        }
      } else {
        const defW =
          initialWallets.find((w) => w.isDefault) || initialWallets[0];
        if (defW) setWalletId(String(defW.id));
        if (initialBudgets) setBudgets(initialBudgets);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [initialWallets, initialBudgets]);

  const selectedWallet = wallets.find((w) => String(w.id) === String(walletId));
  const matchedBudget = budgets.find(
    (b) => b.category?.toLowerCase() === category?.toLowerCase(),
  );

  function validate() {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    const num = parseFloat(amount);
    if (!num || isNaN(num) || num <= 0) e.amount = "Enter a valid amount > $0";
    if (!category) e.category = "Pick a category";
    return e;
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const expenseAmount = parseFloat(amount);

    // ─── 1. Insufficient Wallet Balance Guard ─────────────────────────
    if (selectedWallet && Number(selectedWallet.balance || 0) < expenseAmount) {
      const result = await Swal.fire({
        icon: "error",
        title: "Insufficient Wallet Funds",
        html: `
          <div style="font-size: 14px; line-height: 1.5; color: #334155;">
            <p>Wallet <b>${selectedWallet.name}</b> has only <b>$${Number(selectedWallet.balance || 0).toFixed(2)}</b>.</p>
            <p style="margin-top: 8px; color: #64748B;">This expense is <b>$${expenseAmount.toFixed(2)}</b>, which exceeds the balance.</p>
            <p style="margin-top: 10px; font-weight: 600; color: #4F46E5;">Would you like to top up this wallet first?</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Top Up Wallet",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#6C63FF",
        cancelButtonColor: "#94A3B8",
      });

      if (result.isConfirmed) {
        onClose();
        if (onOpenDeposit) {
          onOpenDeposit(selectedWallet);
        }
      }
      return;
    }

    // ─── 2. Budget Awareness Warnings ─────────────────────────────────
    if (matchedBudget) {
      const budgetCap = Number(matchedBudget.limitAmount || 0);
      const currentSpent = Number(matchedBudget.spentAmount || 0);
      const newSpent = currentSpent + expenseAmount;
      const percentage =
        budgetCap > 0 ? Math.round((newSpent / budgetCap) * 100) : 100;

      // Case A: Exceeds Budget (>100%) - Danger Red SweetAlert
      if (newSpent > budgetCap) {
        const overBy = newSpent - budgetCap;
        const result = await Swal.fire({
          icon: "warning",
          title: "Over Budget Alert!",
          html: `
            <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
              <p>This expense will exceed your monthly <b>${matchedBudget.category}</b> budget.</p>
              <div style="margin: 12px 0; padding: 10px 14px; background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 10px; color: #991B1B;">
                <div>• Budget Cap: <b>$${budgetCap.toFixed(2)}</b></div>
                <div>• Current Spent: <b>$${currentSpent.toFixed(2)}</b></div>
                <div>• After Expense: <b style="color: #DC2626;">$${newSpent.toFixed(2)}</b> (${percentage}%)</div>
                <div style="font-weight: 700; margin-top: 4px; color: #DC2626;">Over limit by $${overBy.toFixed(2)}</div>
              </div>
              <p style="color: #64748B;">You can still proceed with this transaction or cancel to adjust your spending.</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Proceed Anyway",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#DC2626",
          cancelButtonColor: "#94A3B8",
        });

        if (!result.isConfirmed) return;
      }
      // Case B: Approaching Budget (80% - 100%) - Warning Yellow SweetAlert
      else if (percentage >= 80) {
        const result = await Swal.fire({
          icon: "info",
          title: "Approaching Budget Limit",
          html: `
            <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
              <p>Caution: This expense brings your <b>${matchedBudget.category}</b> spending close to its limit.</p>
              <div style="margin: 12px 0; padding: 10px 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; color: #92400E;">
                <div>• Budget Cap: <b>$${budgetCap.toFixed(2)}</b></div>
                <div>• New Total Spent: <b>$${newSpent.toFixed(2)}</b> (${percentage}%)</div>
                <div>• Remaining after: <b>$${Math.max(0, budgetCap - newSpent).toFixed(2)}</b></div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Confirm Expense",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#6C63FF",
          cancelButtonColor: "#94A3B8",
        });

        if (!result.isConfirmed) return;
      }
    }

    // ─── 3. Submit Transaction ─────────────────────────────────────────
    setSubmitting(true);
    try {
      await onSubmit?.({
        title: title.trim(),
        amount: expenseAmount,
        category,
        walletId: walletId ? Number(walletId) : undefined,
        budgetId: matchedBudget ? matchedBudget.id : undefined,
        date,
        description: description.trim(),
        note: description.trim(),
        icon: CATEGORY_ICONS[category] || "💸",
      });
      setSubmitted(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error("Failed to add expense", err);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err?.message || "Failed to record expense",
        confirmButtonColor: "#6C63FF",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/50 dark:bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-md my-auto max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-[#ECEBF5] dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 shrink-0 bg-white dark:bg-[#12121A] border-b border-[#F0EEFF] dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Add Expense
            </h2>
            <p className="text-xs mt-0.5 text-gray-400 dark:text-gray-400">
              Record a new transaction with wallet & budget checks
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
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-[#EDE9FE] dark:bg-[#1E1B2E]">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Expense Recorded!
            </p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-400">
              {CATEGORY_ICONS[category]} {title} — $
              {parseFloat(amount || 0).toFixed(2)}
            </p>
          </div>
        ) : (
          /* Scrollable Form Body */
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 flex flex-col gap-3.5"
          >
            {/* Title */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch, Grab Ride, Electricity Bill"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: null }));
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
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

            {/* Amount */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Amount ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm select-none font-semibold text-gray-400 dark:text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount)
                      setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                  className={`w-full pl-7 pr-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
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

            {/* Wallet Selection */}
            {wallets.length > 0 && (
              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Pay From Wallet
                </label>
                <div className="relative">
                  <select
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl text-xs sm:text-sm border border-[#ECEBF5] dark:border-[#2A2A38] bg-[#FAFAFA] dark:bg-[#1A1A24] text-gray-900 dark:text-white focus:outline-none focus:border-[#6C63FF] cursor-pointer"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} (Balance: ${Number(w.balance || 0).toFixed(2)})
                        {w.isDefault ? " ★ Default" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Category chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                {matchedBudget && (
                  <span className="text-[11px] font-medium text-[#6C63FF] dark:text-[#A49DFF]">
                    Budget cap: $
                    {Number(matchedBudget.limitAmount || 0).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (errors.category)
                        setErrors((prev) => ({ ...prev, category: null }));
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-semibold ${
                      category === cat
                        ? "bg-[#6C63FF] text-white border border-[#6C63FF]"
                        : "bg-[#F4F2FF] dark:bg-[#1A1A24] text-[#6C63FF] dark:text-[#A49DFF] border border-[#EDE9FE] dark:border-[#2A2A38] hover:bg-purple-100 dark:hover:bg-[#222033]"
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span> {cat}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-xs mt-1 text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#FAFAFA] dark:bg-[#1A1A24] border border-[#ECEBF5] dark:border-[#2A2A38] text-gray-900 dark:text-white focus:border-[#6C63FF]"
              />
            </div>

            {/* Description / Note */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Description{" "}
                <span className="font-normal text-gray-400 dark:text-gray-500">
                  (Optional)
                </span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Lunch with friends"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all resize-none bg-[#FAFAFA] dark:bg-[#1A1A24] border border-[#ECEBF5] dark:border-[#2A2A38] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#6C63FF]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-1 shrink-0 cursor-pointer shadow-sm whitespace-nowrap bg-[#6C63FF] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{submitting ? "Processing..." : "Submit Expense"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
