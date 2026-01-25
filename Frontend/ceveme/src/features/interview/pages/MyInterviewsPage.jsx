import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Loader2,
  Sparkles,
  BarChart2,
  Trophy,
  TrendingUp,
  Target,
  AlertCircle,
} from "lucide-react";
import SessionCard from "../components/history/SessionCard";
import ProgressChart from "../components/history/ProgressChart";
import BadgeDisplay from "../components/history/BadgeDisplay";
import {
  useInterviewHistory,
  useInterviewStats,
} from "../hooks/useInterviewHistory";

export default function MyInterviewsPage() {
  const navigate = useNavigate();

  const { sessions, loading, error, deleteSession } = useInterviewHistory();
  const { stats } = useInterviewStats();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && session.status === "COMPLETED") ||
      (filterStatus === "in-progress" && session.status === "IN_PROGRESS");

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (sessionId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę sesję?")) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-bookcloth)] to-[var(--color-kraft)] flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-slatedark)] mb-3">
            Moje sesje rozmów
          </h1>

          <p className="text-lg text-[var(--color-clouddark)]">
            Śledź swoje postępy i przeglądaj historię treningów
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={Target}
              label="Ukończone sesje"
              value={stats.completedSessions || 0}
              color="blue"
            />
            <StatCard
              icon={TrendingUp}
              label="Średni wynik"
              value={`${Math.round(stats.averageScore || 0)}%`}
              color="green"
            />
            <StatCard
              icon={Trophy}
              label="Najlepszy wynik"
              value={`${stats.bestScore || 0}%`}
              color="yellow"
            />
          </div>
        )}

        {stats?.progressHistory && stats.progressHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--color-slatedark)] mb-4">
              Twój progres w czasie
            </h2>
            <ProgressChart data={stats.progressHistory} height="250px" />
          </div>
        )}

        {stats?.earnedBadges && stats.earnedBadges.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-[var(--color-slatedark)] mb-4">
              Twoje odznaki
            </h2>
            <BadgeDisplay earnedBadges={stats.earnedBadges} />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-ivorydark)]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-clouddark)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj po stanowisku lub firmie..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-ivorydark)] bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] placeholder-[var(--color-clouddark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--color-clouddark)]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--color-ivorydark)] bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-kraft)]/50"
                >
                  <option value="all">Wszystkie</option>
                  <option value="completed">Ukończone</option>
                  <option value="in-progress">W trakcie</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-bookcloth)]" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-[var(--color-clouddark)]">{error}</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <BarChart2 className="w-16 h-16 text-[var(--color-ivorydark)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-slatedark)] mb-2">
                  {searchQuery || filterStatus !== "all"
                    ? "Brak wyników"
                    : "Brak sesji"}
                </h3>
                <p className="text-[var(--color-clouddark)] mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Spróbuj zmienić kryteria wyszukiwania"
                    : "Rozpocznij swoją pierwszą sesję rozmowy kwalifikacyjnej"}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <button
                    onClick={() => navigate("/offers")}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Przeglądaj oferty pracy
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-[var(--color-ivorydark)] shadow-sm">
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
