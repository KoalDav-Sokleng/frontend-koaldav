// src/features/goal/hooks/useTripGoals.js
import { useState, useEffect, useCallback } from "react";
import * as tripApi from "../api/tripApi";
import { isDeadlinePassed } from "../utils/goalHelpers";

export function deriveTripStatus(goal) {
  if (!goal) return "ACTIVE";
  const target = Number(goal.target) || 0;
  const saved = Number(goal.saved) || 0;
  if (goal.status === "COMPLETED" || (target > 0 && saved >= target)) {
    return "COMPLETED";
  }
  if (goal.status === "MISSED" || isDeadlinePassed(goal.deadline)) {
    return "MISSED";
  }
  return goal.status || "ACTIVE";
}

export function useTripGoals(initialStatus = "ACTIVE") {
  const [status, setStatus] = useState(initialStatus);
  const [allGoals, setAllGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripApi.getTripGoals();
      setAllGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load trip goals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (data) => {
    const created = await tripApi.createTripGoal(data);
    await fetchGoals();
    return created;
  };

  const updateGoal = async (id, data) => {
    const updated = await tripApi.updateTripGoal(id, data);
    await fetchGoals();
    return updated;
  };

  const depositFunds = async (id, amount) => {
    const updated = await tripApi.depositTripGoal(id, amount);
    await fetchGoals();
    return updated;
  };

  const deleteGoal = async (id) => {
    await tripApi.deleteTripGoal(id);
    setAllGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const filteredGoals = allGoals.filter((g) => deriveTripStatus(g) === status);

  const counts = {
    ACTIVE: allGoals.filter((g) => deriveTripStatus(g) === "ACTIVE").length,
    COMPLETED: allGoals.filter((g) => deriveTripStatus(g) === "COMPLETED").length,
    MISSED: allGoals.filter((g) => deriveTripStatus(g) === "MISSED").length,
  };

  return {
    goals: filteredGoals,
    allGoals,
    counts,
    status,
    setStatus,
    loading,
    error,
    refresh: fetchGoals,
    createGoal,
    updateGoal,
    depositFunds,
    deleteGoal,
  };
}