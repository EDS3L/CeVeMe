import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Loader2,
  Sparkles,
  CheckCircle,
  ListTodo,
  Star,
} from "lucide-react";
import ModeCard from "../components/modes/ModeCard";
import { SESSION_MODES } from "../utils/constants";
import { useCreateSession } from "../hooks/useInterviewSession";
import { api } from "../../../../api";

export default function InterviewModesPage() {
  const { jobOfferId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobOffer, setJobOffer] = useState(location.state?.jobOffer || null);
  const [loadingOffer, setLoadingOffer] = useState(!location.state?.jobOffer);

  const { createSession, loading: creatingSession } = useCreateSession();

  // Pobieramy dane oferty TYLKO z bazy danych - bez analizy AI
  useEffect(() => {
    if (jobOfferId) {
      setLoadingOffer(true);
      api
        .get(`/api/job-offers/${jobOfferId}`)
        .then((response) => {
          setJobOffer(response.data);
          setLoadingOffer(false);
        })
        .catch((err) => {
          console.error("Błąd pobierania oferty:", err);
          setLoadingOffer(false);
        });
    }
  }, [jobOfferId]);

  const handleSelectMode = async (modeId, questionCount = 20) => {
    try {
      const session = await createSession(jobOfferId, modeId, questionCount);
      navigate(`/interview/session/${session.id}`, {
        state: { jobOffer, mode: modeId },
      });
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const modes = Object.values(SESSION_MODES);

  // Helper do parsowania tekstu z separatorami na tablicę
  const parseListFromText = (text, maxItems = 10) => {
    if (!text) return [];
    return text
      .split(/[\n•\-*;]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 3)
      .slice(0, maxItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Powrót
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-bookcloth)] to-[var(--color-kraft)] flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-slatedark)] mb-3">
            AI Interview Coach
          </h1>

          <p className="text-lg text-[var(--color-clouddark)] max-w-2xl mx-auto">
            Przygotuj się do rozmowy kwalifikacyjnej z pomocą sztucznej
            inteligencji
          </p>
        </div>

        {loadingOffer ? (
          <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] p-8 mb-8 shadow-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-bookcloth)]" />
            <span className="ml-3 text-[var(--color-clouddark)]">
              Ładowanie oferty...
            </span>
          </div>
        ) : jobOffer ? (
          <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] p-6 mb-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-kraft)]/20 to-[var(--color-bookcloth)]/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[var(--color-bookcloth)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--color-slatedark)]">
                  {jobOffer.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-[var(--color-clouddark)]">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {jobOffer.company}
                  </span>
                  {jobOffer.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {jobOffer.city}
                    </span>
                  )}
                  {jobOffer.experienceLevel && (
                    <span className="px-2 py-0.5 text-sm bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] rounded-full border border-[var(--color-ivorydark)]">
                      {jobOffer.experienceLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Wymagania - dane z bazy danych */}
            {jobOffer?.requirements && (
              <div className="mt-6 pt-4 border-t border-[var(--color-ivorydark)]">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-slatedark)] mb-3">
                  <CheckCircle className="w-4 h-4 text-[var(--color-bookcloth)]" />
                  Wymagania
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parseListFromText(jobOffer.requirements, 12).map(
                    (req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-[var(--color-ivorylight)] text-[var(--color-slatedark)] rounded-lg border border-[var(--color-ivorydark)]"
                      >
                        {req}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Obowiązki - dane z bazy danych */}
            {jobOffer?.responsibilities && (
              <div className="mt-4 pt-4 border-t border-[var(--color-ivorydark)]">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-slatedark)] mb-3">
                  <ListTodo className="w-4 h-4 text-blue-600" />
                  Obowiązki
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parseListFromText(jobOffer.responsibilities, 10).map(
                    (resp, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                      >
                        {resp}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Mile widziane - dane z bazy danych */}
            {jobOffer?.niceToHave && (
              <div className="mt-4 pt-4 border-t border-[var(--color-ivorydark)]">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-slatedark)] mb-3">
                  <Star className="w-4 h-4 text-green-600" />
                  Mile widziane
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parseListFromText(jobOffer.niceToHave, 8).map(
                    (nice, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200"
                      >
                        {nice}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--color-slatedark)] mb-2">
            Wybierz tryb symulacji
          </h2>
          <p className="text-[var(--color-clouddark)]">
            Każdy tryb rozwija inne aspekty przygotowania do rozmowy
          </p>
        </div>

        {creatingSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[var(--color-bookcloth)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-slatedark)]">
                Tworzę sesję...
              </h3>
              <p className="text-[var(--color-clouddark)] mt-2">
                Generuję spersonalizowane pytania
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              onSelect={() => handleSelectMode(mode.id)}
              disabled={creatingSession}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--color-clouddark)]">
            💡 Rekomendujemy zacząć od trybu tekstowego, aby poznać format pytań
          </p>
        </div>
      </div>
    </div>
  );
}
