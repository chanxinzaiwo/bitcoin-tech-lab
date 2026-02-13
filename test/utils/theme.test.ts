import { describe, it, expect } from 'vitest';
import {
  themeBg,
  themeText,
  themeBorder,
  themeCard,
  themeInput,
  themeButton,
  themeTab,
  themeBadge,
  cn,
  colorSchemes,
  getColorClasses,
} from '../../utils/theme';

describe('theme utilities', () => {
  describe('themeBg', () => {
    it('should return dark mode classes when isDarkMode is true', () => {
      expect(themeBg.primary(true)).toBe('bg-slate-950');
      expect(themeBg.secondary(true)).toBe('bg-slate-900');
      expect(themeBg.card(true)).toBe('bg-slate-900');
    });

    it('should return light mode classes when isDarkMode is false', () => {
      expect(themeBg.primary(false)).toBe('bg-white');
      expect(themeBg.secondary(false)).toBe('bg-slate-50');
      expect(themeBg.card(false)).toBe('bg-white');
    });
  });

  describe('themeText', () => {
    it('should return dark mode text classes', () => {
      expect(themeText.primary(true)).toBe('text-white');
      expect(themeText.muted(true)).toBe('text-slate-400');
    });

    it('should return light mode text classes', () => {
      expect(themeText.primary(false)).toBe('text-slate-900');
      expect(themeText.muted(false)).toBe('text-slate-500');
    });
  });

  describe('themeBorder', () => {
    it('should return correct border classes', () => {
      expect(themeBorder.primary(true)).toBe('border-slate-700');
      expect(themeBorder.primary(false)).toBe('border-slate-200');
    });
  });

  describe('themeCard', () => {
    it('should return combined card classes for dark mode', () => {
      const classes = themeCard(true);
      expect(classes).toContain('bg-slate-900');
      expect(classes).toContain('border-slate-700');
      expect(classes).toContain('rounded-xl');
    });

    it('should return combined card classes for light mode', () => {
      const classes = themeCard(false);
      expect(classes).toContain('bg-white');
      expect(classes).toContain('border-slate-200');
    });
  });

  describe('themeInput', () => {
    it('should return input classes with focus states', () => {
      const classes = themeInput(true);
      expect(classes).toContain('focus:outline-none');
      expect(classes).toContain('focus:ring-2');
    });
  });

  describe('themeButton', () => {
    it('should return primary button classes', () => {
      const classes = themeButton.primary();
      expect(classes).toContain('bg-orange-500');
      expect(classes).toContain('hover:bg-orange-600');
    });

    it('should return secondary button classes based on theme', () => {
      const darkClasses = themeButton.secondary(true);
      const lightClasses = themeButton.secondary(false);
      expect(darkClasses).not.toBe(lightClasses);
    });

    it('should return danger button classes', () => {
      const classes = themeButton.danger();
      expect(classes).toContain('bg-red-500');
    });
  });

  describe('themeTab', () => {
    it('should return active tab styling', () => {
      const activeClasses = themeTab.item(true, true);
      expect(activeClasses).toContain('bg-slate-900');
      expect(activeClasses).toContain('shadow-sm');
    });

    it('should return inactive tab styling', () => {
      const inactiveClasses = themeTab.item(true, false);
      expect(inactiveClasses).toContain('text-slate-400');
    });
  });

  describe('themeBadge', () => {
    it('should return success badge classes', () => {
      const classes = themeBadge.success();
      expect(classes).toContain('text-emerald-400');
      expect(classes).toContain('bg-emerald-500/20');
    });

    it('should return warning badge classes', () => {
      const classes = themeBadge.warning();
      expect(classes).toContain('text-amber-400');
    });

    it('should return danger badge classes', () => {
      const classes = themeBadge.danger();
      expect(classes).toContain('text-red-400');
    });
  });

  describe('cn utility', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', false, null, undefined, 'class2')).toBe('class1 class2');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active')).toBe('base active');
    });
  });

  describe('colorSchemes', () => {
    it('should have all expected color schemes', () => {
      expect(colorSchemes.orange).toBeDefined();
      expect(colorSchemes.emerald).toBeDefined();
      expect(colorSchemes.blue).toBeDefined();
      expect(colorSchemes.purple).toBeDefined();
    });

    it('should have bg, text, border, and hoverBorder for each scheme', () => {
      const scheme = colorSchemes.orange;
      expect(scheme.bg).toBeDefined();
      expect(scheme.text).toBeDefined();
      expect(scheme.border).toBeDefined();
      expect(scheme.hoverBorder).toBeDefined();
    });
  });

  describe('getColorClasses', () => {
    it('should return combined color classes', () => {
      const classes = getColorClasses('orange');
      expect(classes).toContain('bg-orange-500/10');
      expect(classes).toContain('text-orange-400');
      expect(classes).toContain('border-orange-500/20');
    });
  });
});
