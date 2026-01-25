import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, X, AlertCircle } from "lucide-react";
import QuestionCard from "../components/session/QuestionCard";
import AnswerInput from "../components/session/AnswerInput";
import VoiceRecorder from "../components/session/VoiceRecorder";
import TimerDisplay from "../components/session/TimerDisplay";
import ProgressBar from "../components/session/ProgressBar";
import FeedbackCard from "../components/session/FeedbackCard";
import { useInterviewSession } from "../hooks/useInterviewSession";
import { useInterviewTimer, useStopwatch } from "../hooks/useInterviewTimer";
import { SESSION_MODES } from "../utils/constants";

export default function InterviewSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = SESSION_MODES[location.state?.mode] || SESSION_MODES.TEXT_BASIC;
  const isVoiceMode = mode.id.startsWith("VOICE");
  const hasTimeLimit = mode.timeLimit !== null;

  const {
    session,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    feedback,
    loading,
    submitting,
    error,
    isComplete,
    submitAnswer,
    nextQuestion,
  } = useInterviewSession(sessionId);

  const timer = useInterviewTimer(mode.timeLimit || 0, false);
  const stopwatch = useStopwatch(true);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [useTextFallback, setUseTextFallback] = useState(false);

  useEffect(() => {
    if (currentQuestion && hasTimeLimit && !feedback) {
      timer.reset(mode.timeLimit);
      timer.start();
    }
  }, [currentQuestion?.id, hasTimeLimit, feedback]);

  useEffect(() => {
    if (timer.isExpired && !feedback) {
      handleSubmit(voiceTranscript || "Brak odpowiedzi - czas minął");
    }
  }, [timer.isExpired, feedback]);

  useEffect(() => {
    if (isComplete) {
      navigate(`/interview/report/${sessionId}`);
    }
  }, [isComplete, sessionId, navigate]);

  const handleSubmit = useCallback(
    async (answer) => {
      timer.pause();
      const timeSpent = stopwatch.lap();
      stopwatch.reset();
      stopwatch.start();
      await submitAnswer(answer, timeSpent);
      setVoiceTranscript("");
    },
    [submitAnswer, timer, stopwatch],
  );

  const handleNext = useCallback(() => {
    nextQuestion();
    if (hasTimeLimit) {
      timer.reset(mode.timeLimit);
      timer.start();
    }
  }, [nextQuestion, hasTimeLimit, timer, mode.timeLimit]);

  const handleExit = () => {
    navigate("/interview/history");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-bookcloth)] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-slatedark)]">
            Ładowanie sesji...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-slatedark)] mb-2">
            Błąd
          </h2>
          <p className="text-[var(--color-clouddark)] mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-xl font-medium"
          >
            Wróć
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ivorylight)] to-white">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[var(--color-ivorydark)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-2 text-[var(--color-clouddark)] hover:text-[var(--color-slatedark)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Wyjdź</span>
            </button>

            <div className="flex-1 max-w-md">
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={totalQuestions}
                size="sm"
                showLabels={false}
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--color-slatedark)]">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>

              {hasTimeLimit && !feedback && (
                <TimerDisplay
                  seconds={timer.seconds}
                  formattedTime={timer.formattedTime}
                  percentRemaining={timer.percentRemaining}
                  isExpired={timer.isExpired}
                  isRunning={timer.isRunning}
                  compact
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!feedback && currentQuestion && (
          <div className="space-y-6">
            <QuestionCard
              question={currentQuestion.questionText}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              category={currentQuestion.category}
              starHint={currentQuestion.starHint}
            />

            {hasTimeLimit && (
              <TimerDisplay
                seconds={timer.seconds}
                formattedTime={timer.formattedTime}
                percentRemaining={timer.percentRemaining}
                isExpired={timer.isExpired}
                isRunning={timer.isRunning}
              />
            )}

            {isVoiceMode && !useTextFallback ? (
              <div className="space-y-4">
                <VoiceRecorder
                  onTranscript={(text) => {
                    setVoiceTranscript(text);
                    handleSubmit(text);
                  }}
                  disabled={submitting}
                />
                <div className="text-center">
                  <button
                    onClick={() => setUseTextFallback(true)}
                    className="text-sm text-[var(--color-clouddark)] hover:text-[var(--color-bookcloth)] underline transition-colors"
                  >
                    Masz problem z mikrofonem? Kliknij, aby wpisać odpowiedź
                    tekstowo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isVoiceMode && useTextFallback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-700">
                      Tryb tekstowy aktywny.
                      <button
                        onClick={() => setUseTextFallback(false)}
                        className="ml-2 underline hover:text-blue-900"
                      >
                        Wróć do nagrywania głosowego
                      </button>
                    </p>
                  </div>
                )}
                <AnswerInput
                  onSubmit={handleSubmit}
                  disabled={submitting}
                  submitting={submitting}
                />
              </div>
            )}

            {mode.id === "REALTIME_FEEDBACK" && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">
                  💡 Podpowiedzi (Live Coach)
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• Zacznij od opisania sytuacji (S w STAR)</li>
                  <li>• Użyj konkretnych przykładów z doświadczenia</li>
                  <li>• Wspomnij o technologiach z wymagań oferty</li>
                  <li>• Zakończ mierzalnym rezultatem</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {feedback && (
          <FeedbackCard
            feedback={feedback}
            onNext={handleNext}
            isLastQuestion={currentQuestionIndex >= totalQuestions - 1}
          />
        )}
      </main>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-slatedark)]">
                Wyjść z sesji?
              </h3>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[var(--color-clouddark)] mb-6">
              Twój postęp zostanie zapisany. Możesz kontynuować później z
              miejsca, w którym skończyłeś.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-[var(--color-ivorydark)] text-[var(--color-slatedark)] rounded-xl font-medium hover:bg-[var(--color-ivorylight)] transition-colors"
              >
                Kontynuuj
              </button>
              <button
                onClick={handleExit}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Wyjdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
