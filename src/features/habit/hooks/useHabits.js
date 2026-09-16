// src/features/habit/hooks/useHabits.js
import { useState, useEffect, useCallback } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitDone,
  getGarden,
  applyGardenFreeze,
} from "../api/habitApi";

const DEFAULT_GARDEN = {
  streak: 0,
  bestStreak: 0,
  growthStage: 0,
  freezes: 0,
  freezeUsedDates: [],
  lastPerfectDate: null,
};

export function todayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Owns all habit + garden data for the page: fetches on mount,
 * exposes mutation helpers that call the API and then reconcile
 * local state from the server's response.
 */
export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [garden, setGarden] = useState(DEFAULT_GARDEN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsRes, gardenRes] = await Promise.allSettled([
        getHabits(),
        getGarden(),
      ]);
      if (habitsRes.status === "fulfilled") {
        setHabits(Array.isArray(habitsRes.value) ? habitsRes.value : []);
      }
      if (gardenRes.status === "fulfilled") {
        setGarden(gardenRes.value ?? DEFAULT_GARDEN);
      }
    } catch (err) {
      setError(err?.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addHabit = useCallback(async (payload) => {
    const created = await createHabit(payload);
    setHabits((prev) => [...prev, created]);
    return created;
  }, []);

  const editHabit = useCallback(async (id, payload) => {
    const updated = await updateHabit(id, payload);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    return updated;
  }, []);

  const removeHabit = useCallback(async (id) => {
    await deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHabit = useCallback(async (id, optionalDate) => {
    const date = optionalDate || todayStr();
    const res = await toggleHabitDone(id, date);
    if (res?.habit) {
      setHabits((prev) => prev.map((h) => (h.id === id ? res.habit : h)));
    } else if (res) {
      setHabits((prev) => prev.map((h) => (h.id === id ? res : h)));
    }
    if (res?.garden) {
      setGarden(res.garden);
    }
    return res;
  }, []);

  const useFreezeToday = useCallback(async () => {
    const date = todayStr();
    const updatedGarden = await applyGardenFreeze(date);
    setGarden(updatedGarden);
    return updatedGarden;
  }, []);

  return {
    habits,
    garden,
    loading,
    error,
    reload: loadAll,
    refresh: loadAll,
    addHabit,
    editHabit,
    removeHabit,
    toggleHabit,
    useFreezeToday,
  };
}

export default useHabits;
