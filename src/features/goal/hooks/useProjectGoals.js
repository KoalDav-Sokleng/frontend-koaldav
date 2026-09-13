import { useCallback, useEffect, useState } from "react";
import * as goalApi from "../api/goalApi";
import { getEffectiveGoalStatus } from "../utils/goalHelpers";

export function useProjectGoals(initialStatus = "IN_PROGRESS") {
  const [status, setStatus] = useState(initialStatus);
  const [allGoals, setAllGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    return goalApi.getProjectGoals()
      .then((data) => {
        setAllGoals(data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createGoal = useCallback(async (payload) => {
    const goal = await goalApi.createProjectGoal(payload);
    await refresh();
    window.dispatchEvent(new Event("goal-notifications-updated"));
    return goal;
  }, [refresh]);

  const updateGoal = useCallback(async (goalId, payload) => {
    const goal = await goalApi.updateProjectGoal(goalId, payload);
    await refresh();
    window.dispatchEvent(new Event("goal-notifications-updated"));
    return goal;
  }, [refresh]);

  const deleteGoal = useCallback(async (goalId) => {
    await goalApi.deleteProjectGoal(goalId);
    setAllGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  }, []);

  const addMilestone = useCallback(async (goalId, payload) => {
    const milestone = await goalApi.addMilestone(goalId, payload);
    setAllGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, milestones: [...(g.milestones || []), milestone] } : g))
    );
    return milestone;
  }, []);

  const completeMilestone = useCallback(async (goalId, milestoneId) => {
    await goalApi.completeMilestone(goalId, milestoneId);
    await refresh();
  }, [refresh]);

  const updateMilestone = useCallback(async (goalId, milestoneId, payload) => {
    const milestone = await goalApi.updateMilestone(goalId, milestoneId, payload);
    setAllGoals((prev) =>
      prev.map((goal) =>
        goal.id !== goalId
          ? goal
          : {
              ...goal,
              milestones: (goal.milestones || []).map((item) =>
                item.id === milestoneId ? { ...item, ...milestone } : item
              ),
            }
      )
    );
    return milestone;
  }, []);

  const deleteMilestone = useCallback(async (goalId, milestoneId) => {
    await goalApi.deleteMilestone(goalId, milestoneId);
    setAllGoals((prev) =>
      prev.map((goal) =>
        goal.id !== goalId
          ? goal
          : {
              ...goal,
              milestones: (goal.milestones || []).filter((item) => item.id !== milestoneId),
            }
      )
    );
  }, []);

  const logFocusSession = useCallback(async (goalId, milestoneId, payload) => {
    const session = await goalApi.logFocusSession(milestoneId, payload);
    setAllGoals((prev) =>
      prev.map((g) =>
        g.id !== goalId
          ? g
          : {
              ...g,
              milestones: (g.milestones || []).map((m) =>
                m.id === milestoneId ? { ...m, focusSessions: [...(m.focusSessions || []), session] } : m
              ),
            }
      )
    );
    return session;
  }, []);

  const filteredGoals = allGoals.filter((g) => getEffectiveGoalStatus(g) === status);

  const counts = {
    IN_PROGRESS: allGoals.filter((g) => getEffectiveGoalStatus(g) === "IN_PROGRESS").length,
    COMPLETED: allGoals.filter((g) => getEffectiveGoalStatus(g) === "COMPLETED").length,
    MISSED: allGoals.filter((g) => getEffectiveGoalStatus(g) === "MISSED").length,
  };

  return {
    goals: filteredGoals,
    allGoals,
    counts,
    loading,
    error,
    status,
    setStatus,
    refresh,
    createGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    completeMilestone,
    logFocusSession,
  };
}
