import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for safe timeout handling with automatic cleanup
 * Prevents memory leaks from unmounted components
 */

export interface UseTimeoutResult {
  /** Set a new timeout */
  set: (callback: () => void, delay: number) => void;
  /** Clear the current timeout */
  clear: () => void;
  /** Whether a timeout is currently pending */
  isPending: boolean;
}

export function useTimeout(): UseTimeoutResult {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsPending(false);
    }
  }, []);

  const set = useCallback(
    (callback: () => void, delay: number) => {
      clear();
      setIsPending(true);
      timeoutRef.current = setTimeout(() => {
        try {
          callback();
        } catch (error) {
          console.error('Timeout callback error:', error);
        } finally {
          timeoutRef.current = null;
          setIsPending(false);
        }
      }, delay);
    },
    [clear],
  );

  // Cleanup on unmount
  useEffect(() => {
    return clear;
  }, [clear]);

  return { set, clear, isPending };
}

/**
 * Hook for debounced callbacks
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay],
  ) as T;

  return debouncedCallback;
}

/**
 * Hook for throttled callbacks
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): T {
  const callbackRef = useRef(callback);
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
          timeoutRef.current = null;
        }, delay - timeSinceLastRun);
      }
    },
    [delay],
  ) as T;

  return throttledCallback;
}

/**
 * Hook for delayed state updates
 */
export function useDelayedState<T>(
  initialValue: T,
  delay: number,
): [T, (value: T) => void, T] {
  const [value, setValue] = useState(initialValue);
  const [delayedValue, setDelayedValue] = useState(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDelayedValue(value);
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return [value, setValue, delayedValue];
}

/**
 * Hook for countdown timer
 */
export interface UseCountdownResult {
  seconds: number;
  isRunning: boolean;
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useCountdown(onComplete?: () => void): UseCountdownResult {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      clearTimer();
      if (seconds <= 0 && isRunning) {
        setIsRunning(false);
        onCompleteRef.current?.();
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return clearTimer;
  }, [isRunning, seconds, clearTimer]);

  const start = useCallback((initialSeconds: number) => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (seconds > 0) {
      setIsRunning(true);
    }
  }, [seconds]);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  return { seconds, isRunning, start, pause, resume, reset };
}
