import React, { useState, useMemo } from "react";
import {
  Plus,
  X,
  Calendar,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Laptop,
  Plane,
  Car,
  PiggyBank,
  CreditCard,
  StickyNote,
  Target,
  Wallet,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F8F7FC",
  primary: "#6C4DFF",
  primaryDark: "#5A3DEF",
  secondary: "#8B6CFF",
  text: "#1F1B2E",
  subtext: "#8B879C",
  border: "#ECE9F7",
  green: "#1FAA6D",
  greenBg: "#E7F8F0",
  amber: "#D97B2D",
  amberBg: "#FDF1E6",
  red: "#E0483C",
  redBg: "#FCEAE8",
};

const ICONS = {
  laptop: Laptop,
  plane: Plane,
  car: Car,
  piggy: PiggyBank,
  target: Target,
};

/* ------------------------------------------------------------------ */
/* Dummy data                                                          */
/* ------------------------------------------------------------------ */
const initialGoals = [
  {
    id: "g1",
    title: "Buy Laptop",
    icon: "laptop",
    targetAmount: 1500,
    currentAmount: 600,
    deadline: "2026-12-31",
    description: "Save for a new laptop for work and school.",
    deposits: [
      { id: "d1", title: "One-time Deposit", date: "2026-07-10", source: "ABA", amount: 200, notes: "" },
      { id: "d2", title: "Monthly Auto-Save", date: "2026-07-01", source: "Acleda", amount: 120, notes: "" },
      { id: "d3", title: "Spare Change Round-up", date: "2026-06-28", source: "12 transactions", amount: 14.52, notes: "" },
    ],
  },
  {
    id: "g2",
    title: "Japan Trip",
    icon: "plane",
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: "2026-11-01",
    description: "Two week trip through Tokyo, Kyoto, and Osaka.",
    deposits: [
      { id: "d4", title: "One-time Deposit", date: "2026-06-15", source: "Savings Account", amount: 500, notes: "Tax refund" },
    ],
  },
  {
    id: "g3",
    title: "New Car Fund",
    icon: "car",
    targetAmount: 25000,
    currentAmount: 8500,
    deadline: "2027-06-01",
    description: "Save up for a reliable used car.",
    deposits: [],
  },
  {
    id: "g4",
    title: "Emergency Fund",
    icon: "piggy",
    targetAmount: 5000,
    currentAmount: 5000,
    deadline: "2026-05-01",
    description: "Three months of living expenses set aside.",
    deposits: [
      { id: "d5", title: "One-time Deposit", date: "2026-04-20", source: "Checking Account", amount: 5000, notes: "" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatCurrency(n) {
  return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, "");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getProgress(goal) {
  if (!goal.targetAmount) return 0;
  return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
}

function getStatus(goal) {
  if (goal.currentAmount >= goal.targetAmount) return "Completed";
  if (goal.deadline && new Date(goal.deadline) < new Date()) return "Overdue";
  return "Active";
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function GoalIcon({ type, size = 22, color = COLORS.primary }) {
  const Icon = ICONS[type] || Target;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

function ProgressBar({ percent, height = 10 }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, backgroundColor: "#EDEAFB" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${percent}%`,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
        }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Active: { bg: COLORS.amberBg, fg: COLORS.amber, icon: Clock },
    Completed: { bg: COLORS.greenBg, fg: COLORS.green, icon: CheckCircle2 },
    Overdue: { bg: COLORS.redBg, fg: COLORS.red, icon: AlertTriangle },
  };
  const cfg = map[status] || map.Active;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PrimaryButton({ children, onClick, className = "", disabled, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
      } ${className}`}
      style={{ backgroundColor: COLORS.primary, boxShadow: disabled ? "none" : "0 8px 20px -8px rgba(108,77,255,0.55)" }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      style={{ backgroundColor: "#EFECFC", color: COLORS.primary }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all duration-200 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors duration-150 border";

function TextInput(props) {
  return (
    <input
      {...props}
      className={inputClass}
      style={{ borderColor: COLORS.border, backgroundColor: "#FBFAFE", ...(props.style || {}) }}
      onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
      onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
    />
  );
}

function SelectInput({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={inputClass + " appearance-none pr-9 cursor-pointer"}
        style={{ borderColor: COLORS.border, backgroundColor: "#FBFAFE", color: COLORS.text }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        color={COLORS.subtext}
      />
    </div>
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={inputClass + " resize-none"}
      style={{ borderColor: COLORS.border, backgroundColor: "#FBFAFE", ...(props.style || {}) }}
      onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
      onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Modal shell                                                         */
/* ------------------------------------------------------------------ */
function Modal({ open, onClose, children, maxWidth = 480 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(31,27,46,0.45)", animation: "svg-fade-in 0.18s ease-out" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxWidth, animation: "svg-modal-in 0.22s cubic-bezier(0.16,1,0.3,1)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {children}
      </div>
      <style>{`
        @keyframes svg-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes svg-modal-in { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between px-7 pt-6 pb-2">
      <div>
        <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: COLORS.subtext }}>
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 transition-colors duration-150 hover:bg-gray-100"
        style={{ color: COLORS.subtext }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Goal Card                                                           */
/* ------------------------------------------------------------------ */
function SavingGoalCard({ goal, onOpen, index }) {
  const percent = getProgress(goal);
  const status = getStatus(goal);
  return (
    <div
      onClick={() => onOpen(goal.id)}
      className="w-full bg-white rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
      style={{
        boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)",
        border: `1px solid ${COLORS.border}`,
        animation: `svg-card-in 0.4s ease-out both`,
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 14px 30px -10px rgba(76,60,140,0.22)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 18px -6px rgba(76,60,140,0.10)")}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex items-center gap-4 md:w-64 shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#EFEAFF" }}
          >
            <GoalIcon type={goal.icon} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate" style={{ color: COLORS.text }}>
              {goal.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.subtext }}>
              Target {formatCurrency(goal.targetAmount)}
            </p>
            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: COLORS.subtext }}>
              <Calendar size={11} /> {formatDate(goal.deadline)}
            </p>
          </div>
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5 text-xs font-medium">
            <span style={{ color: COLORS.subtext }}>Current {formatCurrency(goal.currentAmount)}</span>
            <span style={{ color: COLORS.primary }}>{Math.round(percent)}%</span>
            <span style={{ color: COLORS.subtext }}>Target {formatCurrency(goal.targetAmount)}</span>
          </div>
          <ProgressBar percent={percent} />
        </div>

        {/* Right */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-40 shrink-0">
          <StatusBadge status={status} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(goal.id);
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold transition-transform duration-150 hover:translate-x-0.5"
            style={{ color: COLORS.primary }}
          >
            View Details <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <style>{`@keyframes svg-card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */
function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "#EFEAFF" }}
      >
        <PiggyBank size={40} color={COLORS.primary} strokeWidth={1.6} />
      </div>
      <h3 className="text-lg font-bold mb-1.5" style={{ color: COLORS.text }}>
        No Saving Goals Yet
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: COLORS.subtext }}>
        Create your first saving goal to start tracking your savings.
      </p>
      <PrimaryButton onClick={onCreate} className="px-7 py-3 text-base">
        <span className="inline-flex items-center gap-2">
          <Plus size={18} /> Create Saving Goal
        </span>
      </PrimaryButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Create Saving Goal Modal                                            */
/* ------------------------------------------------------------------ */
function CreateSavingGoalModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setTitle("");
    setTarget("");
    setCurrent("");
    setDate("");
    setDescription("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!title.trim() || !target) return;
    onCreate({
      id: "g" + Date.now(),
      title: title.trim(),
      icon: "piggy",
      targetAmount: parseFloat(target) || 0,
      currentAmount: parseFloat(current) || 0,
      deadline: date || null,
      description: description.trim(),
      deposits: [],
    });
    reset();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Create Saving Goal" subtitle="Set up a new saving goal." onClose={handleClose} />
      <div className="px-7 pb-2 pt-3">
        <Field label="Goal Title">
          <TextInput
            placeholder="e.g. Buy Laptop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Target Amount">
            <TextInput
              type="number"
              placeholder="$0.00"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </Field>
          <Field label="Current Amount (optional)">
            <TextInput
              type="number"
              placeholder="$0.00"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Target Date">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Description">
          <TextArea
            rows={3}
            placeholder="Describe what success looks like for this goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Goal Type">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-not-allowed"
            style={{ backgroundColor: COLORS.primary, color: "white" }}
          >
            <Wallet size={15} /> Saving
          </div>
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <GhostButton onClick={handleClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSave} disabled={!title.trim() || !target}>
          Save Goal
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Edit Goal Modal                                                     */
/* ------------------------------------------------------------------ */
function EditSavingGoalModal({ open, goal, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTarget(String(goal.targetAmount));
      setDate(goal.deadline || "");
      setDescription(goal.description || "");
    }
  }, [goal, open]);

  if (!goal) return null;

  function handleSave() {
    onSave(goal.id, {
      title: title.trim() || goal.title,
      targetAmount: parseFloat(target) || goal.targetAmount,
      deadline: date || goal.deadline,
      description,
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Edit Goal" subtitle="Update the details of this saving goal." onClose={onClose} />
      <div className="px-7 pb-2 pt-3">
        <Field label="Goal Title">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Target Amount">
          <TextInput type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        </Field>
        <Field label="Deadline">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Description">
          <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSave}>Save Changes</PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Deposit Modal                                                       */
/* ------------------------------------------------------------------ */
const PAYMENT_SOURCES = ["ABA", "Acleda", "Wing", "Bank Account", "Cash"];

function DepositModal({ open, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState(PAYMENT_SOURCES[0]);
  const [notes, setNotes] = useState("");

  function reset() {
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setSource(PAYMENT_SOURCES[0]);
    setNotes("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!amount) return;
    onSave({
      id: "d" + Date.now(),
      title: "One-time Deposit",
      date,
      source: source.trim() || "Bank Account",
      amount: parseFloat(amount) || 0,
      notes,
    });
    reset();
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={440}>
      <ModalHeader title="Deposit Funds" subtitle="Add a deposit toward this goal." onClose={handleClose} />
      <div className="px-7 pb-2 pt-3">
        <Field label="Deposit Amount">
          <TextInput
            type="number"
            placeholder="$0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Deposit Date">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Payment Source">
          <SelectInput value={source} onChange={(e) => setSource(e.target.value)}>
            {PAYMENT_SOURCES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Notes">
          <TextArea rows={2} placeholder="Optional note..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <div className="flex items-center justify-end gap-3 px-7 py-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <GhostButton onClick={handleClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSave} disabled={!amount}>
          Save Deposit
        </PrimaryButton>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Deposit History                                                     */
/* ------------------------------------------------------------------ */
function DepositHistory({ deposits }) {
  const sorted = useMemo(
    () => [...deposits].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [deposits]
  );

  return (
    <div
      className="bg-white rounded-3xl p-6"
      style={{ boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)", border: `1px solid ${COLORS.border}` }}
    >
      <h3 className="font-bold mb-4" style={{ color: COLORS.text }}>
        Deposit History
      </h3>
      {sorted.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: COLORS.subtext }}>
          No deposits yet. Make your first deposit to see it here.
        </p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: COLORS.border }}>
          {sorted.map((dep, i) => (
            <div
              key={dep.id}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              style={{ animation: "svg-card-in 0.35s ease-out both", animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EFEAFF" }}
                >
                  <CreditCard size={16} color={COLORS.primary} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: COLORS.text }}>
                    {dep.title}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.subtext }}>
                    {formatDate(dep.date)} &middot; {dep.source}
                  </p>
                  {dep.notes && (
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: COLORS.subtext }}>
                      <StickyNote size={10} /> {dep.notes}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold shrink-0" style={{ color: COLORS.green }}>
                +{formatCurrency(dep.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Goal Detail                                                         */
/* ------------------------------------------------------------------ */
function SavingGoalDetail({ goal, onBack, onDeposit, onEdit }) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const percent = getProgress(goal);
  const status = getStatus(goal);
  const isCompleted = status === "Completed";

  return (
    <div style={{ animation: "svg-fade-in 0.25s ease-out" }}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold mb-5 transition-transform duration-150 hover:-translate-x-0.5"
        style={{ color: COLORS.subtext }}
      >
        <ArrowLeft size={16} /> Back to Saving Goals
      </button>

      {/* Summary card */}
      <div
        className="bg-white rounded-3xl p-8 mb-6"
        style={{ boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)", border: `1px solid ${COLORS.border}` }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#EFEAFF" }}
            >
              <GoalIcon type={goal.icon} size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>
                {goal.title}
              </h2>
              <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: COLORS.subtext }}>
                <Calendar size={12} /> Due {formatDate(goal.deadline)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <span className="text-3xl font-extrabold" style={{ color: COLORS.primary }}>
              {Math.round(percent)}%
            </span>
          </div>
        </div>

        {goal.description && (
          <p className="text-sm mb-6" style={{ color: COLORS.subtext }}>
            {goal.description}
          </p>
        )}

        <ProgressBar percent={percent} height={14} />
        <div className="flex items-center justify-between mt-2 mb-7 text-sm font-medium">
          <span style={{ color: COLORS.text }}>{formatCurrency(goal.currentAmount)} saved</span>
          <span style={{ color: COLORS.subtext }}>
            {isCompleted ? "Goal reached!" : `${formatCurrency(goal.targetAmount - goal.currentAmount)} left`}
          </span>
          <span style={{ color: COLORS.text }}>{formatCurrency(goal.targetAmount)} target</span>
        </div>

        <div className="flex items-center gap-3">
          <SecondaryButton onClick={() => setEditOpen(true)}>Edit Goal</SecondaryButton>
          <PrimaryButton onClick={() => setDepositOpen(true)} disabled={isCompleted}>
            {isCompleted ? "Goal Completed" : "Deposit Now"}
          </PrimaryButton>
        </div>
      </div>

      <DepositHistory deposits={goal.deposits} />

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSave={(dep) => {
          onDeposit(goal.id, dep);
          setDepositOpen(false);
        }}
      />
      <EditSavingGoalModal
        open={editOpen}
        goal={goal}
        onClose={() => setEditOpen(false)}
        onSave={(id, updates) => {
          onEdit(id, updates);
          setEditOpen(false);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function SavingsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedId, setSelectedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedGoal = goals.find((g) => g.id === selectedId);

  function handleCreate(goal) {
    setGoals((prev) => [goal, ...prev]);
    setCreateOpen(false);
  }

  function handleDeposit(goalId, deposit) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + deposit.amount, deposits: [deposit, ...g.deposits] }
          : g
      )
    );
  }

  function handleEdit(goalId, updates) {
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {selectedGoal ? (
          <SavingGoalDetail
            goal={selectedGoal}
            onBack={() => setSelectedId(null)}
            onDeposit={handleDeposit}
            onEdit={handleEdit}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                  Savings Goals
                </h1>
                <p className="text-sm mt-1" style={{ color: COLORS.subtext }}>
                  Track your saving goals and monitor your progress.
                </p>
              </div>
              {goals.length > 0 && (
                <PrimaryButton onClick={() => setCreateOpen(true)}>
                  <span className="inline-flex items-center gap-2">
                    <Plus size={17} /> Create Saving Goal
                  </span>
                </PrimaryButton>
              )}
            </div>

            {/* List */}
            {goals.length === 0 ? (
              <div
                className="bg-white rounded-3xl"
                style={{ boxShadow: "0 2px 18px -6px rgba(76,60,140,0.10)", border: `1px solid ${COLORS.border}` }}
              >
                <EmptyState onCreate={() => setCreateOpen(true)} />
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {goals.map((goal, i) => (
                  <SavingGoalCard key={goal.id} goal={goal} onOpen={setSelectedId} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateSavingGoalModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />

      <style>{`
        @keyframes svg-fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}