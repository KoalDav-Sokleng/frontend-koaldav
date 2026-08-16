import { useEffect, useState } from "react";
import { getFinanceOverview } from "../api/financeApi";

export function useFinanceOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getFinanceOverview()
      .then((res) => !ignore && setData(res))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
}
