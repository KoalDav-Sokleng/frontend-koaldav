import React, { useState } from "react";
import { X, ArrowDownLeft, Loader2 } from "lucide-react";
import { WALLET_ICONS } from "./WalletCard";

const QUICK_AMOUNTS = [10, 50, 100, 500];

export default function DepositWalletModal({ wallet, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!wallet) return null;

  const IconComp = WALLET_ICONS[wallet.icon] || WALLET_ICONS.Wallet;
  const currentBalance = Number(wallet.balance || 0);
  const depositNum = parseFloat(amount) || 0;
  const newBalance = currentBalance + depositNum;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!depositNum || depositNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(wallet.id, {
        amount: depositNum,
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to top up wallet");
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${wallet.color || "#6C63FF"}20`,
                color: wallet.color || "#6C63FF",
              }}
            >
              <IconComp size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Top Up {wallet.name}
              </h2>
              <p className="text-xs text-slate-400">
                Deposit funds to increase wallet balance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Balance Preview banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-[#1E1B2E] dark:to-[#171526] border border-purple-100 dark:border-[#2A2440] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Current Balance
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                ${currentBalance.toFixed(2)}
              </span>
            </div>
            <ArrowDownLeft size={20} className="text-[#6C63FF]" />
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                After Top Up
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${newBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Top Up Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-base font-bold border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all"
                autoFocus
              />
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2 mt-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-700 dark:text-slate-300 hover:border-[#6C63FF] hover:text-[#6C63FF] dark:hover:text-[#A49DFF] transition-all cursor-pointer"
                >
                  +${q}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Salary deposit, ATM cash in, Reimbursement"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] transition-all"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !depositNum}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Confirm Top Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
