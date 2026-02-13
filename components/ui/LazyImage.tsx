import React, { useState, useRef, useEffect } from 'react';
import { useLab } from '../../store/LabContext';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component with intersection observer
 * Shows a placeholder until the image enters the viewport
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  onLoad,
  onError,
}) => {
  const { isDarkMode: darkMode } = useLab();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  const errorBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const errorText = darkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`
            absolute inset-0 animate-pulse
            ${placeholderBg}
            ${placeholderClassName}
          `}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            ${errorBg} ${errorText}
          `}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          style={{ width, height }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default LazyImage;
