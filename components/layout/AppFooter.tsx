import React from 'react';
import { TOTAL_MODULES } from '../../config/navigation';

interface AppFooterProps {
  isDarkMode: boolean;
  progress: {
    visited: number;
    total: number;
  };
}

const AppFooter: React.FC<AppFooterProps> = ({ isDarkMode, progress }) => {
  return (
    <footer
      className={`border-t py-8 mt-auto ${
        isDarkMode
          ? 'border-slate-900 bg-slate-950 text-slate-500'
          : 'border-slate-200 bg-slate-50 text-slate-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs">学习进度</span>
            <span
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}
            >
              {progress.visited}/{TOTAL_MODULES}
            </span>
          </div>
          <div
            className={`w-48 h-1.5 mx-auto rounded-full overflow-hidden ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
              style={{ width: `${(progress.visited / TOTAL_MODULES) * 100}%` }}
            />
          </div>
        </div>
        <p>
          © {new Date().getFullYear()} Bitcoin Tech Lab. Educational
          demonstrations only.
        </p>
        <p className="mt-2 text-xs hidden md:block">
          提示: 按{' '}
          <kbd
            className={`px-1.5 py-0.5 rounded ${
              isDarkMode
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            ?
          </kbd>{' '}
          查看键盘快捷键
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
