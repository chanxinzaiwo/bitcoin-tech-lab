import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface DemoLayoutProps {
  title: string;
  mobileTitle?: string;
  icon: LucideIcon;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode: boolean;
  children: React.ReactNode;
  footerNote?: string;
}

const DemoLayout: React.FC<DemoLayoutProps> = ({
  title,
  mobileTitle,
  icon: Icon,
  tabs,
  activeTab,
  onTabChange,
  isDarkMode,
  children,
  footerNote,
}) => {
  return (
    <div className={`${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans selection:bg-orange-100 min-h-screen`}>
      <nav className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm border-b sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1.5 rounded-full">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className={`font-bold text-lg sm:text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} hidden sm:block`}>
                {title}
              </span>
              <span className={`font-bold text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} sm:hidden`}>
                {mobileTitle || title}
              </span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700'
                      : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Menu - Improved Grid Layout */}
        <div className={`md:hidden border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="px-2 py-2">
            <div className={`grid gap-1.5 ${
              tabs.length <= 4 ? 'grid-cols-4' :
              tabs.length <= 6 ? 'grid-cols-3' :
              tabs.length <= 8 ? 'grid-cols-4' :
              'grid-cols-4'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all min-h-[52px] ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : isDarkMode
                        ? 'bg-slate-700/50 text-slate-300 active:bg-slate-600'
                        : 'bg-white text-slate-600 border border-slate-200 active:bg-slate-100'
                  }`}
                >
                  {tab.icon && <tab.icon className={`w-4 h-4 mb-0.5 ${activeTab === tab.id ? '' : 'opacity-70'}`} />}
                  <span className="leading-tight text-center line-clamp-1">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>

      {footerNote && (
        <footer className={`max-w-6xl mx-auto px-4 py-6 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-xs sm:text-sm`}>
          <p>{footerNote}</p>
        </footer>
      )}
    </div>
  );
};

export default DemoLayout;
