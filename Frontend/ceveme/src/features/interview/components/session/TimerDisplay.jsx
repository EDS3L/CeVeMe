import { Clock, AlertCircle } from "lucide-react";

export default function TimerDisplay({
  seconds,
  formattedTime,
  percentRemaining,
  isExpired,
  isRunning,
  compact = false,
}) {
  const getColorClass = () => {
    if (isExpired) return "text-red-600";
    if (percentRemaining <= 20) return "text-red-500";
    if (percentRemaining <= 50) return "text-orange-500";
    return "text-[var(--color-slatedark)]";
  };

  const getBackgroundClass = () => {
    if (isExpired) return "bg-red-100 border-red-300";
    if (percentRemaining <= 20) return "bg-red-50 border-red-200";
    if (percentRemaining <= 50) return "bg-orange-50 border-orange-200";
    return "bg-[var(--color-ivorylight)] border-[var(--color-ivorydark)]";
  };

  const getProgressColor = () => {
    if (isExpired) return "bg-red-500";
    if (percentRemaining <= 20) return "bg-red-500";
    if (percentRemaining <= 50) return "bg-orange-500";
    return "bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)]";
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getBackgroundClass()}`}
      >
        {isExpired ? (
          <AlertCircle className={`w-4 h-4 ${getColorClass()}`} />
        ) : (
          <Clock
            className={`w-4 h-4 ${getColorClass()} ${isRunning ? "animate-pulse" : ""}`}
          />
        )}
        <span className={`font-mono font-bold ${getColorClass()}`}>
          {formattedTime}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${getBackgroundClass()} overflow-hidden`}
    >
      <div className="p-6 flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
            isExpired
              ? "bg-red-200"
              : percentRemaining <= 20
                ? "bg-red-100"
                : percentRemaining <= 50
                  ? "bg-orange-100"
                  : "bg-[var(--color-kraft)]/20"
          }`}
        >
          {isExpired ? (
            <AlertCircle className="w-10 h-10 text-red-600" />
          ) : (
            <Clock
              className={`w-10 h-10 ${getColorClass()} ${
                isRunning && percentRemaining <= 50 ? "animate-pulse" : ""
              }`}
            />
          )}
        </div>

        <div className={`text-4xl font-mono font-bold mb-2 ${getColorClass()}`}>
          {formattedTime}
        </div>

        {isExpired ? (
          <p className="text-sm text-red-600 font-medium">Czas minął!</p>
        ) : (
          <p className="text-sm text-[var(--color-clouddark)]">
            {isRunning ? "Pozostało" : "Pauza"}
          </p>
        )}
      </div>

      <div className="h-2 bg-gray-200">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-1000`}
          style={{ width: `${percentRemaining}%` }}
        />
      </div>
    </div>
  );
}
