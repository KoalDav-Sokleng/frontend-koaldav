import { useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Education",
  "Health",
  "Other",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "💡",
  Education: "📚",
  Health: "💊",
  Other: "📦",
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  title: "",
  amount: "",
  category: "",
  date: getTodayDate(),
  description: "",
};

export default function AddExpenseModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(parseFloat(form.amount)))
      e.amount = "Valid amount required";
    if (!form.category) e.category = "Pick a category";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    await onSubmit?.(form);
    setSubmitted(true);
    setTimeout(onClose, 1400);
  }

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      style={{ background: "rgba(17,24,39,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        style={{ border: "1px solid #ECEBF5" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (sticky/shrink-0) */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 shrink-0 bg-white"
          style={{ borderBottom: "1px solid #F0EEFF" }}
        >
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              Add Expense
            </h2>
            <p className="text-xs mt-0.5 text-gray-400">
              Record a new transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-base font-bold text-gray-900">
              Expense Recorded!
            </p>
            <p className="text-xs mt-1 text-gray-400">
              {CATEGORY_ICONS[form.category]} {form.title} — $
              {parseFloat(form.amount || 0).toFixed(2)}
            </p>
          </div>
        ) : (
          /* Scrollable Form Body */
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 flex flex-col gap-3.5">
            {/* Title */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch, Grab Ride, Electricity Bill"
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all"
                style={{
                  border: `1.5px solid ${errors.title ? "#EF4444" : "#ECEBF5"}`,
                  background: "#FAFAFA",
                  color: "#111827",
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  !errors.title && (e.target.style.borderColor = "#6C63FF")
                }
                onBlur={(e) =>
                  !errors.title && (e.target.style.borderColor = "#ECEBF5")
                }
              />
              {errors.title && (
                <p className="text-xs mt-1 text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm select-none font-semibold text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => field("amount", e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all"
                  style={{
                    border: `1.5px solid ${errors.amount ? "#EF4444" : "#ECEBF5"}`,
                    background: "#FAFAFA",
                    color: "#111827",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    !errors.amount && (e.target.style.borderColor = "#6C63FF")
                  }
                  onBlur={(e) =>
                    !errors.amount && (e.target.style.borderColor = "#ECEBF5")
                  }
                />
              </div>
              {errors.amount && (
                <p className="text-xs mt-1 text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Category chips */}
            <div>
              <label className="block text-xs mb-1.5 font-semibold text-gray-700">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => field("category", cat)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                    style={{
                      fontWeight: 600,
                      background: form.category === cat ? "#6C63FF" : "#F4F2FF",
                      color: form.category === cat ? "#fff" : "#6C63FF",
                      border:
                        form.category === cat
                          ? "1.5px solid #6C63FF"
                          : "1.5px solid #EDE9FE",
                      fontFamily: "inherit",
                    }}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span> {cat}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-xs mt-1 text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => field("date", e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid #ECEBF5",
                  background: "#FAFAFA",
                  color: "#111827",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "#ECEBF5")}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700">
                Description{" "}
                <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Lunch with friends"
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none transition-all resize-none"
                style={{
                  border: "1.5px solid #ECEBF5",
                  background: "#FAFAFA",
                  color: "#111827",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "#ECEBF5")}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-1 shrink-0 cursor-pointer shadow-sm whitespace-nowrap"
              style={{
                background: "#6C63FF",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              Submit Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
