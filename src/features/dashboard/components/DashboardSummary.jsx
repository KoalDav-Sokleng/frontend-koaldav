const CARDS = [
  { label: "Active Goals", value: "—" },
  { label: "Upcoming Trips", value: "—" },
  { label: "Total Saved", value: "—" },
  { label: "Habit Streak", value: "—" },
];

export default function DashboardSummary({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {card.label}
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {summary?.[card.label] ?? card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
