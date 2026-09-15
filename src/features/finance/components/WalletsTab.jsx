import React, { useState } from "react";
import {
  Wallet,
  Plus,
  TrendingUp,
  RefreshCw,
  Building2,
  ShieldCheck,
  CreditCard,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../../../context/ThemeContext";
import WalletCard from "./WalletCard";
import CreateWalletModal from "./CreateWalletModal";
import EditWalletModal from "./EditWalletModal";
import DepositWalletModal from "./DepositWalletModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function WalletsTab({
  wallets,
  loading,
  error,
  totalBalance,
  defaultWallet,
  reload,
  onAddWallet,
  onEditWallet,
  onDepositWallet,
  onRemoveWallet,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [depositingWallet, setDepositingWallet] = useState(null);
  const [deletingWallet, setDeletingWallet] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Safe delete handler with active funds guard
  const handleDeleteRequest = (wallet) => {
    const balance = Number(wallet.balance || 0);
    if (balance > 0) {
      Swal.fire({
        title: "🔒 Cannot Delete Wallet with Active Balance!",
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: ${isDark ? "#CBD5E1" : "#475569"};">
            <p style="margin-bottom: 8px;">
              <b>${wallet.name}</b> still contains an active balance of <b style="color: #10B981;">$${balance.toFixed(2)} ${wallet.currency || "USD"}</b>.
            </p>
            <div style="background: ${isDark ? "#26161C" : "#FFF1F2"}; border: 1px solid ${isDark ? "#881337" : "#FECDD3"}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px;">
              <p style="margin: 0; color: #F43F5E; font-weight: 600;">
                Financial Safety Rule:
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px;">
                You cannot delete an account with real money inside. Please spend or transfer the funds down to <b>$0.00</b> before closing this wallet.
              </p>
            </div>
          </div>
        `,
        icon: "warning",
        iconColor: "#F59E0B",
        confirmButtonText: "I Understand",
        confirmButtonColor: "#6C63FF",
        background: isDark ? "#17171F" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        customClass: {
          popup: "rounded-3xl border border-slate-200 dark:border-slate-700",
        },
      });
      return;
    }

    // If balance is 0, allow delete confirmation
    setDeletingWallet(wallet);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWallet) return;
    setDeleteLoading(true);
    try {
      await onRemoveWallet(deletingWallet.id);
      setDeletingWallet(null);
    } catch (err) {
      console.error("Failed to delete wallet:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Total Net Worth & Quick Stat */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#6C63FF] via-[#5B52E6] to-[#4338CA] text-white shadow-lg">
        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck size={16} /> Total Net Worth / Balance
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-sm font-semibold text-white/80">USD</span>
            </div>
            <p className="text-xs text-white/80 mt-2 flex items-center gap-2">
              <span>
                {wallets.length} Active{" "}
                {wallets.length === 1 ? "Wallet" : "Wallets"}
              </span>
              {defaultWallet && (
                <>
                  <span>•</span>
                  <span>
                    Primary: <strong>{defaultWallet.name}</strong>
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={reload}
              title="Refresh Wallets"
              className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all text-white cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#6C63FF] font-bold text-sm shadow-md hover:bg-purple-50 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={18} />
              <span>Add New Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <span>Failed to load wallets: {String(error)}</span>
          <button onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Wallets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Accounts & Wallets
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage balances, cash, savings, and bank accounts
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {wallets.length} {wallets.length === 1 ? "Account" : "Accounts"}
          </span>
        </div>

        {loading && wallets.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs font-semibold">Loading wallets...</p>
          </div>
        ) : wallets.length === 0 ? (
          /* Empty state */
          <div className="p-10 rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center mb-3">
              <Wallet size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Wallets Created Yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
              Create your first wallet (e.g. Bank Account, Cash in Hand, or
              Savings Vault) to track your balances and pay for expenses.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Create First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onDeposit={(w) => setDepositingWallet(w)}
                onDelete={(w) => setDeletingWallet(w)}
                onEdit={(w) => setEditingWallet(w)}
                onDelete={handleDeleteRequest}
              />
            ))}

            {/* Quick Add Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-slate-200 dark:border-[#1E1B2E] hover:border-[#6C63FF] dark:hover:border-[#6C63FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all hover:bg-purple-50/30 dark:hover:bg-[#1A1A24] min-h-[170px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
                <Plus size={20} />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Add Another Wallet
              </p>
              <p className="text-[11px] text-slate-400 text-center max-w-[170px]">
                Create a cash stash, bank card, or crypto wallet
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateWalletModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={onAddWallet}
        />
      )}

      {editingWallet && (
        <EditWalletModal
          wallet={editingWallet}
          onClose={() => setEditingWallet(null)}
          onSubmit={onEditWallet}
        />
      )}

      {depositingWallet && (
        <DepositWalletModal
          wallet={depositingWallet}
          onClose={() => setDepositingWallet(null)}
          onSubmit={onDepositWallet}
        />
      )}

      {deletingWallet && (
        <DeleteConfirmModal
          title={`Delete "${deletingWallet.name}"?`}
          message="Are you sure you want to delete this wallet? Balance data and history associated with this wallet will be affected."
          message="This wallet has a $0.00 balance and can be safely deleted. Are you sure you want to proceed?"
          loading={deleteLoading}
          onClose={() => setDeletingWallet(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
