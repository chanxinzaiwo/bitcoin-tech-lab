import React, { ReactNode } from 'react';
import { useLab } from '../../store/LabContext';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'cards';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
}) => {
  const { isDarkMode } = useLab();

  if (variant === 'underline') {
    return (
      <div className={`flex border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : isDarkMode
                  ? 'border-transparent text-slate-400 hover:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // Default: pills
  return (
    <div className={`inline-flex p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${activeTab === tab.id
              ? isDarkMode
                ? 'bg-slate-700 text-white shadow'
                : 'bg-white text-slate-900 shadow'
              : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-700'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
