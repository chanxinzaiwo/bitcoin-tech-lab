import React, { ReactNode } from 'react';
import { useLab } from '../../store/LabContext';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const { isDarkMode } = useLab();

  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const variantClasses = {
    default: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700',
    success: isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    warning: isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
    danger: isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
    info: isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700',
    orange: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
