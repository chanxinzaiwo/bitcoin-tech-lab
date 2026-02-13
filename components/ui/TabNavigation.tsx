import React, { useCallback } from 'react';
import { themeBg, themeText, cn } from '../../utils/theme';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode: boolean;
  className?: string;
  variant?: 'pills' | 'underline' | 'boxed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5',
};

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isDarkMode,
  className = '',
  variant = 'pills',
  size = 'md',
  fullWidth = false,
  ariaLabel = 'Tab navigation',
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentEnabledIndex = enabledTabs.findIndex(
        (t) => t.id === tabs[currentIndex].id,
      );

      let newIndex = currentEnabledIndex;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex =
            currentEnabledIndex > 0
              ? currentEnabledIndex - 1
              : enabledTabs.length - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex =
            currentEnabledIndex < enabledTabs.length - 1
              ? currentEnabledIndex + 1
              : 0;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = enabledTabs.length - 1;
          break;
        default:
          return;
      }

      onTabChange(enabledTabs[newIndex].id);
    },
    [tabs, onTabChange],
  );

  const renderPillsVariant = () => (
    <div
      className={cn(
        'inline-flex rounded-lg p-1',
        themeBg.secondary(isDarkMode),
        fullWidth && 'w-full',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md font-medium transition-all',
              sizeClasses[size],
              fullWidth && 'flex-1',
              isActive
                ? cn(
                    themeBg.card(isDarkMode),
                    themeText.primary(isDarkMode),
                    'shadow-sm',
                  )
                : cn(
                    themeText.muted(isDarkMode),
                    !tab.disabled && 'hover:' + themeText.secondary(isDarkMode).split(' ')[0],
                  ),
              tab.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderUnderlineVariant = () => (
    <div
      className={cn(
        'flex border-b',
        isDarkMode ? 'border-slate-700' : 'border-slate-200',
        fullWidth && 'w-full',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'flex items-center justify-center gap-2 font-medium transition-all border-b-2 -mb-px',
              sizeClasses[size],
              fullWidth && 'flex-1',
              isActive
                ? cn(themeText.primary(isDarkMode), 'border-orange-500')
                : cn(
                    themeText.muted(isDarkMode),
                    'border-transparent',
                    !tab.disabled && 'hover:border-slate-400',
                  ),
              tab.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderBoxedVariant = () => (
    <div
      className={cn(
        'inline-flex rounded-lg border',
        isDarkMode ? 'border-slate-700' : 'border-slate-200',
        fullWidth && 'w-full',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'flex items-center justify-center gap-2 font-medium transition-all border-r last:border-r-0',
              isDarkMode ? 'border-slate-700' : 'border-slate-200',
              sizeClasses[size],
              fullWidth && 'flex-1',
              isFirst && 'rounded-l-lg',
              isLast && 'rounded-r-lg',
              isActive
                ? cn(
                    'bg-orange-500 text-white',
                  )
                : cn(
                    themeBg.card(isDarkMode),
                    themeText.muted(isDarkMode),
                    !tab.disabled && isDarkMode
                      ? 'hover:bg-slate-800'
                      : 'hover:bg-slate-50',
                  ),
              tab.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  switch (variant) {
    case 'underline':
      return renderUnderlineVariant();
    case 'boxed':
      return renderBoxedVariant();
    default:
      return renderPillsVariant();
  }
};

export default TabNavigation;

// Tab Panel component for accessibility
export interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className = '',
}) => {
  if (activeTab !== id) return null;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
};
