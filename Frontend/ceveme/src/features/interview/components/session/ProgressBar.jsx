export default function ProgressBar({
  current,
  total,
  showLabels = true,
  size = "md",
  animated = true,
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-slatedark)]">
            Postęp
          </span>
          <span className="text-sm text-[var(--color-clouddark)]">
            {current} / {total}
          </span>
        </div>
      )}

      <div
        className={`w-full bg-[var(--color-ivorydark)] rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${sizeClasses[size]} bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] rounded-full ${
            animated ? "transition-all duration-500 ease-out" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabels && (
        <div className="flex items-center justify-end mt-1">
          <span className="text-xs text-[var(--color-clouddark)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
