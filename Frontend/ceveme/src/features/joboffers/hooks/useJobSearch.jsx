import { useState, useEffect, useRef, useCallback } from "react";
import JobSearchService from "../services/JobSearchService";

export const useJobSearch = (criteria) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const search = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const currentRequestId = ++requestIdRef.current;
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await JobSearchService.search(criteria);

      if (currentRequestId === requestIdRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          return;
        }

        if (err.response?.status === 401) {
          setError({
            type: "auth",
            message: "Sesja wygasła. Zaloguj się ponownie.",
          });
        } else if (err.response?.status >= 500) {
          setError({
            type: "server",
            message: "Problem z serwerem. Spróbuj ponownie.",
          });
        } else {
          setError({ type: "unknown", message: "Nie udało się pobrać ofert." });
        }

        setData(null);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [criteria]);

  useEffect(() => {
    search();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [search]);

  const retry = useCallback(() => {
    search();
  }, [search]);

  return {
    data,
    loading,
    error,
    retry,
  };
};
