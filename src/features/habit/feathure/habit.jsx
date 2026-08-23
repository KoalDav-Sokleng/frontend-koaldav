import React, { useState } from 'react';
import { 
  Droplet, 
  BookOpen, 
  Activity, 
  Plus, 
  X, 
  Lightbulb, 
  Check, 
  LayoutDashboard, 
  Calendar, 
  Utensils, 
  Moon 
} from 'lucide-react';

export default function HabitTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Drink Water',
      goal: 'Daily Goal: 8 glasses',
      badge: '12 Day Streak',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: 'droplet',
      accentColor: 'border-blue-500',
      completed: false
    },
    {
      id: 2,
      title: 'Read Book',
      goal: 'Daily Goal: 30 mins',
      badge: '5 Day Streak',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: 'book',
      accentColor: 'border-emerald-500',
      completed: false
    },
    {
      id: 3,
      title: 'Workout',
      goal: 'Daily Goal: 45 mins',
      badge: 'Today Complete',
      badgeColor: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: 'workout',
      accentColor: 'border-rose-500',
      completed: true
    }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('droplet');
  const [selectedColor, setSelectedColor] = useState('bg-indigo-600');

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit = {
      id: Date.now(),
      title,
      goal: 'Daily Goal: 1 target',
      badge: '0 Day Streak',
      badgeColor: 'bg-slate-50 text-slate-400 border-slate-200',
      icon: selectedIcon,
      accentColor: 'border-indigo-600',
      completed: false
    };

    setHabits([...habits, newHabit]);
    setTitle('');
    setIsModalOpen(false);
  };

  const toggleComplete = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'workout':
        return <Activity className="w-5 h-5 text-rose-500" />;
      default:
        return <Droplet className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-8 font-sans text-slate-800 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Main Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Habits</h1>
            <p className="text-xs text-slate-400 mt-1">Track your daily progress and build consistency.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> New Habit
          </button>
        </div>

        {/* Daily Overall Progress Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-700">Daily Overall Progress</span>
            <span className="text-xl font-extrabold text-indigo-600">68%</span>
          </div>
          <div className="w-full bg-indigo-50/60 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[68%] rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Habit Cards List */}
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  {renderIcon(habit.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-tight">{habit.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{habit.goal}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${habit.badgeColor}`}>
                  {habit.badge}
                </span>

                {/* Optional Toggle Button matching bottom red border in screenshot */}
                {habit.completed && (
                  <button 
                    onClick={() => toggleComplete(habit.id)}
                    className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>

              {/* Red/Accent Line Indicator at the Bottom */}
              <div className={`absolute bottom-0 left-0 right-0 border-b-2 ${habit.accentColor}`}></div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-bold text-slate-900">Create New Habit</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-6">Set a daily goal to build a better routine.</p>

            <form onSubmit={handleCreateHabit} className="space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g., Drink Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Icon</label>
                <div className="flex gap-2">
                  {[
                    { id: 'droplet', icon: Droplet },
                    { id: 'book', icon: BookOpen },
                    { id: 'workout', icon: Activity },
                    { id: 'calendar', icon: Calendar },
                    { id: 'utensils', icon: Utensils },
                    { id: 'moon', icon: Moon }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const active = selectedIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIcon(item.id)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Tag Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Color Tag</label>
                <div className="flex gap-3">
                  {[
                    'bg-indigo-600',
                    'bg-emerald-500',
                    'bg-rose-300',
                    'bg-slate-300'
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full ${color} transition ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pro Tip Box */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 flex gap-3 items-start">
                <Lightbulb size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-indigo-950">Pro Tip</h4>
                  <p className="text-[11px] text-indigo-700/80 leading-relaxed mt-0.5">
                    Starting small is the key to consistency. Try setting a target you can hit easily for the first week.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-sm transition"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}