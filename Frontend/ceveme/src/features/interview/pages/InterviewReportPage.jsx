import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  Trophy,
  Target,
  TrendingUp,
  Star,
} from "lucide-react";
import ScoreRadarChart from "../components/report/ScoreRadarChart";
import CategoryBreakdown from "../components/report/CategoryBreakdown";
import RecommendationsPanel from "../components/report/RecommendationsPanel";
import SkillsGapPanel from "../components/report/SkillsGapPanel";
import { useInterviewReport } from "../hooks/useInterviewHistory";
import { SCORE_THRESHOLDS } from "../utils/constants";

export default function InterviewReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { report, loading, error } = useInterviewReport(sessionId);

  const getScoreLabel = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return "Doskonale!";
    if (score >= SCORE_THRESHOLDS.GOOD) return "Dobrze";
    if (score >= SCORE_THRESHOLDS.AVERAGE) return "Przeciętnie";
    return "Do poprawy";
  };

  const getScoreColor = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT)
      return "text-green-600 bg-green-100";
    if (score >= SCORE_THRESHOLDS.GOOD) return "text-blue-600 bg-blue-100";
    if (score >= SCORE_THRESHOLDS.AVERAGE)
      return "text-orange-500 bg-orange-100";
    return "text-red-500 bg-red-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-bookcloth)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-slatedark)]">
            Generuję raport...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-slatedark)] mb-2">
            Nie można wczytać raportu
          </h2>
          <p className="text-[var(--color-clouddark)] mb-6">
            {error || "Raport nie istnieje"}
          </p>
          <button
            onClick={() => navigate("/interview/history")}
            className="px-6 py-3 bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-xl font-medium"
          >
            Wróć do historii
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/interview/history")}
            className="flex items-center gap-2 text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Historia sesji
          </button>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-ivorydark)] rounded-xl text-[var(--color-slatedark)] hover:bg-[var(--color-ivorylight)] transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Udostępnij</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-ivorydark)] rounded-xl text-[var(--color-slatedark)] hover:bg-[var(--color-ivorylight)] transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Eksportuj PDF</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--color-ivorydark)] shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Raport z rozmowy</h1>
                <p className="text-white/80">{report.jobTitle}</p>
                <p className="text-white/60 text-sm mt-1">
                  {report.company} • {report.completedAt}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`w-28 h-28 rounded-2xl ${getScoreColor(report.overallScore)} flex flex-col items-center justify-center`}
                >
                  <span className="text-4xl font-bold">
                    {report.overallScore}
                  </span>
                  <span className="text-sm">/ 100</span>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold">
                    {getScoreLabel(report.overallScore)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(report.overallScore / 20)
                            ? "text-yellow-300 fill-yellow-300"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={Target}
                label="Pytania"
                value={`${report.answeredQuestions}/${report.totalQuestions}`}
                color="blue"
              />
              <StatCard
                icon={Trophy}
                label="Tryb"
                value={report.mode}
                color="yellow"
              />
              <StatCard
                icon={TrendingUp}
                label="Status"
                value={
                  report.status === "COMPLETED" ? "Ukończono" : "W trakcie"
                }
                color="green"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-[var(--color-ivorylight)] rounded-2xl p-6 border border-[var(--color-ivorydark)]">
                <h3 className="text-lg font-bold text-[var(--color-slatedark)] mb-4">
                  Profil umiejętności
                </h3>
                <ScoreRadarChart scores={report.skillScores} size="md" />
              </div>

              <div className="bg-[var(--color-ivorylight)] rounded-2xl p-6 border border-[var(--color-ivorydark)]">
                <h3 className="text-lg font-bold text-[var(--color-slatedark)] mb-4">
                  Wyniki wg kategorii
                </h3>
                <CategoryBreakdown breakdown={report.categoryScores} />
              </div>
            </div>

            <div className="mb-8">
              <SkillsGapPanel
                strengths={report.strengthsSummary}
                weaknesses={report.weaknessesSummary}
              />
            </div>

            <div className="bg-[var(--color-ivorylight)] rounded-2xl p-6 border border-[var(--color-ivorydark)]">
              <h3 className="text-lg font-bold text-[var(--color-slatedark)] mb-4">
                Rekomendacje
              </h3>
              <RecommendationsPanel recommendations={report.recommendations} />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/interview/history")}
            className="flex items-center gap-2 px-6 py-3 border border-[var(--color-ivorydark)] text-[var(--color-slatedark)] rounded-xl font-medium hover:bg-[var(--color-ivorylight)] transition-colors"
          >
            Wróć do historii
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-[var(--color-ivorylight)] rounded-xl p-4 border border-[var(--color-ivorydark)]">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[var(--color-clouddark)]">{label}</div>
          <div className="text-lg font-bold text-[var(--color-slatedark)]">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
