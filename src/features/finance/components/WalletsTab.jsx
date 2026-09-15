import React, { useState } from "react";
import { Plus, Wallet, RefreshCw, Star, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import WalletCard from "./WalletCard";
import CreateWalletModal from "./CreateWalletModal";
import EditWalletModal from "./EditWalletModal";
import DepositWalletModal from "./DepositWalletModal";
import { useWallets } from "../hooks/useWallets";

export default function WalletsTab() {
  const {
    wallets,
    loading,
    error,
    totalBalance,
    defaultWallet,
    reload,
    addWallet,
    editWallet,
    depositWallet,
    removeWallet,
  } = useWallets();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [depositTarget, setDepositTarget] = useState(null);

  const handleDeleteWallet = async (wallet) => {
    const balance = Number(wallet.balance || 0);

    // Rule: Cannot delete if wallet has positive balance
    if (balance > 0) {
      Swal.fire({
        icon: "warning",
        title: "Cannot Delete Active Wallet",
        html: `
          <div style="font-size: 13px; line-height: 1.5; color: #334155;">
            <p>Wallet <b>${wallet.name}</b> currently holds <b>$${balance.toFixed(2)}</b>.</p>
            <p style="margin-top: 8px; color: #64748B;">For your financial safety, you cannot delete a wallet that has remaining funds.</p>
            <p style="margin-top: 8px; font-weight: 600; color: #4F46E5;">Please spend or transfer the balance to $0.00 first.</p>
          </div>
        `,
        confirmButtonText: "Understood",
        confirmButtonColor: "#6C63FF",
      });
      return;
    }

    // Wallet is empty, confirm deletion
    const result = await Swal.fire({
      icon: "question",
      title: "Delete Empty Wallet?",
      html: `<p style="font-size: 13px; color: #334155;">Are you sure you want to remove <b>${wallet.name}</b>?</p>`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (result.isConfirmed) {
      try {
        await removeWallet(wallet.id);
        Swal.fire({
          icon: "success",
          title: "Wallet Deleted",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.message || "Could not delete wallet",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Net Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Total Net Balance
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
              <ShieldCheck size={13} /> Across {wallets.length} account
              {wallets.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
            <Wallet size={22} />
          </div>
        </div>

        {/* Primary Default Wallet */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Default Payment Method
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate mt-1">
              {defaultWallet ? defaultWallet.name : "No Default Set"}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium flex items-center gap-1">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              {defaultWallet
                ? `$${Number(defaultWallet.balance || 0).toFixed(2)} available`
                : "Create your first wallet"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Star size={22} />
          </div>
        </div>

        {/* Action card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#6C63FF]/10 to-indigo-500/10 border border-[#6C63FF]/20 dark:border-[#6C63FF]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF]">
              Manage Accounts
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Create savings vaults, banks, or cash pockets.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>New Wallet</span>
          </button>
        </div>
      </div>

      {/* Wallet Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Wallets & Accounts
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Real money balances protected by deletion safeguards
            </p>
          </div>
          <button
            onClick={reload}
            title="Refresh wallets"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-500 hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs font-medium">Loading wallets...</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-[#2A2A38] flex flex-col items-center justify-center text-center gap-3 bg-white/50 dark:bg-[#12121A]/50">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center text-2xl">
              💳
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                No Wallets Yet
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Add your bank accounts, cash in hand, or savings funds to start
                managing balances and spending.
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm transition-all"
            >
              <Plus size={15} />
              <span>Create First Wallet</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wallets.map((w) => (
              <WalletCard
                key={w.id}
                wallet={w}
                onDeposit={(item) => setDepositTarget(item)}
                onEdit={(item) => setEditTarget(item)}
                onDelete={(item) => handleDeleteWallet(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {createOpen && (
        <CreateWalletModal
          onClose={() => setCreateOpen(false)}
          onSubmit={addWallet}
        />
      )}

      {editTarget && (
        <EditWalletModal
          wallet={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={editWallet}
        />
      )}

      {depositTarget && (
        <DepositWalletModal
          wallet={depositTarget}
          onClose={() => setDepositTarget(null)}
          onSubmit={depositWallet}
        />
      )}
    </div>
  );
}
