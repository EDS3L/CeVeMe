import { useState, useCallback, useEffect } from "react";
import InterviewService from "../services/InterviewService";

export function useInterviewSession(sessionId) {
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const data = await InterviewService.getSession(sessionId);
      setSession(data);

      const answeredCount = data.answeredQuestions || 0;
      setCurrentQuestionIndex(answeredCount);

      if (data.status === "COMPLETED") {
        setIsComplete(true);
      }
    } catch (err) {
      setError(err.message || "Błąd ładowania sesji");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const submitAnswer = useCallback(
    async (answerText, transcription = null, responseTimeSeconds = 0) => {
      if (!session || submitting) return;

      const currentQuestion =
        session.currentQuestion || session.questions?.[currentQuestionIndex];
      if (!currentQuestion) return;

      try {
        setSubmitting(true);
        setError(null);

        const response = await InterviewService.submitAnswer(
          sessionId,
          currentQuestion.id,
          answerText,
          transcription,
          responseTimeSeconds,
        );

        setFeedback(response.feedback);

        if (response.sessionCompleted) {
          setIsComplete(true);
        } else if (response.nextQuestion) {
          setSession((prev) => ({
            ...prev,
            currentQuestion: response.nextQuestion,
            answeredQuestions: response.currentProgress,
          }));
        }
      } catch (err) {
        setError(err.message || "Błąd wysyłania odpowiedzi");
      } finally {
        setSubmitting(false);
      }
    },
    [session, sessionId, currentQuestionIndex, submitting],
  );

  const nextQuestion = useCallback(() => {
    setFeedback(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const abandonSession = useCallback(async () => {
    try {
      await InterviewService.abandonSession(sessionId);
    } catch (err) {
      setError(err.message || "Błąd porzucania sesji");
    }
  }, [sessionId]);

  const currentQuestion =
    session?.currentQuestion ||
    session?.questions?.[currentQuestionIndex] ||
    null;
  const progress = session?.totalQuestions
    ? ((session.answeredQuestions || 0) / session.totalQuestions) * 100
    : 0;
  const totalQuestions = session?.totalQuestions || 0;

  return {
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
    abandonSession,
    refetch: fetchSession,
  };
}

export function useCreateSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  const createSession = useCallback(
    async (jobOfferId, mode, questionCount = 20) => {
      try {
        setLoading(true);
        setError(null);
        const data = await InterviewService.createSession(
          jobOfferId,
          mode,
          questionCount,
        );
        setSession(data);
        return data;
      } catch (err) {
        setError(err.message || "Błąd tworzenia sesji");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    createSession,
    session,
    loading,
    error,
  };
}

// Hook useJobOfferAnalysis został usunięty - dane oferty są pobierane bezpośrednio z bazy danych
// przez endpoint /api/job-offers/{id}, a AI nie jest już używane do analizy wymagań/trudności
