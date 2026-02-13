import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing simulation loops with automatic cleanup
 * Provides consistent pattern for all demo components
 */

export interface UseSimulationOptions {
  /** Callback function to execute on each tick */
  callback: () => void;
  /** Whether the simulation is running */
  running: boolean;
  /** Interval in milliseconds between ticks */
  interval: number;
  /** Optional cleanup function called when simulation stops */
  onCleanup?: () => void;
  /** Whether to execute callback immediately when starting */
  immediate?: boolean;
}

export function useSimulation({
  callback,
  running,
  interval,
  onCleanup,
  immediate = false,
}: UseSimulationOptions): void {
  const callbackRef = useRef(callback);
  const cleanupRef = useRef(onCleanup);

  // Update refs to always have the latest callbacks
  useEffect(() => {
    callbackRef.current = callback;
    cleanupRef.current = onCleanup;
  }, [callback, onCleanup]);

  useEffect(() => {
    if (!running) {
      cleanupRef.current?.();
      return;
    }

    // Execute immediately if requested
    if (immediate) {
      try {
        callbackRef.current();
      } catch (error) {
        console.error('Simulation callback error:', error);
      }
    }

    const intervalId = setInterval(() => {
      try {
        callbackRef.current();
      } catch (error) {
        console.error('Simulation callback error:', error);
      }
    }, interval);

    return () => {
      clearInterval(intervalId);
      cleanupRef.current?.();
    };
  }, [running, interval, immediate]);
}

/**
 * Hook for managing simulation with start/stop/reset controls
 */
export interface SimulationControls {
  start: () => void;
  stop: () => void;
  reset: () => void;
  toggle: () => void;
  isRunning: boolean;
}

export function useSimulationControls(
  initialRunning: boolean = false,
): [boolean, SimulationControls] {
  const [isRunning, setIsRunning] = React.useState(initialRunning);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);

  return [
    isRunning,
    { start, stop, reset, toggle, isRunning },
  ];
}

// Need to import React for useState
import React from 'react';

/**
 * Hook for animation frame-based simulations (smoother animations)
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  running: boolean,
): void {
  const callbackRef = useRef(callback);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!running) return;

    let animationId: number;
    lastTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      try {
        callbackRef.current(deltaTime);
      } catch (error) {
        console.error('Animation frame callback error:', error);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [running]);
}

/**
 * Hook for delayed simulation start
 */
export function useDelayedSimulation(
  callback: () => void,
  running: boolean,
  interval: number,
  delay: number,
): void {
  const [delayedRunning, setDelayedRunning] = React.useState(false);

  useEffect(() => {
    if (!running) {
      setDelayedRunning(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setDelayedRunning(true);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      setDelayedRunning(false);
    };
  }, [running, delay]);

  useSimulation({
    callback,
    running: delayedRunning,
    interval,
  });
}

/**
 * Hook for step-by-step simulation
 */
export interface StepSimulationResult<T> {
  currentStep: number;
  data: T;
  next: () => void;
  prev: () => void;
  reset: () => void;
  goTo: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function useStepSimulation<T>(
  steps: T[],
  autoPlay: boolean = false,
  interval: number = 1000,
): StepSimulationResult<T> {
  const [currentStep, setCurrentStep] = React.useState(0);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const goTo = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, steps.length - 1)));
    },
    [steps.length],
  );

  useSimulation({
    callback: next,
    running: autoPlay && currentStep < steps.length - 1,
    interval,
  });

  return {
    currentStep,
    data: steps[currentStep],
    next,
    prev,
    reset,
    goTo,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
  };
}
