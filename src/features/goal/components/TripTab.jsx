import React, { useState } from "react";
import {
  Plus, X, ArrowLeft, Calendar, Clock, Edit2, Trash2,
  TrendingUp, Compass, Wallet, Briefcase, Heart, GraduationCap, Sparkles,
  ImagePlus, Link2, Upload
} from "lucide-react";

// ---------- Static config ----------

const GOAL_TYPES = [
  { id: "trip", label: "Trip", icon: Compass },
  { id: "project", label: "Project", icon: Briefcase },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "health", label: "Health", icon: Heart },
  { id: "learning", label: "Learning", icon: GraduationCap },
];

const GRADIENTS = [
  "from-violet-600 via-purple-600 to-fuchsia-500",
  "from-sky-600 via-blue-600 to-cyan-400",
  "from-emerald-600 via-teal-500 to-cyan-400",
  "from-orange-500 via-amber-500 to-yellow-400",
  "from-indigo-700 via-violet-600 to-purple-500",
];

const seedGoals = [
  {
    id: "g1",
    name: "Swiss Alps Hike",
    type: "trip",
    description: "Trek through the Bernese Oberland.",
    target: 4500,
    saved: 3825,
    deadline: addDays(45),
    createdAt: Date.now() - 1000,
  },
  {
    id: "g2",
    name: "Bali Retreat",
    type: "trip",
    description: "A quiet week by the water.",
    target: 2200,
    saved: 264,
    deadline: addDays(312),
    createdAt: Date.now() - 500,
  },
];

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function fmtMoney(n) {
  return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtDate(dateStr) {
  if (!dateStr) return "No date set";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

function gradientFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function typeMeta(typeId) {
  return GOAL_TYPES.find((t) => t.id === typeId) || GOAL_TYPES[0];
}

// ---------- Progress bar ----------

function ProgressBar({ percent, size = "md" }) {
  const h = size === "lg" ? "h-3" : "h-2";
  return (
    <div className={`w-full ${h} rounded-full bg-slate-100 overflow-hidden`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  );
}

// ---------- Goal Card ----------

function GoalCard({ goal, onOpen }) {
  const pct = Math.round((goal.saved / goal.target) * 100) || 0;
  const gradient = gradientFor(goal.id);
  const left = daysLeft(goal.deadline);
  const Icon = typeMeta(goal.type).icon;

  return (
    <button
      onClick={() => onOpen(goal.id)}
      className="text-left bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {goal.image ? (
          <img
            src={goal.image}
            alt={goal.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <Icon className="w-10 h-10 text-white/80" strokeWidth={1.5} />
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          {pct}% Complete
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900 text-base">{goal.name}</h3>
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">Target</div>
            <div className="font-medium text-slate-700">${fmtMoney(goal.target)}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">Savings</div>
            <div className="font-semibold text-violet-600">${fmtMoney(goal.saved)}</div>
          </div>
        </div>
        <ProgressBar percent={pct} />
        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {left} days to go
          </span>
          <span className="text-xs font-semibold text-violet-600">Add Funds</span>
        </div>
      </div>
    </button>
  );
}

function NewGoalCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center hover:border-violet-300 hover:bg-violet-50/40 transition-colors min-h-64"
    >
      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
        <Plus className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <div className="font-semibold text-slate-800">New Destination</div>
        <div className="text-xs text-slate-400 mt-1">
          Dreaming of somewhere new? Start your saving goal today.
        </div>
      </div>
    </button>
  );
}

// ---------- Modal ----------

function GoalModal({ initial, onClose, onSave }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [target, setTarget] = useState(initial?.target ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline || "");
  const [image, setImage] = useState(initial?.image || "");
  const [imageTab, setImageTab] = useState("upload"); // 'upload' | 'link'
  const [urlDraft, setUrlDraft] = useState(initial?.image || "");
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image is too large. Please pick one under 5MB.");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setUrlDraft("");
    };
    reader.onerror = () => setImageError("Couldn't read that file, try another image.");
    reader.readAsDataURL(file);
  }

  function applyUrl() {
    if (!urlDraft.trim()) {
      setImageError("Paste an image link first.");
      return;
    }
    setImageError("");
    setImage(urlDraft.trim());
  }

  function clearImage() {
    setImage("");
    setUrlDraft("");
    setImageError("");
  }

  function handleSubmit() {
    if (!name.trim()) return setError("Goal name is required.");
    if (!target || Number(target) <= 0) return setError("Enter a target amount greater than 0.");
    if (!deadline) return setError("Pick a target date.");
    setError("");
    onSave({
      name: name.trim(),
      type: "trip",
      description: description.trim(),
      target: Number(target),
      deadline,
      image: image || "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Edit Trip Goal" : "Create Goal"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isEdit ? "Update the details of your trip" : "Define your trip savings goal"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-slate-600">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Japan Trip"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Cover Photo (optional)</label>

            {image ? (
              <div className="mt-1.5 relative rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={image}
                  alt="Goal cover preview"
                  className="w-full h-32 object-cover"
                  onError={() => setImageError("That image link doesn't seem to load.")}
                />
                <button
                  onClick={clearImage}
                  type="button"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="mt-1.5 flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                      imageTab === "upload" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("link")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                      imageTab === "link" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> Paste Link
                  </button>
                </div>

                {imageTab === "upload" ? (
                  <label className="mt-2 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-200 rounded-lg py-5 cursor-pointer hover:border-violet-300 hover:bg-violet-50/40 transition-colors">
                    <ImagePlus className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-500">Tap to choose a photo from your phone</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                    <button
                      type="button"
                      onClick={applyUrl}
                      className="text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 rounded-lg transition-colors"
                    >
                      Use
                    </button>
                  </div>
                )}
              </>
            )}
            {imageError && <p className="text-[11px] text-rose-500 mt-1.5">{imageError}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Goal Type</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {GOAL_TYPES.map((t) => {
                const Icon = t.icon;
                const active = t.id === "trip";
                return (
                  <div
                    key={t.id}
                    aria-disabled="true"
                    title={active ? "Trip goals only" : "Not available for this tracker"}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs font-medium select-none ${
                      active
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              This tracker is for trip goals, so type is locked to Trip.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Goal Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what success looks like for this trip..."
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Target Money</label>
            <input
              type="number"
              min="0"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="3000"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-lg transition-colors"
          >
            {isEdit ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Delete confirm ----------

function ConfirmDelete({ goalName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
        <h3 className="font-bold text-slate-900">Delete "{goalName}"?</h3>
        <p className="text-sm text-slate-500 mt-2">
          This will permanently remove the goal and its savings progress. This can't be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg transition-colors"
          >
            Delete Goal
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Detail page ----------

function GoalDetail({ goal, onBack, onEdit, onDelete, onDeposit }) {
  const [amount, setAmount] = useState("");
  const [depositError, setDepositError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const pct = Math.round((goal.saved / goal.target) * 100) || 0;
  const remaining = Math.max(0, goal.target - goal.saved);
  const left = daysLeft(goal.deadline);
  const gradient = gradientFor(goal.id);
  const Icon = typeMeta(goal.type).icon;

  function handleDeposit() {
    const val = Number(amount);
    if (!val || val <= 0) {
      setDepositError("Enter an amount greater than 0.");
      return;
    }
    onDeposit(goal.id, val);
    setAmount("");
    setDepositError("");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Trip Savings
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-end p-6 overflow-hidden`}>
          {goal.image && (
            <>
              <img
                src={goal.image}
                alt={goal.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </>
          )}
          {!goal.image && (
            <Icon className="w-10 h-10 text-white/60 absolute top-5 left-6" strokeWidth={1.5} />
          )}
          <div className="relative text-white">
            <span className="text-xs font-semibold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
              {pct >= 100 ? "Goal Reached" : "In Progress"}
            </span>
            <h1 className="text-2xl font-bold mt-2">{goal.name}</h1>
          </div>
          <div className="relative ml-auto flex gap-2">
            <button
              onClick={() => onEdit(goal)}
              title="Edit goal"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              title="Delete goal"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {goal.description && (
            <p className="text-sm text-slate-500">{goal.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400">Target</div>
              <div className="text-lg font-bold text-slate-900 mt-1">${fmtMoney(goal.target)}</div>
            </div>
            <div className="bg-violet-50 rounded-xl p-4">
              <div className="text-xs text-violet-400">Saved</div>
              <div className="text-lg font-bold text-violet-700 mt-1">${fmtMoney(goal.saved)}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400">Remaining</div>
              <div className="text-lg font-bold text-slate-900 mt-1">${fmtMoney(remaining)}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="font-semibold text-violet-600">{pct}%</span>
            </div>
            <ProgressBar percent={pct} size="lg" />
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {fmtDate(goal.deadline)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {left} days left
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Deposit Money</h3>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount to add"
                  className="w-full rounded-lg border border-slate-200 pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <button
                onClick={handleDeposit}
                className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Add Funds
              </button>
            </div>
            {depositError && <p className="text-xs text-rose-500 mt-2">{depositError}</p>}
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDelete
          goalName={goal.name}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            onDelete(goal.id);
          }}
        />
      )}
    </div>
  );
}

// ---------- App ----------

export default function App() {
  const [goals, setGoals] = useState(seedGoals);
  const [view, setView] = useState("list"); // 'list' | 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [editingGoal, setEditingGoal] = useState(null);

  const selectedGoal = goals.find((g) => g.id === selectedId) || null;

  function openCreate() {
    setEditingGoal(null);
    setModalMode("create");
  }

  function openEdit(goal) {
    setEditingGoal(goal);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingGoal(null);
  }

  function handleSave(data) {
    if (modalMode === "edit" && editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? { ...g, ...data } : g))
      );
    } else {
      const newGoal = {
        id: "g" + Date.now(),
        saved: 0,
        createdAt: Date.now(),
        ...data,
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
    closeModal();
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setView("list");
    }
  }

  function handleDeposit(id, amount) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g))
    );
  }

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      {view === "list" && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-violet-600 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> ADVENTURE AWAITS
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Your Trip Savings
              </h1>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Create Trip Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="max-w-sm mx-auto mt-16">
              <NewGoalCard onClick={openCreate} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map((g) => (
                <GoalCard key={g.id} goal={g} onOpen={openDetail} />
              ))}
              <NewGoalCard onClick={openCreate} />
            </div>
          )}
        </div>
      )}

      {view === "detail" && selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          onBack={() => setView("list")}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDeposit={handleDeposit}
        />
      )}

      {modalMode && (
        <GoalModal
          initial={editingGoal}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}