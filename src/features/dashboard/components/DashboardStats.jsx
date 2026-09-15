import {
  CreditCard,
  PiggyBank,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardStats({
  totalWalletBalance = 0,
  defaultWalletName = "",
  walletsCount = 0,
  monthlySpend = 0,
  expenseCount = 0,
  totalBudgetLimit = 0,
  totalBudgetSpent = 0,
  overbudgetCount = 0,
  totalSaved = 0,
  totalTarget = 0,
  loading = false,
}) {
  const savingPercent =
    totalTarget > 0
      ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
      : 0;

  const budgetUsagePercent =
    totalBudgetLimit > 0
      ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100))
      : 0;

  const cards = [
    // 1. Total Wallet Balance
    {
      title: "Total Wallet Balance",
      value: loading
        ? "..."
        : `$${Number(totalWalletBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: defaultWalletName ? `Default: ${defaultWalletName}` : `${walletsCount} active wallets`,
      icon: Wallet,
      iconBg: "bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]",
      link: "/finance/wallets",
      progress: null,
      badge: "Live Funds",
      badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-[#6C63FF] dark:text-[#A49DFF]",
    },
    // 2. Total Expenses
    {
      title: "Total Expenses",
      value: loading
        ? "..."
        : `$${Number(monthlySpend || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subValue: `${expenseCount} transactions`,
      icon: CreditCard,
      iconBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400",
      link: "/finance/expenses",
      progress: null,
      badge: "Spending",
      badgeColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300",
    },
    // 3. Budget Usage
    {
      title: "Budget Usage",
      value: loading
        ? "..."
        : `$${Number(totalBudgetSpent || 0).toFixed(0)} / $${Number(totalBudgetLimit || 0).toFixed(0)}`,
      subValue: overbudgetCount > 0 ? `${overbudgetCount} Over Budget!` : `${budgetUsagePercent}% of cap used`,
      icon: PiggyBank,
      iconBg: overbudgetCount > 0
        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500"
        : "bg-indigo-50 dark:bg-[#1E1B2E] text-indigo-600 dark:text-[#A49DFF]",
      link: "/finance/budgets",
      progress: budgetUsagePercent,
      progressColor: overbudgetCount > 0 ? "bg-rose-500" : "bg-[#6C63FF]",
      badge: overbudgetCount > 0 ? "Alert ⚠️" : "On Track",
      badgeColor: overbudgetCount > 0
        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 font-bold"
        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600",
    },
    // 4. Saving-Goal Progress
    {
      title: "Saving Goals",
      value: loading
        ? "..."
        : `$${Number(totalSaved || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      subValue: `of $${Number(totalTarget || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} target`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400",
      link: "/goal/saving",
      progress: savingPercent,
      progressColor: "bg-emerald-500",
      badge: `${savingPercent}% Saved`,
      badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            to={card.link}
            className="group relative bg-white dark:bg-[#17171F] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-[#6C63FF]/40 dark:hover:border-[#6C63FF]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                    {card.value}
                  </h3>
                </div>
              </div>
              <div className="p-1 rounded-lg text-slate-400 group-hover:text-[#6C63FF] dark:group-hover:text-[#A49DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {card.progress !== null ? (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[150px]">{card.subValue}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {card.progress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${card.progressColor}`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[160px]">
                  {card.subValue}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
