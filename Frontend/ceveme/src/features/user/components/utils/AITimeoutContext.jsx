import React, { createContext, useContext, useEffect, useState } from 'react';

const AITimeoutContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAITimeout = () => {
  const ctx = useContext(AITimeoutContext);
  if (!ctx)
    throw new Error('useAITimeout must be used within AITimeoutProvider');
  return ctx;
};

export const AITimeoutProvider = ({ children, bootstrapFetcher }) => {
  const [timeoutData, setTimeoutData] = useState(null);
  const [isAnyAILoading, setIsAnyAILoading] = useState(false);

  const parseFromLS = () => {
    const raw = localStorage.getItem('ai-timeout-data');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed?.endTime) return null;
      const left = Math.max(0, Math.ceil((parsed.endTime - Date.now()) / 1000));
      if (left <= 0) {
        localStorage.removeItem('ai-timeout-data');
        return null;
      }
      return { ...parsed, howMuchLeft: left };
    } catch {
      localStorage.removeItem('ai-timeout-data');
      return null;
    }
  };

  const writeToLS = (dataOrNull) => {
    if (!dataOrNull) {
      localStorage.removeItem('ai-timeout-data');
      return;
    }
    localStorage.setItem('ai-timeout-data', JSON.stringify(dataOrNull));
  };

  useEffect(() => {
    const initial = parseFromLS();
    if (initial) setTimeoutData(initial);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (typeof bootstrapFetcher !== 'function') return;

      const resp = await bootstrapFetcher();
      if (cancelled) return;

      const secs = Math.max(0, Number(resp?.howMuchLeft ?? 0));
      if (secs <= 0) {
        setTimeoutData(null);
        writeToLS(null);
        return;
      }
      const endTime = Date.now() + secs * 1000;
      const data = { ...resp, endTime, howMuchLeft: secs };

      setTimeoutData(data);
      writeToLS(data);
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [bootstrapFetcher]);

  useEffect(() => {
    if (!timeoutData?.endTime) return;

    const id = setInterval(() => {
      setTimeoutData((prev) => {
        if (!prev?.endTime) return prev;
        const left = Math.max(0, Math.ceil((prev.endTime - Date.now()) / 1000));
        if (left <= 0) {
          localStorage.removeItem('ai-timeout-data');
          return null;
        }
        return { ...prev, howMuchLeft: left };
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeoutData?.endTime]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'ai-timeout-data') return;
      const next = parseFromLS();
      setTimeoutData(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setAITimeout = (resp) => {
    const seconds = Math.max(0, Number(resp?.howMuchLeft ?? 0));
    if (seconds <= 0) {
      setTimeoutData(null);
      localStorage.removeItem('ai-timeout-data');
      return;
    }
    const endTime = Date.now() + seconds * 1000;
    const data = { ...resp, endTime, howMuchLeft: seconds };
    setTimeoutData(data);
    writeToLS(data);
  };

  const clearAITimeout = () => {
    setTimeoutData(null);
    localStorage.removeItem('ai-timeout-data');
  };

  const value = {
    timeoutData,
    isAnyAILoading,
    setIsAnyAILoading,
    setAITimeout,
    clearAITimeout,
    hasActiveTimeout: Boolean(
      timeoutData && (timeoutData.howMuchLeft ?? 0) > 0
    ),
  };

  return (
    <AITimeoutContext.Provider value={value}>
      {children}
    </AITimeoutContext.Provider>
  );
};
