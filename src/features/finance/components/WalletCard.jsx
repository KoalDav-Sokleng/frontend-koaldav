import React from "react";
import {
  Wallet,
  Building2,
  Coins,
  PiggyBank,
  Users,
  CreditCard,
  PlusCircle,
  Trash2,
  Edit2,
  Star,
  Lock,
} from "lucide-react";

export const WALLET_ICONS = {
  Wallet: Wallet,
  Building2: Building2,
  Coins: Coins,
  PiggyBank: PiggyBank,
  Users: Users,
  CreditCard: CreditCard,
};

export const WALLET_TYPE_LABELS = {
  PERSONAL: "Personal",
  BANK: "Bank Account",
  CASH: "Cash in Hand",
  SAVINGS: "Savings",
  GROUP: "Shared / Group",
};

export default function WalletCard({ wallet, onDeposit, onEdit, onDelete }) {
  const IconComponent = WALLET_ICONS[wallet.icon] || Wallet;
  const color = wallet.color || "#6C63FF";
  const balance = Number(wallet.balance || 0);
  const hasFunds = balance > 0;

  return (
    <div
      className="relative rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${color}18`,
                color: color,
              }}
            >
              <IconComponent size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {wallet.name}
                </h3>
                {wallet.isDefault && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                    <Star size={10} className="fill-amber-500" /> Default
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                {WALLET_TYPE_LABELS[wallet.type] || wallet.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(wallet)}
                title="Edit Wallet"
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#6C63FF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-all cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(wallet)}
              title={
                hasFunds ? "Cannot delete wallet with funds" : "Delete Wallet"
              }
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                hasFunds
                  ? "text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  : "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              }`}
            >
              {hasFunds ? <Lock size={14} /> : <Trash2 size={14} />}
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Current Balance
            </span>
            {hasFunds && (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                Active Funds
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {wallet.currency || "USD"}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-[#1E1B2E] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {wallet.updatedAt
            ? `Updated ${new Date(wallet.updatedAt).toLocaleDateString()}`
            : "Ready"}
        </span>
        <button
          onClick={() => onDeposit(wallet)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] bg-[#F4F2FF] dark:bg-[#1E1B2E] hover:bg-[#E7E2FF] dark:hover:bg-[#2A2440] transition-colors cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>Top Up</span>
        </button>
      </div>
    </div>
  );
}
