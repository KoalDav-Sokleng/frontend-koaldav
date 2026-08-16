import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboardApi";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getDashboardSummary()
      .then((res) => !ignore && setData(res))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
}
