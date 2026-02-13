import React from 'react';

interface MobileNavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isDarkMode: boolean;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
  isDarkMode
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-medium transition-all border active:scale-95 ${
      active
        ? (isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200 shadow-sm')
        : (isDarkMode ? 'bg-slate-900/50 text-slate-400 border-transparent active:bg-slate-800' : 'bg-slate-50 text-slate-600 border-transparent active:bg-white')
    }`}
  >
    <Icon className={`w-6 h-6 ${active ? 'text-orange-500' : 'opacity-70'}`} />
    <span className="text-xs sm:text-sm">{label}</span>
  </button>
);

export default MobileNavButton;
