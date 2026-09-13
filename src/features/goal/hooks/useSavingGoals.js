import { useCallback, useEffect, useState } from "react";
import * as savingApi from "../api/savingApi";
import { isDeadlinePassed } from "../utils/goalHelpers";

function deriveSavingStatus(goal) {
  if (!goal) return "ACTIVE";
  const target = Number(goal.targetAmount) || 0;
  const current = Number(goal.currentAmount) || 0;
  if (goal.status === "COMPLETED" || (target > 0 && current >= target)) {
    return "COMPLETED";
  }
  if (goal.status === "MISSED" || isDeadlinePassed(goal.deadline)) {
    return "MISSED";
  }
  return goal.status || "ACTIVE";
}

export function useSavingGoals(initialStatus = "ACTIVE") {
  const [status, setStatus] = useState(initialStatus);
  const [allGoals, setAllGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await savingApi.getSavingGoals();
      setAllGoals(Array.isArray(data) ? data : []);
      setError(null);
      return data;
    } catch (err) {
      setError(err?.message || "Failed to load saving goals.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(
    async (goalData) => {
      const newGoal = await savingApi.createSavingGoal(goalData);
      await fetchGoals();
      return newGoal;
    },
    [fetchGoals]
  );

  const updateGoal = useCallback(
    async (id, goalData) => {
      const updated = await savingApi.updateSavingGoal(id, goalData);
      await fetchGoals();
      return updated;
    },
    [fetchGoals]
  );

  const removeGoal = useCallback(async (id) => {
    await savingApi.deleteSavingGoal(id);
    setAllGoals((prev) => prev.filter((g) => String(g.id) !== String(id)));
    setSelectedGoalId((currentId) =>
      String(currentId) === String(id) ? null : currentId
    );
  }, []);

  const depositFunds = useCallback(
    async (goalId, depositData) => {
      const savedDeposit = await savingApi.addSavingDeposit(goalId, depositData);
      await fetchGoals();
      return savedDeposit;
    },
    [fetchGoals]
  );

  const filteredGoals = status
    ? allGoals.filter((g) => deriveSavingStatus(g) === status)
    : allGoals;

  const counts = {
    ACTIVE: allGoals.filter((g) => deriveSavingStatus(g) === "ACTIVE").length,
    COMPLETED: allGoals.filter((g) => deriveSavingStatus(g) === "COMPLETED").length,
    MISSED: allGoals.filter((g) => deriveSavingStatus(g) === "MISSED").length,
  };

  const selectedGoal =
    allGoals.find((g) => String(g.id) === String(selectedGoalId)) ?? null;

  return {
    goals: filteredGoals,
    allGoals,
    counts,
    loading,
    error,
    status,
    setStatus,
    selectedGoal,
    selectedGoalId,
    setSelectedGoalId,
    fetchGoals,
    refresh: fetchGoals,
    createGoal,
    updateGoal,
    removeGoal,
    depositFunds,
  };
}

export default useSavingGoals;
