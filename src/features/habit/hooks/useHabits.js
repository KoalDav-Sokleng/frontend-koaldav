import { useState, useEffect, useCallback } from "react";
import * as habitApi from "../api/habitApi";

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, gardenData] = await Promise.allSettled([
        habitApi.getHabits(),
        habitApi.getGarden(),
      ]);
      if (habitsData.status === "fulfilled") setHabits(habitsData.value || []);
      if (gardenData.status === "fulfilled") setGarden(gardenData.value || null);
    } catch (err) {
      setError(err?.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = useCallback(async (payload) => {
    const newHabit = await habitApi.createHabit(payload);
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  }, []);

  const toggleHabit = useCallback(async (id, date) => {
    const updated = await habitApi.toggleHabitDone(id, date);
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? updated : h))
    );
    return updated;
  }, []);

  return {
    habits,
    garden,
    loading,
    error,
    refresh: fetchHabits,
    addHabit,
    toggleHabit,
  };
}

export default useHabits;
