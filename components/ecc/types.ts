/**
 * Shared types for ECC demo components
 */

export interface ECCComponentProps {
  isDarkMode: boolean;
}

export interface ECCTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ECCCardProps extends ECCComponentProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

// Animation states for point operations
export type AnimationState = 'idle' | 'shooting' | 'reflecting' | 'done';

// Result of point addition calculation
export interface PointAdditionResult {
  x: number;
  y: number;
  intersectY: number;
  slope: number;
}
