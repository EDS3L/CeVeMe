import { useState, useCallback, useEffect } from "react";
import InterviewService from "../services/InterviewService";

export function useInterviewHistory(page = 0, size = 10) {
  const [sessions, setSessions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InterviewService.getMySessions(page, size);
      setSessions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || "Błąd ładowania historii");
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const deleteSession = useCallback(async (sessionId) => {
    try {
      await InterviewService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setError(err.message || "Błąd usuwania sesji");
    }
  }, []);

  return {
    sessions,
    totalPages,
    totalElements,
    loading,
    error,
    refetch: fetchSessions,
    deleteSession,
  };
}

export function useInterviewStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InterviewService.getUserStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Błąd ładowania statystyk");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useInterviewReport(sessionId) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await InterviewService.getSessionReport(sessionId);
      setReport(data);
    } catch (err) {
      setError(err.message || "Błąd ładowania raportu");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
  };
}
