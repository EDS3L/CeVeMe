import { QUESTION_CATEGORIES } from "../../utils/constants";
import { HelpCircle } from "lucide-react";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  category,
  starHint,
}) {
  const categoryInfo =
    QUESTION_CATEGORIES[category] || QUESTION_CATEGORIES.TECHNICAL;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-ivorydark)] bg-gradient-to-r from-[var(--color-ivorylight)] to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${categoryInfo.color}20` }}
            >
              <HelpCircle
                className="w-5 h-5"
                style={{ color: categoryInfo.color }}
              />
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--color-clouddark)]">
                Pytanie {questionNumber} z {totalQuestions}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${categoryInfo.color}20`,
                    color: categoryInfo.color,
                  }}
                >
                  {categoryInfo.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[var(--color-clouddark)]">
            {[...Array(totalQuestions)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < questionNumber
                    ? "bg-[var(--color-kraft)]"
                    : i === questionNumber - 1
                      ? "bg-[var(--color-bookcloth)]"
                      : "bg-[var(--color-ivorydark)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-slatedark)] leading-relaxed">
          {question}
        </h2>

        {starHint && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">
              💡 Wskazówka
            </p>
            <p className="text-sm text-green-700">{starHint}</p>
          </div>
        )}

        {!starHint && category === "BEHAVIORAL" && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">
              💡 Wskazówka: Użyj metody STAR
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { letter: "S", word: "Sytuacja", desc: "Opisz kontekst" },
                { letter: "T", word: "Zadanie", desc: "Twój cel" },
                { letter: "A", word: "Akcja", desc: "Co zrobiłeś" },
                { letter: "R", word: "Rezultat", desc: "Jaki efekt" },
              ].map((item) => (
                <div
                  key={item.letter}
                  className="flex items-center gap-2 text-xs text-green-700"
                >
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    {item.letter}
                  </span>
                  <span>{item.word}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
