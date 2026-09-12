import { Check, X } from "lucide-react";

function getPasswordCriteria(password = "") {
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const criteria = [
    { label: "At least 8 characters", met: hasLength },
    { label: "Contains a number (0-9)", met: hasNumber },
    { label: "Special character (!@#$%^&*)", met: hasSpecial },
    { label: "Contains letters", met: hasLetter },
  ];

  const passedCount = criteria.filter((c) => c.met).length;
  const isStrong = hasLength && hasNumber && hasSpecial;

  return { criteria, passedCount, isStrong };
}

export default function PasswordStrengthMeter({ password = "" }) {
  if (!password) return null;

  const { criteria, passedCount } = getPasswordCriteria(password);

  const strengthConfig = [
    {
      label: "Too weak",
      color: "bg-red-400",
      textColor: "text-red-500",
      percent: 15,
    },
    {
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-500",
      percent: 25,
    },
    {
      label: "Fair",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      percent: 50,
    },
    {
      label: "Good",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      percent: 75,
    },
    {
      label: "Strong",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      percent: 100,
    },
  ];

  const current = strengthConfig[passedCount];

  return (
    <div className="space-y-2 pt-1 animate-fade-in-up">
      {/* Progress Bar & Label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-slate-500">Password Strength</span>
          <span
            className={`transition-colors duration-300 font-bold ${current.textColor}`}
          >
            {current.label}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${current.color}`}
            style={{ width: `${current.percent}%` }}
          />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
        {criteria.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-1.5 transition-all duration-200 ${
              item.met
                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <div
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                item.met
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400"
              }`}
            >
              {item.met ? <Check size={10} strokeWidth={3} /> : <X size={9} />}
            </div>
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
