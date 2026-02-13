import React from 'react';
import {
  LayoutGrid,
  Menu,
  Moon,
  Sun,
  Keyboard,
  BookOpen,
  GraduationCap,
  Trophy,
  ChevronLeft,
} from 'lucide-react';
import { View, navGroups } from '../../config/navigation';
import { DesktopDropdown, MobileNavButton } from '../navigation';
import { ModalType } from '../../hooks/useModals';

interface AppHeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  openModal: (modal: ModalType) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onViewChange,
  isDarkMode,
  toggleTheme,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  openModal,
}) => {
  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            {currentView !== 'home' && (
              <button
                onClick={() => onViewChange('home')}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
                title="返回首页 (Esc)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onViewChange('home')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-white text-lg">₿</span>
              </div>
              <span
                className={`font-bold text-lg tracking-tight hidden sm:block ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                BTC Tech Lab
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6 flex-1 justify-center">
            {navGroups.map((group, idx) => (
              <DesktopDropdown
                key={idx}
                title={group.title}
                items={group.items}
                currentView={currentView}
                setCurrentView={onViewChange}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openModal('achievements')}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                isDarkMode
                  ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-amber-600 hover:bg-slate-100'
              }`}
              title="学习成就"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button
              onClick={() => openModal('learningPath')}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="学习路径"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => openModal('glossary')}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="术语表"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button
              onClick={() => openModal('shortcuts')}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="键盘快捷键 (?)"
            >
              <Keyboard className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-orange-500 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-b max-h-[85vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="px-2 pt-2 pb-6 space-y-6">
            <button
              onClick={() => onViewChange('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-base active:scale-[0.98] transition-transform ${
                currentView === 'home'
                  ? isDarkMode
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-900'
                  : isDarkMode
                    ? 'text-slate-400'
                    : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-6 h-6" /> 首页
            </button>

            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`px-3 text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {group.title}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <MobileNavButton
                      key={item.id}
                      active={currentView === item.id}
                      onClick={() => onViewChange(item.id as View)}
                      icon={item.icon}
                      label={item.label}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppHeader;
