import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { View } from '../../config/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DesktopDropdownProps {
  title: string;
  items: NavItem[];
  currentView: View;
  setCurrentView: (view: View) => void;
  isDarkMode: boolean;
}

const DesktopDropdown: React.FC<DesktopDropdownProps> = ({
  title,
  items,
  currentView,
  setCurrentView,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActiveGroup = items.some(i => i.id === currentView);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          isActiveGroup || isOpen
            ? (isDarkMode ? 'text-white' : 'text-slate-900')
            : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
        }`}
      >
        {title}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded-xl shadow-xl border p-1 transition-all duration-200 origin-top z-50 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 visible'
            : 'opacity-0 scale-95 -translate-y-2 invisible'
        } ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id as View); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? (isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900 font-semibold')
                  : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'opacity-70'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopDropdown;
