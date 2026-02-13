import React from 'react';

interface ShortcutRowProps {
  keys: string[];
  desc: string;
  isDarkMode: boolean;
}

const ShortcutRow: React.FC<ShortcutRowProps> = ({ keys, desc, isDarkMode }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</span>
    <div className="flex gap-1">
      {keys.map((key, i) => (
        <kbd key={i} className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

export default ShortcutRow;
