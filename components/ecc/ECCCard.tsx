import React from 'react';
import { ECCCardProps } from './types';
import { cn, themeText } from '../../utils/theme';

/**
 * Card component specifically styled for ECC demo
 */
const ECCCard: React.FC<ECCCardProps> = ({ title, icon, children, isDarkMode }) => (
  <div
    className={cn(
      'p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow',
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
    )}
  >
    <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
    <h3 className={cn('text-lg font-bold mb-2', themeText.primary(isDarkMode))}>
      {title}
    </h3>
    <p className={cn('leading-relaxed text-sm', themeText.muted(isDarkMode))}>
      {children}
    </p>
  </div>
);

export default ECCCard;
