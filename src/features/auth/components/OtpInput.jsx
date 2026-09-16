import { useRef, useEffect } from "react";

export default function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  autoFocus = true,
}) {
  const inputRefs = useRef([]);

  // Split value into array of length
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      // Cleared
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join(""));
      return;
    }

    // Handle single or multi-digit insertion (like paste or autofill)
    const newDigits = [...digits];
    if (val.length === 1) {
      newDigits[index] = val;
      onChange(newDigits.join(""));
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Pasted multiple digits
      const pastedChars = val.slice(0, length).split("");
      pastedChars.forEach((char, i) => {
        if (index + i < length) {
          newDigits[index + i] = char;
        }
      });
      onChange(newDigits.join(""));
      const nextIndex = Math.min(index + pastedChars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const targetFocus = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetFocus]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 md:gap-3 w-full">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          data-lpignore="true"
          disabled={disabled}
          value={digits[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`h-13 w-11 sm:h-14 sm:w-12 md:h-15 md:w-13 rounded-2xl border-2 text-center text-xl sm:text-2xl font-black transition-all duration-200 outline-none select-none ${
            digits[index]
              ? "border-[#6C63FF] bg-white text-slate-900 dark:border-[#6C63FF] dark:bg-[#151C2C] dark:text-white shadow-md ring-4 ring-[#6C63FF]/15 scale-102"
              : "border-slate-200 bg-[#FAFAFC] text-slate-700 hover:border-[#6C63FF]/40 dark:border-slate-800 dark:bg-[#151C2C] dark:text-slate-200 dark:hover:border-slate-700 focus:border-[#6C63FF] focus:bg-white dark:focus:bg-[#1E293B] focus:ring-4 focus:ring-[#6C63FF]/15"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  );
}
