import { CheckCircle, TrendingUp, Zap, AlertTriangle } from "lucide-react";

export default function SkillsGapPanel({ strengths, weaknesses }) {
  if (!strengths && !weaknesses) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {strengths && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">Mocne strony</h3>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-800">{strengths}</p>
            </div>
          </div>
        </div>
      )}

      {weaknesses && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-orange-800">Do rozwoju</h3>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-orange-800">{weaknesses}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
