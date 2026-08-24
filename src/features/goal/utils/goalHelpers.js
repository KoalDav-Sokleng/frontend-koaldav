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

export function goalStatusLabel(goal) {
  return goal.status === "COMPLETED" ? "Completed" : "In Progress";
}