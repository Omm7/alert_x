'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [manualLoadingCount, setManualLoadingCount] = useState(0);
  const [requestLoadingCount, setRequestLoadingCount] = useState(0);

  const isLoading = manualLoadingCount > 0 || requestLoadingCount > 0;

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      setRequestLoadingCount((count) => count + 1);
      try {
        return await originalFetch(...args);
      } finally {
        setRequestLoadingCount((count) => Math.max(0, count - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setManualLoadingCount(loading ? 1 : 0);
  }, []);

  const startLoading = useCallback(() => {
    setManualLoadingCount((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setManualLoadingCount((count) => Math.max(0, count - 1));
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
