/**
 * Theme utilities for consistent dark/light mode styling
 * Eliminates repetitive ternary expressions throughout components
 */

// Background colors
export const themeBg = {
  primary: (dark: boolean) => dark ? 'bg-slate-950' : 'bg-white',
  secondary: (dark: boolean) => dark ? 'bg-slate-900' : 'bg-slate-50',
  tertiary: (dark: boolean) => dark ? 'bg-slate-800' : 'bg-slate-100',
  card: (dark: boolean) => dark ? 'bg-slate-900' : 'bg-white',
  input: (dark: boolean) => dark ? 'bg-slate-800' : 'bg-white',
  hover: (dark: boolean) => dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
  active: (dark: boolean) => dark ? 'bg-slate-700' : 'bg-slate-200',
};

// Text colors
export const themeText = {
  primary: (dark: boolean) => dark ? 'text-white' : 'text-slate-900',
  secondary: (dark: boolean) => dark ? 'text-slate-200' : 'text-slate-800',
  tertiary: (dark: boolean) => dark ? 'text-slate-300' : 'text-slate-700',
  muted: (dark: boolean) => dark ? 'text-slate-400' : 'text-slate-500',
  dimmed: (dark: boolean) => dark ? 'text-slate-500' : 'text-slate-400',
  placeholder: (dark: boolean) => dark ? 'placeholder-slate-500' : 'placeholder-slate-400',
};

// Border colors
export const themeBorder = {
  primary: (dark: boolean) => dark ? 'border-slate-700' : 'border-slate-200',
  secondary: (dark: boolean) => dark ? 'border-slate-800' : 'border-slate-300',
  hover: (dark: boolean) => dark ? 'hover:border-slate-600' : 'hover:border-slate-400',
  focus: (dark: boolean) => dark ? 'focus:border-orange-500' : 'focus:border-orange-500',
};

// Combined theme classes for common patterns
export const themeCard = (dark: boolean) =>
  `${themeBg.card(dark)} ${themeBorder.primary(dark)} border rounded-xl`;

export const themeCardHover = (dark: boolean) =>
  `${themeCard(dark)} ${themeBg.hover(dark)} transition-colors`;

export const themeInput = (dark: boolean) =>
  `${themeBg.input(dark)} ${themeBorder.primary(dark)} ${themeText.primary(dark)} ${themeText.placeholder(dark)} border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50`;

export const themeButton = {
  primary: () =>
    'bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-4 py-2 transition-colors',
  secondary: (dark: boolean) =>
    `${themeBg.tertiary(dark)} ${themeText.secondary(dark)} ${themeBg.hover(dark)} font-medium rounded-lg px-4 py-2 transition-colors`,
  ghost: (dark: boolean) =>
    `${themeText.muted(dark)} hover:${themeText.primary(dark)} ${themeBg.hover(dark)} rounded-lg px-3 py-2 transition-colors`,
  danger: () =>
    'bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 transition-colors',
  icon: (dark: boolean) =>
    `${themeText.muted(dark)} hover:${themeText.primary(dark)} ${themeBg.hover(dark)} p-2 rounded-full transition-colors`,
};

// Tab styling
export const themeTab = {
  container: (dark: boolean) =>
    `${themeBg.secondary(dark)} rounded-lg p-1`,
  item: (dark: boolean, active: boolean) =>
    active
      ? `${themeBg.card(dark)} ${themeText.primary(dark)} shadow-sm`
      : `${themeText.muted(dark)} hover:${themeText.secondary(dark)}`,
  base: 'px-4 py-2 rounded-md font-medium text-sm transition-all',
};

// Modal styling
export const themeModal = {
  overlay: 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm',
  content: (dark: boolean) =>
    `${themeBg.card(dark)} ${themeBorder.secondary(dark)} border rounded-2xl shadow-2xl`,
  header: (dark: boolean) =>
    `${themeText.primary(dark)} text-lg font-bold`,
};

