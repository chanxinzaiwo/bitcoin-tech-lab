// Hook exports for easy importing
export { useModals } from './useModals';
export type { ModalType, UseModalsReturn } from './useModals';

export {
  useSimulation,
  useSimulationControls,
  useAnimationFrame,
  useDelayedSimulation,
  useStepSimulation,
} from './useSimulation';
export type {
  UseSimulationOptions,
  SimulationControls,
  StepSimulationResult,
} from './useSimulation';

export {
  useTimeout,
  useDebounce,
  useThrottle,
  useDelayedState,
  useCountdown,
} from './useTimeout';
export type { UseTimeoutResult, UseCountdownResult } from './useTimeout';

export {
  useKeyboardNavigation,
  useRovingTabIndex,
} from './useKeyboardNavigation';
export type {
  UseKeyboardNavigationOptions,
  UseKeyboardNavigationResult,
  UseRovingTabIndexOptions,
  UseRovingTabIndexResult,
} from './useKeyboardNavigation';

export { useLanguage } from './useLanguage';
export type { UseLanguageReturn } from './useLanguage';
