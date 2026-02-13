import React, { ReactNode } from 'react';
import { useLab } from '../../store/LabContext';
import { themeBg, themeBorder, themeText, cn } from '../../utils/theme';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
  isDarkMode?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
  variant = 'default',
  onClick,
  role,
  ariaLabel,
  isDarkMode: propsDarkMode,
}) => {
  const { isDarkMode: contextDarkMode } = useLab();
  const isDarkMode = propsDarkMode ?? contextDarkMode;

  const baseClasses = cn(
    'rounded-xl transition-all duration-200',
    paddingClasses[padding],
  );

  const variantClasses = {
    default: cn(
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
      'border shadow-sm',
    ),
    elevated: cn(
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
      'border shadow-lg',
      isDarkMode ? 'shadow-slate-900/50' : 'shadow-slate-200/50',
    ),
    outlined: cn(
      'bg-transparent',
      isDarkMode ? 'border-slate-700' : 'border-slate-200',
      'border-2',
    ),
    ghost: cn(
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
    ),
  };

  const hoverClasses = hover
    ? cn(
        'hover:shadow-md',
        onClick && 'cursor-pointer active:scale-[0.99]',
      )
    : '';

  const interactiveProps = onClick
    ? {
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
        tabIndex: 0,
        role: role || 'button',
        'aria-label': ariaLabel,
      }
    : { role, 'aria-label': ariaLabel };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
      {...interactiveProps}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  isDarkMode?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  subtitle,
  action,
  isDarkMode: propsDarkMode,
}) => {
  const { isDarkMode: contextDarkMode } = useLab();
  const isDarkMode = propsDarkMode ?? contextDarkMode;

  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="shrink-0 w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
            {icon}
          </div>
        )}
        <div>
          <h3 className={cn('font-bold', themeText.primary(isDarkMode))}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn('text-sm', themeText.muted(isDarkMode))}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
  isDarkMode?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  isDarkMode: propsDarkMode,
}) => {
  const { isDarkMode: contextDarkMode } = useLab();
  const isDarkMode = propsDarkMode ?? contextDarkMode;

  return (
    <div
      className={cn(
        'mt-4 pt-4 border-t',
        themeBorder.primary(isDarkMode),
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  isDarkMode?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  children,
  icon,
  className = '',
  isDarkMode: propsDarkMode,
}) => {
  const { isDarkMode: contextDarkMode } = useLab();
  const isDarkMode = propsDarkMode ?? contextDarkMode;

  return (
    <Card isDarkMode={isDarkMode} className={className}>
      <CardHeader icon={icon} title={title} subtitle={description} isDarkMode={isDarkMode} />
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export interface InfoCardProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  mono?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  icon,
  mono = false,
  className = '',
  isDarkMode: propsDarkMode,
}) => {
  const { isDarkMode: contextDarkMode } = useLab();
  const isDarkMode = propsDarkMode ?? contextDarkMode;

  return (
    <Card isDarkMode={isDarkMode} padding="sm" variant="ghost" hover={false} className={className}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-orange-500">{icon}</span>}
        <span className={cn('text-xs', themeText.muted(isDarkMode))}>{label}</span>
      </div>
      <div
        className={cn(
          'mt-1 font-medium truncate',
          themeText.primary(isDarkMode),
          mono && 'font-mono text-sm',
        )}
      >
        {value}
      </div>
    </Card>
  );
};

export default Card;
