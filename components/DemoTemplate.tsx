import React, { useState, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useLab } from '../store/LabContext';

export interface DemoTab {
    id: string;
    label: string;
    icon?: LucideIcon;
}

export interface DemoTemplateProps {
    /** Unique module identifier */
    moduleId: string;
    /** Title displayed in header (desktop) */
    title: string;
    /** Short title for mobile */
    mobileTitle?: string;
    /** Icon component displayed in header */
    icon: LucideIcon;
    /** Accent color for the module (CSS class name like 'orange', 'blue', etc.) */
    accentColor: 'orange' | 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'cyan' | 'indigo' | 'teal' | 'pink';
    /** Array of tab configurations */
    tabs: DemoTab[];
    /** Default active tab id */
    defaultTab?: string;
    /** Footer text (optional) */
    footerText?: string;
    /** Render prop for tab content - receives activeTab id and setActiveTab function */
    children: (activeTab: string, setActiveTab: (tab: string) => void, isDarkMode: boolean) => ReactNode;
}

// Color mapping for different accent colors
const colorConfig = {
    orange: {
        iconBg: 'bg-orange-500',
        desktopActive: 'bg-orange-500/20 text-orange-400',
        desktopActiveDark: 'bg-orange-500/20 text-orange-400',
        desktopActiveLight: 'bg-orange-50 text-orange-700',
        mobileActive: 'bg-orange-500 text-white border-orange-500',
    },
    blue: {
        iconBg: 'bg-blue-600',
        desktopActive: 'bg-blue-500/10 text-blue-500',
        desktopActiveDark: 'bg-blue-500/10 text-blue-500',
        desktopActiveLight: 'bg-blue-50 text-blue-700',
        mobileActive: 'bg-blue-500 text-white border-blue-500',
    },
    emerald: {
        iconBg: 'bg-emerald-500',
        desktopActive: 'bg-emerald-500/10 text-emerald-500',
        desktopActiveDark: 'bg-emerald-500/10 text-emerald-500',
        desktopActiveLight: 'bg-emerald-50 text-emerald-700',
        mobileActive: 'bg-emerald-500 text-white border-emerald-500',
    },
    purple: {
        iconBg: 'bg-purple-500',
        desktopActive: 'bg-purple-500/10 text-purple-500',
        desktopActiveDark: 'bg-purple-500/10 text-purple-500',
        desktopActiveLight: 'bg-purple-50 text-purple-700',
        mobileActive: 'bg-purple-500 text-white border-purple-500',
    },
    amber: {
        iconBg: 'bg-amber-500',
        desktopActive: 'bg-amber-500/10 text-amber-500',
        desktopActiveDark: 'bg-amber-500/10 text-amber-500',
        desktopActiveLight: 'bg-amber-50 text-amber-700',
        mobileActive: 'bg-amber-500 text-white border-amber-500',
    },
    rose: {
        iconBg: 'bg-rose-500',
        desktopActive: 'bg-rose-500/10 text-rose-500',
        desktopActiveDark: 'bg-rose-500/10 text-rose-500',
        desktopActiveLight: 'bg-rose-50 text-rose-700',
        mobileActive: 'bg-rose-500 text-white border-rose-500',
    },
    cyan: {
        iconBg: 'bg-cyan-500',
        desktopActive: 'bg-cyan-500/10 text-cyan-500',
        desktopActiveDark: 'bg-cyan-500/10 text-cyan-500',
        desktopActiveLight: 'bg-cyan-50 text-cyan-700',
        mobileActive: 'bg-cyan-500 text-white border-cyan-500',
    },
    indigo: {
        iconBg: 'bg-indigo-500',
        desktopActive: 'bg-indigo-500/10 text-indigo-500',
        desktopActiveDark: 'bg-indigo-500/10 text-indigo-500',
        desktopActiveLight: 'bg-indigo-50 text-indigo-700',
        mobileActive: 'bg-indigo-500 text-white border-indigo-500',
    },
    teal: {
        iconBg: 'bg-teal-500',
        desktopActive: 'bg-teal-500/10 text-teal-500',
        desktopActiveDark: 'bg-teal-500/10 text-teal-500',
        desktopActiveLight: 'bg-teal-50 text-teal-700',
        mobileActive: 'bg-teal-500 text-white border-teal-500',
    },
    pink: {
        iconBg: 'bg-pink-500',
        desktopActive: 'bg-pink-500/10 text-pink-500',
        desktopActiveDark: 'bg-pink-500/10 text-pink-500',
        desktopActiveLight: 'bg-pink-50 text-pink-700',
        mobileActive: 'bg-pink-500 text-white border-pink-500',
    },
};

/**
 * DemoTemplate - A reusable template for all demo components
 *
 * This component provides a consistent layout with:
 * - Navigation header with tabs (desktop and mobile responsive)
 * - Main content area
 * - Optional footer
 *
 * @example
 * ```tsx
 * <DemoTemplate
 *   moduleId="ecc"
 *   title="Bitcoin Mathematical Principles"
 *   icon={Shield}
 *   accentColor="orange"
 *   tabs={[
 *     { id: 'intro', label: 'Introduction' },
 *     { id: 'demo', label: 'Demo' },
 *     { id: 'quiz', label: 'Quiz' },
 *   ]}
 *   footerText="This demo is for educational purposes only."
 * >
 *   {(activeTab, setActiveTab, isDarkMode) => (
 *     <>
 *       {activeTab === 'intro' && <IntroSection />}
 *       {activeTab === 'demo' && <DemoSection />}
 *       {activeTab === 'quiz' && <QuizSection />}
 *     </>
 *   )}
 * </DemoTemplate>
 * ```
 */
const DemoTemplate: React.FC<DemoTemplateProps> = ({
    title,
    mobileTitle,
    icon: Icon,
    accentColor,
    tabs,
    defaultTab,
    footerText,
    children,
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
    const { isDarkMode } = useLab();
    const colors = colorConfig[accentColor];

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'
        }`}>
            {/* Navigation Header */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-sm' : 'bg-white/90 border-slate-200 backdrop-blur-sm'
            }`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-2">
                            <div className={`${colors.iconBg} text-white p-1.5 rounded-full`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${
                                isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                                {title}
                            </span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${
                                isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                                {mobileTitle || title}
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {tabs.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                            activeTab === tab.id
                                                ? isDarkMode ? colors.desktopActiveDark : colors.desktopActiveLight
                                                : isDarkMode
                                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                    >
                                        {TabIcon && <TabIcon className="h-4 w-4" />}
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-100'
                } scrollbar-hide`}>
                    {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-flex items-center gap-1.5 mr-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                    activeTab === tab.id
                                        ? `${colors.mobileActive} shadow-sm`
                                        : isDarkMode
                                            ? 'bg-slate-800 text-slate-300 border-slate-700 active:bg-slate-700'
                                            : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
                                }`}
                            >
                                {TabIcon && <TabIcon className="h-4 w-4" />}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children(activeTab, setActiveTab, isDarkMode)}
            </main>

            {/* Footer */}
            {footerText && (
                <footer className={`max-w-6xl mx-auto px-4 py-6 text-center text-sm ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                    <p>{footerText}</p>
                </footer>
            )}
        </div>
    );
};

export default DemoTemplate;

// Re-export the hook for convenience
export { useLab } from '../store/LabContext';
