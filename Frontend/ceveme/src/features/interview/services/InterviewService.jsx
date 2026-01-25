import { api } from "../../../../api";

/**
 * Serwis do zarządzania sesjami rozmów kwalifikacyjnych.
 *
 * AI jest wykorzystywane wyłącznie do:
 * - Generowania pytań rekrutacyjnych (createSession)
 * - Oceny odpowiedzi (submitAnswer)
 * - Generowania podsumowań (getSessionReport)
 *
 * Dane oferty pracy pobierane są bezpośrednio z bazy przez /api/job-offers/{id}
 */
const InterviewService = {
  // Usunięto analyzeJobOffer - dane oferty pobierane są z /api/job-offers/{id}

  async createSession(jobOfferId, mode, questionCount = 20) {
    const response = await api.post("/api/interview/sessions", {
      jobOfferId,
      mode,
      questionCount,
    });
    return response.data;
  },

  async getSession(sessionId) {
    const response = await api.get(`/api/interview/sessions/${sessionId}`);
    return response.data;
  },

  async submitAnswer(
    sessionId,
    questionId,
    answerText,
    transcription,
    responseTimeSeconds,
  ) {
    const response = await api.post(
      `/api/interview/sessions/${sessionId}/answers`,
      {
        questionId,
        answerText,
        transcription,
        responseTimeSeconds,
      },
    );
    return response.data;
  },

  async getSessionReport(sessionId) {
    const response = await api.get(
      `/api/interview/sessions/${sessionId}/report`,
    );
    return response.data;
  },

  async getMySessions(page = 0, size = 10) {
    const response = await api.get("/api/interview/sessions", {
      params: { page, size },
    });
    return response.data;
  },

  async getUserStats() {
    const response = await api.get("/api/interview/stats");
    return response.data;
  },

  async deleteSession(sessionId) {
    await api.delete(`/api/interview/sessions/${sessionId}`);
  },

  async abandonSession(sessionId) {
    await api.post(`/api/interview/sessions/${sessionId}/abandon`);
  },
};

export default InterviewService;
