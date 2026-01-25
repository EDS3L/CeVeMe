import { STAR_CRITERIA } from "../../utils/constants";

export default function STARAnalysis({ starData }) {
  if (!starData) {
    return (
      <div className="text-center text-[var(--color-clouddark)] py-8">
        Brak danych STAR
      </div>
    );
  }

  const totalPossible = Object.values(STAR_CRITERIA).reduce(
    (sum, c) => sum + c.maxScore,
    0,
  );
  const totalScore = Object.keys(STAR_CRITERIA).reduce(
    (sum, key) => sum + (starData[key] || 0),
    0,
  );
  const percentage = Math.round((totalScore / totalPossible) * 100);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-green-800">Analiza STAR</h3>
          <p className="text-sm text-green-600">
            Średnia ocena struktury odpowiedzi
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-700">
            {totalScore}
            <span className="text-lg text-green-500">/{totalPossible}</span>
          </div>
          <div className="text-sm text-green-600">{percentage}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STAR_CRITERIA).map(([key, criteria]) => {
          const score = starData[key] || 0;
          const percent = Math.round((score / criteria.maxScore) * 100);

          return (
            <div
              key={key}
              className="bg-white rounded-xl p-4 border border-green-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                  {key.charAt(0).toUpperCase()}
                </span>
                <span className="text-xl font-bold text-green-700">
                  {score}
                  <span className="text-sm text-green-400">
                    /{criteria.maxScore}
                  </span>
                </span>
              </div>

              <div className="text-sm font-medium text-green-800 mb-1">
                {criteria.name}
              </div>

              <div className="w-full h-1.5 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-xs text-green-600 mt-2">
                {criteria.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white rounded-xl border border-green-100">
        <h4 className="text-sm font-semibold text-green-800 mb-2">
          💡 Wskazówki do poprawy
        </h4>
        <ul className="space-y-1">
          {Object.entries(STAR_CRITERIA)
            .filter(([key]) => (starData[key] || 0) < 20)
            .slice(0, 2)
            .map(([key, criteria]) => (
              <li
                key={key}
                className="text-sm text-green-700 flex items-start gap-2"
              >
                <span className="text-green-400 mt-0.5">→</span>
                Pracuj nad sekcją "{criteria.name}": {criteria.description}
              </li>
            ))}
          {Object.entries(STAR_CRITERIA).filter(
            ([key]) => (starData[key] || 0) < 20,
          ).length === 0 && (
            <li className="text-sm text-green-700">
              ✓ Świetnie! Wszystkie elementy STAR są na dobrym poziomie.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
