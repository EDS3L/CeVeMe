import { useNavigate } from "react-router-dom";
import { Calendar, BarChart2, ChevronRight, Trash2, Play } from "lucide-react";
import { SESSION_MODES, SCORE_THRESHOLDS } from "../../utils/constants";

export default function SessionCard({ session, onDelete }) {
  const navigate = useNavigate();

  const mode = SESSION_MODES[session.mode] || { name: session.mode };

  const getScoreColor = (score) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT)
      return "text-green-600 bg-green-100";
    if (score >= SCORE_THRESHOLDS.GOOD) return "text-blue-600 bg-blue-100";
    if (score >= SCORE_THRESHOLDS.AVERAGE)
      return "text-orange-500 bg-orange-100";
    return "text-red-500 bg-red-100";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewReport = () => {
    navigate(`/interview/report/${session.id}`);
  };

  const handleContinue = () => {
    navigate(`/interview/session/${session.id}`);
  };

  const isCompleted = session.status === "COMPLETED";

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {isCompleted ? "Ukończona" : "W trakcie"}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] border border-[var(--color-ivorydark)]">
                {mode.name}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-[var(--color-slatedark)] mb-1">
              {session.jobTitle || "Sesja rozmowy"}
            </h3>

            <p className="text-sm text-[var(--color-clouddark)] mb-3">
              {session.company}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-clouddark)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(session.startedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4" />
                {session.answeredQuestions}/{session.totalQuestions} pytań
              </span>
            </div>
          </div>

          {isCompleted && session.overallScore !== undefined && (
            <div
              className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${getScoreColor(session.overallScore)}`}
            >
              <span className="text-xl font-bold">{session.overallScore}</span>
              <span className="text-xs">pkt</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-[var(--color-ivorydark)] bg-[var(--color-ivorylight)] flex items-center justify-between">
        <button
          onClick={() => onDelete?.(session.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Usuń
        </button>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button
              onClick={handleContinue}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[var(--color-bookcloth)] border border-[var(--color-bookcloth)] rounded-lg hover:bg-[var(--color-bookcloth)]/5 transition-colors"
            >
              <Play className="w-4 h-4" />
              Kontynuuj
            </button>
          )}
          {isCompleted && (
            <button
              onClick={handleViewReport}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-lg hover:shadow-md transition-all"
            >
              Zobacz raport
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
