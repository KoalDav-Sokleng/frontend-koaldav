import { useEffect, useState } from "react";
import { getHabits } from "../api/habitApi";

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getHabits()
      .then((res) => !ignore && setHabits(res))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return { habits, loading, error };
}
