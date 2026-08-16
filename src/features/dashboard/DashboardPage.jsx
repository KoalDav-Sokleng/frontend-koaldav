import { useDashboard } from "./hooks/useDashboard";
import DashboardSummary from "./components/DashboardSummary";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>

      {loading && <p className="text-sm text-gray-400">Loading summary...</p>}
      {error && (
        <p className="text-sm text-red-500">
          Couldn't load dashboard data yet — connect the backend to see live numbers.
        </p>
      )}

      <DashboardSummary summary={data} />
    </div>
  );
}
