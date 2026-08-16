import { useFinanceOverview } from "./hooks/useFinanceOverview";
import FinanceSummaryCard from "./components/FinanceSummaryCard";

export default function FinancePage() {
  const { data, loading, error } = useFinanceOverview();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Finance Overview</h1>

      {loading && <p className="text-sm text-gray-400">Loading finance data...</p>}
      {error && (
        <p className="text-sm text-red-500">
          Couldn't load finance data yet — connect the backend to see live numbers.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FinanceSummaryCard label="Total Income" value={data?.income ?? "—"} />
        <FinanceSummaryCard label="Total Expenses" value={data?.expenses ?? "—"} />
        <FinanceSummaryCard label="Net Savings" value={data?.netSavings ?? "—"} />
      </div>
    </div>
  );
}
