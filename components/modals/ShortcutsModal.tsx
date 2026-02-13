import React from 'react';
import { Keyboard } from 'lucide-react';
import { ShortcutRow } from '../navigation';

interface ShortcutsModalProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose, isDarkMode }) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-w-sm w-full rounded-2xl p-6 border shadow-2xl ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Keyboard className="w-5 h-5 text-orange-500" />
          键盘快捷键
        </h3>
        <div className="space-y-3">
          <ShortcutRow keys={['←']} desc="上一个模块" isDarkMode={isDarkMode} />
          <ShortcutRow keys={['→']} desc="下一个模块" isDarkMode={isDarkMode} />
          <ShortcutRow keys={['Esc']} desc="返回首页" isDarkMode={isDarkMode} />
          <ShortcutRow keys={['?']} desc="显示/隐藏快捷键" isDarkMode={isDarkMode} />
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
        >
          知道了
        </button>
      </div>
    </div>
  );
};

export default ShortcutsModal;
