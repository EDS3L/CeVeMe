import { QUESTION_CATEGORIES, SCORE_THRESHOLDS } from "../../utils/constants";

export default function CategoryBreakdown({ breakdown }) {
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return (
      <div className="text-center text-[var(--color-clouddark)] py-8">
        Brak danych o kategoriach
      </div>
    );
  }

  const entries = Object.entries(breakdown);

  return (
    <div className="space-y-4">
      {entries.map(([categoryKey, score]) => {
        const category = QUESTION_CATEGORIES[categoryKey] || {
          name: categoryKey,
          color: "#666",
        };

        return (
          <div
            key={categoryKey}
            className="bg-[var(--color-ivorylight)] rounded-xl p-4 border border-[var(--color-ivorydark)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: category.color }}
                  >
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-slatedark)]">
                    {category.name}
                  </h4>
                </div>
              </div>

              <div
                className="text-2xl font-bold"
                style={{ color: getScoreColor(score) }}
              >
                {Math.round(score)}%
              </div>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getScoreColor(score) {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "#22c55e";
  if (score >= SCORE_THRESHOLDS.GOOD) return "#3b82f6";
  if (score >= SCORE_THRESHOLDS.AVERAGE) return "#f59e0b";
  return "#ef4444";
}
