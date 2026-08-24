import { useState } from "react";
import { CheckCircle2, Timer } from "lucide-react";
import { milestoneLoggedMinutes } from "../utils/goalHelpers";

export default function MilestoneRow({ milestone, onToggleComplete, onStartFocus }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCompleted = milestone.status === "COMPLETED";
  const loggedMinutes = milestoneLoggedMinutes(milestone);
  const minutesRemaining = Math.max(0, 60 - loggedMinutes);

  const handleCheckboxClick = async () => {
    if (isCompleted || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await onToggleComplete();
    } catch (err) {
      setError(err.message || "Couldn't complete this milestone yet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <button
        onClick={handleCheckboxClick}
        disabled={isCompleted || submitting}
        aria-label={isCompleted ? "Completed" : "Mark as complete"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-indigo-400 disabled:opacity-50"
        }`}
      >
        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className={`text-sm font-medium ${isCompleted ? "text-slate-400 line-through" : "text-slate-900"}`}>
            {milestone.title}
          </h4>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
          }`}>
            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {isCompleted ? `${loggedMinutes} min logged` : `${loggedMinutes} / 60 min logged`}
          </span>
          {!isCompleted && minutesRemaining > 0 && (
            <span className="text-amber-500">{minutesRemaining} min to go</span>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>

      <button
        onClick={onStartFocus}
        disabled={isCompleted}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <Timer className="h-3.5 w-3.5" />
        Start Focus
      </button>
    </div>
  );
}