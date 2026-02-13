import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '加载中...' }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
