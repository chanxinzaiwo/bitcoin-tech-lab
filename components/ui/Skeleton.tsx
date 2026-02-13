import React from 'react';
import { useLab } from '../../store/LabContext';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading placeholder component
 * Used to show loading state while content is being fetched
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const { isDarkMode } = useLab();

  const baseColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const waveColor = isDarkMode ? 'from-gray-700 via-gray-600 to-gray-700' : 'from-gray-200 via-gray-100 to-gray-200';

  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getAnimationStyles = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return `bg-gradient-to-r ${waveColor} animate-shimmer bg-[length:200%_100%]`;
      case 'none':
      default:
        return '';
    }
  };

  const defaultHeight = variant === 'text' ? '1em' : undefined;
  const defaultWidth = variant === 'text' ? '100%' : undefined;

  return (
    <div
      className={`
        ${animation !== 'wave' ? baseColor : ''}
        ${getVariantStyles()}
        ${getAnimationStyles()}
        ${className}
      `}
      style={{
        width: width ?? defaultWidth,
        height: height ?? defaultHeight,
      }}
    />
  );
};

/**
 * Skeleton group for common patterns
 */
interface SkeletonGroupProps {
  variant: 'card' | 'list-item' | 'paragraph' | 'avatar-text';
  count?: number;
  className?: string;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  variant,
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderVariant = (key: number) => {
    switch (variant) {
      case 'card':
        return (
          <div key={key} className={`space-y-3 ${className}`}>
            <Skeleton variant="rounded" height={160} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </div>
        );

      case 'list-item':
        return (
          <div key={key} className={`flex items-center space-x-3 ${className}`}>
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div key={key} className={`space-y-2 ${className}`}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="88%" />
            <Skeleton variant="text" width="60%" />
          </div>
        );

      case 'avatar-text':
        return (
          <div key={key} className={`flex items-center space-x-3 ${className}`}>
            <Skeleton variant="circular" width={48} height={48} />
            <div className="space-y-2">
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{items.map(renderVariant)}</>;
};

export default Skeleton;
