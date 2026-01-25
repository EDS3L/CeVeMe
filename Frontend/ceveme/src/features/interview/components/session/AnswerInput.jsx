import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function AnswerInput({
  onSubmit,
  disabled = false,
  submitting = false,
  placeholder = "Wpisz swoją odpowiedź tutaj...",
  minLength = 50,
}) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim().length >= minLength && !submitting) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const charCount = answer.length;
  const isValid = charCount >= minLength;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || submitting}
        placeholder={placeholder}
        rows={6}
        className="w-full p-4 text-[var(--color-slatedark)] placeholder-[var(--color-clouddark)] resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <div className="px-4 py-3 border-t border-[var(--color-ivorydark)] bg-[var(--color-ivorylight)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`text-sm ${
              isValid ? "text-green-600" : "text-[var(--color-clouddark)]"
            }`}
          >
            {charCount} znaków
            {!isValid && (
              <span className="text-[var(--color-clouddark)]">
                {" "}
                (min. {minLength})
              </span>
            )}
          </span>
          <span className="text-xs text-[var(--color-clouddark)]">
            Ctrl + Enter aby wysłać
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || disabled || submitting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
            isValid && !disabled && !submitting
              ? "bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white hover:shadow-lg hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Wyślij odpowiedź
            </>
          )}
        </button>
      </div>
    </div>
  );
}
