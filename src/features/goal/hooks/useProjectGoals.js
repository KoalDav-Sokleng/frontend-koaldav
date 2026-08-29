import { useCallback, useEffect, useState } from "react";
import * as goalApi from "../api/goalApi";

export function useProjectGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    return goalApi.getProjectGoals()
      .then(setGoals)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createGoal = useCallback(async (payload) => {
    const goal = await goalApi.createProjectGoal(payload);
    setGoals((prev) => [{ ...goal, milestones: [] }, ...prev]);
    return goal;
  }, []);

  const updateGoal = useCallback(async (goalId, payload) => {
    const goal = await goalApi.updateProjectGoal(goalId, payload);
    setGoals((prev) => prev.map((item) => item.id === goalId ? { ...item, ...goal, milestones: goal.milestones ?? item.milestones } : item));
    return goal;
  }, []);

  const deleteGoal = useCallback(async (goalId) => {
    await goalApi.deleteProjectGoal(goalId);
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  }, []);

  const addMilestone = useCallback(async (goalId, payload) => {
    const milestone = await goalApi.addMilestone(goalId, payload);
    setGoals((prev) =>
      prev.map((g) => g.id === goalId ? { ...g, milestones: [...(g.milestones || []), milestone] } : g)
    );
    return milestone;
  }, []);

  const completeMilestone = useCallback(async (goalId, milestoneId) => {
    await goalApi.completeMilestone(goalId, milestoneId);
    setGoals((prev) =>
      prev.map((g) => g.id !== goalId ? g : {
        ...g,
        milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, status: "COMPLETED" } : m),
      })
    );
  }, []);

  const updateMilestone = useCallback(async (goalId, milestoneId, payload) => {
    const milestone = await goalApi.updateMilestone(goalId, milestoneId, payload);
    setGoals((prev) => prev.map((goal) => goal.id !== goalId ? goal : {
      ...goal,
      milestones: goal.milestones.map((item) => item.id === milestoneId ? { ...item, ...milestone } : item),
    }));
    return milestone;
  }, []);

  const deleteMilestone = useCallback(async (goalId, milestoneId) => {
    await goalApi.deleteMilestone(goalId, milestoneId);
    setGoals((prev) => prev.map((goal) => goal.id !== goalId ? goal : {
      ...goal,
      milestones: goal.milestones.filter((item) => item.id !== milestoneId),
    }));
  }, []);

  const logFocusSession = useCallback(async (goalId, milestoneId, payload) => {
    const session = await goalApi.logFocusSession(milestoneId, payload);
    setGoals((prev) =>
      prev.map((g) => g.id !== goalId ? g : {
        ...g,
        milestones: g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, focusSessions: [...(m.focusSessions || []), session] } : m
        ),
      })
    );
    return session;
  }, []);

  return { goals, loading, error, refresh, createGoal, updateGoal, deleteGoal, addMilestone, updateMilestone, deleteMilestone, completeMilestone, logFocusSession };
}
