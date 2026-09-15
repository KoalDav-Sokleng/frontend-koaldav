import React, { useState, useEffect } from "react";
import {
  X,
  Wallet,
  Building2,
  Coins,
  PiggyBank,
  Users,
  CreditCard,
  Loader2,
  Check,
} from "lucide-react";

const WALLET_TYPES = [
  { id: "PERSONAL", label: "Personal", desc: "Daily expenses & personal card" },
  { id: "BANK", label: "Bank Account", desc: "Checking / Main saving account" },
  { id: "CASH", label: "Cash in Hand", desc: "Physical wallet or cash" },
  {
    id: "SAVINGS",
    label: "Savings Vault",
    desc: "Long-term financial cushion",
  },
  {
    id: "GROUP",
    label: "Group / Shared",
    desc: "Shared room or family budget",
  },
];

const ICONS = [
  { id: "Wallet", icon: Wallet, label: "Wallet" },
  { id: "Building2", icon: Building2, label: "Bank" },
  { id: "Coins", icon: Coins, label: "Cash" },
  { id: "PiggyBank", icon: PiggyBank, label: "Piggy" },
  { id: "Users", icon: Users, label: "Group" },
  { id: "CreditCard", icon: CreditCard, label: "Card" },
];

const COLOR_OPTIONS = [
  "#6C63FF", // Indigo
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F43F5E", // Rose
];

export default function EditWalletModal({ wallet, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("PERSONAL");
  const [currency, setCurrency] = useState("USD");
  const [icon, setIcon] = useState("Wallet");
  const [color, setColor] = useState("#6C63FF");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wallet) {
      setName(wallet.name || "");
      setType(wallet.type || "PERSONAL");
      setCurrency(wallet.currency || "USD");
      setIcon(wallet.icon || "Wallet");
      setColor(wallet.color || "#6C63FF");
      setIsDefault(Boolean(wallet.isDefault));
    }
  }, [wallet]);

  if (!wallet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a wallet name");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(wallet.id, {
        name: name.trim(),
        type,
        currency,
        icon,
        color,
        isDefault,
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update wallet");
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Wallet
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update account details, color, or default status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Current Balance Banner */}
          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-[#1E1B2E]/70 border border-purple-100 dark:border-[#2A2440] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Current Balance:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
              ${Number(wallet.balance || 0).toFixed(2)} {wallet.currency}
            </span>
          </div>

          {/* Wallet Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Wallet Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all"
              autoFocus
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Wallet Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WALLET_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    type === t.id
                      ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]"
                      : "border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{t.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="KHR">KHR (៛)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Icon & Color Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = icon === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setIcon(item.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF]"
                          : "border-slate-200 dark:border-[#2A2A38] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      <IconComp size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Default Wallet Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#2A2A38] mt-1">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Set as Default Wallet
              </p>
              <p className="text-[10px] text-slate-400">
                Primary wallet used for default transactions & payments
              </p>
            </div>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
