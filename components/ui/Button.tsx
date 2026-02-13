import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useLab } from '../../store/LabContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const { isDarkMode } = useLab();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    secondary: isDarkMode
      ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-400',
    ghost: isDarkMode
      ? 'hover:bg-slate-800 text-slate-300 focus:ring-slate-500'
      : 'hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
      {iconRight}
    </button>
  );
};

export default Button;
