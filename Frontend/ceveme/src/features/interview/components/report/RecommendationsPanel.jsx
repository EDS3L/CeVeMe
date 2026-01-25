import { Lightbulb } from "lucide-react";

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations) {
    return (
      <div className="text-center text-[var(--color-clouddark)] py-8">
        Brak rekomendacji
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800 mb-2">
            Rekomendacje dla Ciebie
          </h4>
          <p className="text-[var(--color-slatedark)] whitespace-pre-line">
            {recommendations}
          </p>
        </div>
      </div>
    </div>
  );
}
