import { useHabits } from "./hooks/useHabits";
import HabitListItem from "./components/HabitListItem";

export default function HabitPage() {
  const { habits, loading, error } = useHabits();

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Habit</h1>

      {loading && <p className="text-sm text-gray-400">Loading habits...</p>}
      {error && (
        <p className="text-sm text-red-500">
          Couldn't load habits yet — connect the backend to see your list.
        </p>
      )}
      {!loading && !error && habits.length === 0 && (
        <p className="text-sm text-gray-400">No habits yet.</p>
      )}

      <div className="space-y-2">
        {habits.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
