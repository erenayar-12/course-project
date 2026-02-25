/**
 * useIdeasLoading Hook
 * 
 * Custom hook for managing loading states during filtering, sorting, and pagination.
 * Implements STORY-2.4 AC10: Loading states with skeleton loaders
 * 
 * @hook
 * @example
 * const { isLoading, setIsLoading, showLoadingMessage } = useIdeasLoading(1000);
 */

import { useState, useEffect } from 'react';

interface UseIdeasLoadingOptions {
  /** Timeout in milliseconds before showing "loading" message */
  timeout?: number;
  /** Callback fired when timeout is exceeded */
  onTimeout?: () => void;
}

interface UseIdeasLoadingReturn {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoadingMessage: boolean;
  loadingMessage: string;
}

/**
 * Hook for managing loading states during filter/sort operations
 * Shows skeleton loaders immediately, then loading message after 1 second
 */
export const useIdeasLoading = (
  options: UseIdeasLoadingOptions = {}
): UseIdeasLoadingReturn => {
  const { timeout = 1000, onTimeout } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowLoadingMessage(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoadingMessage(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout, onTimeout]);

  return {
    isLoading,
    setIsLoading,
    showLoadingMessage,
    loadingMessage: 'Filtering ideas...',
  };
};

export default useIdeasLoading;
