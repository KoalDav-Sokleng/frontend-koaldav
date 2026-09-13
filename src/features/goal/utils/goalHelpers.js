// A milestone is only ever "IN_PROGRESS" or "COMPLETED" on the backend
// (60-minute focus rule flips it), so we derive a % for the UI from
// logged focus time instead of storing/inventing one.
export function milestoneProgress(milestone) {
  if (milestone.status === "COMPLETED") return 100;
  const totalMinutes = (milestone.focusSessions || []).reduce(
    (sum, f) => sum + f.durationMinutes,
    0
  );
  return Math.min(99, Math.round((totalMinutes / 60) * 100));
}

export function milestoneLoggedMinutes(milestone) {
  return (milestone.focusSessions || []).reduce((sum, f) => sum + f.durationMinutes, 0);
}

// Goal-level progress = average of its milestones' derived progress.
export function goalProgress(goal) {
  if (!goal.milestones || goal.milestones.length === 0) return 0;
  const total = goal.milestones.reduce((sum, m) => sum + milestoneProgress(m), 0);
  return Math.round(total / goal.milestones.length);
}

export function isDeadlinePassed(deadline) {
  if (!deadline) return false;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  let deadlineStr = "";
  if (typeof deadline === "string") {
    deadlineStr = deadline.split("T")[0].trim();
  } else if (Array.isArray(deadline) && deadline.length >= 3) {
    deadlineStr = `${deadline[0]}-${String(deadline[1]).padStart(2, "0")}-${String(deadline[2]).padStart(2, "0")}`;
  }

  if (!deadlineStr || deadlineStr.length < 10) return false;

  return deadlineStr < todayStr;
}

export function getEffectiveGoalStatus(goal) {
  if (!goal) return "IN_PROGRESS";
  if (goal.status === "COMPLETED") return "COMPLETED";

  const hasMilestones = Array.isArray(goal.milestones) && goal.milestones.length > 0;
  if (hasMilestones && goal.milestones.every((m) => m.status === "COMPLETED")) {
    return "COMPLETED";
  }

  if (goal.status === "MISSED" || isDeadlinePassed(goal.deadline)) {
    return "MISSED";
  }
  return "IN_PROGRESS";
}

export function goalStatusLabel(goal) {
  const effective = getEffectiveGoalStatus(goal);
  if (effective === "COMPLETED") return "Completed";
  if (effective === "MISSED") return "Missed";
  return "In Progress";
}

export function isGoalMissed(goal) {
  return getEffectiveGoalStatus(goal) === "MISSED";
}

export function isGoalCompleted(goal) {
  return getEffectiveGoalStatus(goal) === "COMPLETED";
}