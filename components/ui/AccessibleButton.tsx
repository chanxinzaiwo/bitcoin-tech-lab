import React, { forwardRef } from 'react';
import { cn, themeBg, themeText, themeBorder } from '../../utils/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDarkMode: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1 min-h-[28px]',
  sm: 'text-sm px-3 py-1.5 min-h-[32px]',
  md: 'text-sm px-4 py-2 min-h-[40px]',
  lg: 'text-base px-6 py-3 min-h-[48px]',
};

const getVariantClasses = (variant: ButtonVariant, isDarkMode: boolean): string => {
  switch (variant) {
    case 'primary':
      return 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm hover:shadow-md';
    case 'secondary':
      return cn(
        themeBg.tertiary(isDarkMode),
        themeText.secondary(isDarkMode),
        isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200',
        'shadow-sm',
      );
    case 'ghost':
      return cn(
        'bg-transparent',
        themeText.muted(isDarkMode),
        isDarkMode
          ? 'hover:bg-slate-800 hover:text-slate-200'
          : 'hover:bg-slate-100 hover:text-slate-800',
      );
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm';
    case 'success':
      return 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm';
    case 'outline':
      return cn(
        'bg-transparent border',
        themeBorder.primary(isDarkMode),
        themeText.secondary(isDarkMode),
        isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
      );
    default:
      return '';
  }
};

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isDarkMode,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2',
          isDarkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white',
          sizeClasses[size],
          getVariantClasses(variant, isDarkMode),
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;

// Loading spinner for button
interface LoadingSpinnerProps {
  size: ButtonSize;
}

const spinnerSizes: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => (
  <svg
    className={cn('animate-spin', spinnerSizes[size])}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Icon Button variant
export interface IconButtonProps extends Omit<AccessibleButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className = '', ...props }, ref) => {
    const iconSizeClasses: Record<ButtonSize, string> = {
      xs: 'p-1 min-h-[24px] min-w-[24px]',
      sm: 'p-1.5 min-h-[32px] min-w-[32px]',
      md: 'p-2 min-h-[40px] min-w-[40px]',
      lg: 'p-3 min-h-[48px] min-w-[48px]',
    };

    return (
      <AccessibleButton
        ref={ref}
        size={size}
        className={cn(iconSizeClasses[size], 'rounded-full', className)}
        {...props}
      >
        {icon}
      </AccessibleButton>
    );
  },
);

IconButton.displayName = 'IconButton';

// Button Group
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  orientation = 'horizontal',
}) => (
  <div
    className={cn(
      'inline-flex',
      orientation === 'vertical' ? 'flex-col' : 'flex-row',
      '[&>button]:rounded-none',
      orientation === 'horizontal'
        ? '[&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg'
        : '[&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg',
      className,
    )}
    role="group"
  >
    {children}
  </div>
);
