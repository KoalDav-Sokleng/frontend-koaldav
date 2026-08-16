export default function HabitListItem({ habit }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      <span className="text-sm font-medium text-gray-800">{habit.name}</span>
      <span className="text-xs text-gray-500">{habit.streak ?? 0} day streak</span>
    </div>
  );
}