// Section styling
export const themeSection = (dark: boolean) =>
  `${themeBg.secondary(dark)} ${themeBorder.secondary(dark)} border rounded-2xl p-6`;

// Code/monospace styling
export const themeCode = (dark: boolean) =>
  `${dark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'} font-mono text-sm px-2 py-1 rounded`;

// Badge styling
export const themeBadge = {
  default: (dark: boolean) =>
    `${dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'} text-xs px-2 py-0.5 rounded-full`,
  success: () =>
    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full',
  warning: () =>
    'bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full',
  danger: () =>
    'bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded-full',
  info: () =>
    'bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full',
};

// Utility function to combine classes conditionally
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Type for isDarkMode prop
export interface ThemeProps {
  isDarkMode: boolean;
}

// Preset color schemes for various UI elements
export const colorSchemes = {
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/50',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/50',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/50',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/50',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/50',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/50',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    hoverBorder: 'hover:border-red-500/50',
  },
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/20',
    hoverBorder: 'hover:border-pink-500/50',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/50',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/50',
  },
  teal: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/20',
    hoverBorder: 'hover:border-teal-500/50',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
    hoverBorder: 'hover:border-yellow-500/50',
  },
  lime: {
    bg: 'bg-lime-500/10',
    text: 'text-lime-400',
    border: 'border-lime-500/20',
    hoverBorder: 'hover:border-lime-500/50',
  },
} as const;

export type ColorScheme = keyof typeof colorSchemes;

// Get color scheme classes as a single string
export function getColorClasses(color: ColorScheme): string {
  const scheme = colorSchemes[color];
  return `${scheme.bg} ${scheme.text} ${scheme.border} ${scheme.hoverBorder}`;
}

// ========================================
// CSS Variable Utilities
// ========================================

// CSS Variable names (for use with getComputedStyle or CSS var())
export const cssVars = {
  // Brand colors
  bitcoin: '--color-bitcoin',
  bitcoinLight: '--color-bitcoin-light',
  bitcoinDark: '--color-bitcoin-dark',

  // Background colors
  bgPrimary: '--color-bg-primary',
  bgSecondary: '--color-bg-secondary',
  bgTertiary: '--color-bg-tertiary',
  bgElevated: '--color-bg-elevated',
  bgHover: '--color-bg-hover',
  bgActive: '--color-bg-active',

  // Text colors
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textTertiary: '--color-text-tertiary',
  textMuted: '--color-text-muted',
  textInverted: '--color-text-inverted',

  // Border colors
  borderPrimary: '--color-border-primary',
  borderSecondary: '--color-border-secondary',
  borderFocus: '--color-border-focus',

  // Status colors
  success: '--color-success',
  successBg: '--color-success-bg',
  warning: '--color-warning',
  warningBg: '--color-warning-bg',
  error: '--color-error',
  errorBg: '--color-error-bg',
  info: '--color-info',
  infoBg: '--color-info-bg',

  // Shadows
  shadowSm: '--shadow-sm',
  shadowMd: '--shadow-md',
  shadowLg: '--shadow-lg',
  shadowXl: '--shadow-xl',

  // Transitions
  transitionFast: '--transition-fast',
  transitionNormal: '--transition-normal',
  transitionSlow: '--transition-slow',
} as const;

export type CssVarName = typeof cssVars[keyof typeof cssVars];

/**
 * Get the current value of a CSS variable
 */
export function getCssVar(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Set a CSS variable value
 */
export function setCssVar(varName: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Check if dark mode is currently active via DOM
 */
export function isDarkModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * Initialize theme from localStorage or system preference
 */
export function initializeTheme(): boolean {
  if (typeof window === 'undefined') return false;

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    return true;
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    return false;
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
    return prefersDark;
  }
}

// Color palette constants (for JavaScript usage where CSS vars aren't applicable)
export const colors = {
  bitcoin: {
    DEFAULT: '#f97316',
    light: '#fdba74',
    dark: '#ea580c',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export type StatusColor = keyof typeof colors.status;
