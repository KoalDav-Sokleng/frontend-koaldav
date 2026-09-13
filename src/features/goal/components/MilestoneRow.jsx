import { useState } from "react";
import { CheckCircle2, Timer, Pencil, Trash2, Lock } from "lucide-react";
import { milestoneLoggedMinutes } from "../utils/goalHelpers";

export default function MilestoneRow({
  milestone,
  onToggleComplete,
  onStartFocus,
  onEdit,
  onDelete,
  isGoalMissed = false,
  isGoalCompleted = false,
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCompleted = milestone.status === "COMPLETED" || isGoalCompleted;
  const loggedMinutes = milestoneLoggedMinutes(milestone);
  const minutesRemaining = Math.max(0, 60 - loggedMinutes);
  const isReadOnly = isGoalMissed || isGoalCompleted;
  const isDisabled = isCompleted || isReadOnly || submitting;

  const handleCheckboxClick = async () => {
    if (isDisabled) return;
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
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-all ${
        isGoalMissed
          ? "border-rose-200 bg-rose-50/10"
          : isGoalCompleted
            ? "border-emerald-200 bg-emerald-50/10"
            : "border-slate-200"
      }`}
    >
      <div className="flex gap-3 sm:items-center">
        <button
          onClick={handleCheckboxClick}
          disabled={isDisabled}
          aria-label={
            isCompleted
              ? "Completed"
              : isGoalMissed
                ? "Locked - Goal is missed"
                : "Mark as complete"
          }
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors sm:mt-0 ${
            isCompleted
              ? "border-emerald-500 bg-emerald-500 text-white"
              : isGoalMissed
                ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                : "border-slate-300 hover:border-indigo-400 disabled:opacity-50"
          }`}
        >
          {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
          {isGoalMissed && !isCompleted && (
            <Lock className="h-2.5 w-2.5 text-slate-400" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-medium ${
                isCompleted
                  ? "text-slate-500 line-through"
                  : isGoalMissed
                    ? "text-slate-600"
                    : "text-slate-900"
              }`}
            >
              {milestone.title}
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600"
                  : isGoalMissed
                    ? "bg-rose-50 text-rose-600"
                    : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {isCompleted
                ? "Completed"
                : isGoalMissed
                  ? "Missed"
                  : "In Progress"}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {isCompleted
                ? `${loggedMinutes} min logged`
                : `${loggedMinutes} / 60 min logged`}
            </span>
            {!isCompleted && !isGoalMissed && minutesRemaining > 0 && (
              <span className="text-amber-500">
                {minutesRemaining} min to go
              </span>
            )}
            {isGoalMissed && !isCompleted && (
              <span className="font-medium text-rose-500">
                Locked (deadline passed)
              </span>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:border-0 sm:pt-0">
        <button
          onClick={onStartFocus}
          disabled={isReadOnly || isCompleted}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:ml-auto sm:w-auto sm:rounded-full sm:px-3.5 sm:py-1.5 sm:text-xs"
        >
          {isGoalCompleted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Done
            </>
          ) : isGoalMissed ? (
            <>
              <Lock className="h-3.5 w-3.5" /> Locked
            </>
          ) : (
            <>
              <Timer className="h-4 w-4 sm:h-3.5 sm:w-3.5" /> Start Focus
            </>
          )}
        </button>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            disabled={isReadOnly}
            aria-label="Edit milestone"
            title={
              isGoalMissed
                ? "Goal deadline has passed"
                : isGoalCompleted
                  ? "Goal is completed"
                  : "Edit milestone"
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isReadOnly}
            aria-label="Delete milestone"
            title={
              isGoalMissed
                ? "Goal deadline has passed"
                : isGoalCompleted
                  ? "Goal is completed"
                  : "Delete milestone"
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
