import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-sm my-auto p-6 flex flex-col items-center text-center border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1A1A24] hover:bg-slate-200 dark:hover:bg-[#262438] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
