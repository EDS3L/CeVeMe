import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Star,
  ArrowRight,
} from "lucide-react";
import { SCORE_THRESHOLDS } from "../../utils/constants";

export default function FeedbackCard({
  feedback,
  onNext,
  isLastQuestion = false,
}) {
  if (!feedback) return null;

  const getScoreColor = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return "text-green-600";
    if (score >= SCORE_THRESHOLDS.GOOD) return "text-blue-600";
    if (score >= SCORE_THRESHOLDS.AVERAGE) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return "bg-green-100";
    if (score >= SCORE_THRESHOLDS.GOOD) return "bg-blue-100";
    if (score >= SCORE_THRESHOLDS.AVERAGE) return "bg-orange-100";
    return "bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return "Doskonale!";
    if (score >= SCORE_THRESHOLDS.GOOD) return "Dobrze";
    if (score >= SCORE_THRESHOLDS.AVERAGE) return "Przeciętnie";
    return "Do poprawy";
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-[var(--color-ivorylight)] to-white border-b border-[var(--color-ivorydark)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-16 h-16 rounded-2xl ${getScoreBg(feedback.overallScore)} flex items-center justify-center`}
            >
              <span
                className={`text-2xl font-bold ${getScoreColor(feedback.overallScore)}`}
              >
                {feedback.overallScore}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-slatedark)]">
                {getScoreLabel(feedback.overallScore)}
              </h3>
              <p className="text-sm text-[var(--color-clouddark)]">
                Twój wynik z tej odpowiedzi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(feedback.overallScore / 20)
                    ? "text-[var(--color-kraft)] fill-[var(--color-kraft)]"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {(feedback.situationScore ||
          feedback.taskScore ||
          feedback.actionScore ||
          feedback.resultScore) && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-slatedark)] mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--color-kraft)]" />
              Ocena metodą STAR
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  key: "situationScore",
                  name: "Sytuacja",
                  score: feedback.situationScore,
                },
                {
                  key: "taskScore",
                  name: "Zadanie",
                  score: feedback.taskScore,
                },
                {
                  key: "actionScore",
                  name: "Akcja",
                  score: feedback.actionScore,
                },
                {
                  key: "resultScore",
                  name: "Rezultat",
                  score: feedback.resultScore,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="bg-[var(--color-ivorylight)] rounded-xl p-3 text-center"
                >
                  <div className="text-2xl font-bold text-[var(--color-slatedark)]">
                    {item.score || 0}
                    <span className="text-sm text-[var(--color-clouddark)]">
                      %
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-clouddark)] mt-1">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <ScoreItem label="Trafność" score={feedback.relevanceScore} />
          <ScoreItem label="Pewność" score={feedback.confidenceScore} />
          <ScoreItem label="Głębokość" score={feedback.depthScore} />
        </div>

        {feedback.strengths && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mocne strony
            </h4>
            <p className="text-sm text-green-700">{feedback.strengths}</p>
          </div>
        )}

        {feedback.improvements && (
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Co poprawić
            </h4>
            <p className="text-sm text-orange-700">{feedback.improvements}</p>
          </div>
        )}

        {feedback.sampleAnswer && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Przykład lepszej odpowiedzi
            </h4>
            <p className="text-sm text-purple-700 italic">
              "{feedback.sampleAnswer}"
            </p>
          </div>
        )}

        {feedback.keyPointsCovered && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              ✓ Uwzględnione punkty
            </h4>
            <p className="text-sm text-blue-700">{feedback.keyPointsCovered}</p>
          </div>
        )}

        {feedback.keyPointsMissed && (
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
              ⚠ Pominięte punkty
            </h4>
            <p className="text-sm text-yellow-700">
              {feedback.keyPointsMissed}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--color-ivorydark)] bg-[var(--color-ivorylight)]">
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white hover:shadow-lg transition-all"
        >
          {isLastQuestion ? (
            <>Zobacz raport</>
          ) : (
            <>
              Następne pytanie
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ScoreItem({ label, score }) {
  const getColor = (s) => {
    if (!s) return "text-gray-400 bg-gray-100";
    if (s >= 85) return "text-green-600 bg-green-100";
    if (s >= 70) return "text-blue-600 bg-blue-100";
    if (s >= 55) return "text-orange-500 bg-orange-100";
    return "text-red-500 bg-red-100";
  };

  return (
    <div className="bg-[var(--color-ivorylight)] rounded-xl p-3">
      <div className="text-xs text-[var(--color-clouddark)]">{label}</div>
      <div className={`text-lg font-bold ${getColor(score).split(" ")[0]}`}>
        {score || 0}%
      </div>
    </div>
  );
}
