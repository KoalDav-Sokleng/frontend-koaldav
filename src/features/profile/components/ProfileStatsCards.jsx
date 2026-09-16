import React from "react";
import { Target, Zap, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileStatsCards({
  totalGoals = 0,
  activeGoals = 0,
  completedGoals = 0,
  totalFocusMinutes = 0,
  loading = false,
}) {
  const completionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const focusHours = (Number(totalFocusMinutes || 0) / 60).toFixed(1);

  const cards = [
    {
      title: "Total Goals",
      value: loading ? "..." : totalGoals,
      subValue: `${activeGoals} active • ${completedGoals} done`,
      icon: Target,
      iconColor: "text-[#6C63FF] dark:text-[#A49DFF]",
      iconBg: "bg-purple-50 dark:bg-[#1E1B2E]",
      borderColor: "hover:border-purple-300 dark:hover:border-purple-800",
      link: "/goal",
      badge: "Tracked",
      badgeColor:
        "bg-purple-100 dark:bg-purple-950/60 text-[#6C63FF] dark:text-[#A49DFF]",
    },
    {
      title: "Active Goals",
      value: loading ? "..." : activeGoals,
      subValue: "Currently in progress",
      icon: Zap,
      iconColor: "text-amber-500 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "hover:border-amber-300 dark:hover:border-amber-800",
      link: "/goal",
      badge: "In Progress",
      badgeColor:
        "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
    },
    {
      title: "Completed Goals",
      value: loading ? "..." : completedGoals,
      subValue: `${completionRate}% overall completion`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "hover:border-emerald-300 dark:hover:border-emerald-800",
      link: "/goal",
      badge: "Success",
      badgeColor:
        "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
    },
    {
      title: "Total Focus Time",
      value: loading ? "..." : `${focusHours}h`,
      subValue: `${totalFocusMinutes} focused minutes logged`,
      icon: Clock,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      borderColor: "hover:border-indigo-300 dark:hover:border-indigo-800",
      link: "/habit",
      badge: "Productivity",
      badgeColor:
        "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
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
            className={`group relative bg-white dark:bg-[#12121A] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${card.borderColor}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight tabular-nums">
                    {card.value}
                  </h3>
                </div>
              </div>
              <div className="p-1 rounded-lg text-slate-400 group-hover:text-[#6C63FF] dark:group-hover:text-[#A49DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1E1B2E] flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[160px]">
                {card.subValue}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
