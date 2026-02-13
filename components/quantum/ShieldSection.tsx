import React, { useState } from 'react';
import { Shield, Key, ArrowRight, Eye, Lock, XCircle, Database, Zap } from 'lucide-react';

const ShieldSection = () => {
  const [revealed, setRevealed] = useState(false);
  const [reverseAttempt, setReverseAttempt] = useState(false);

  const attemptReverse = () => {
    setReverseAttempt(true);
    setTimeout(() => setReverseAttempt(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                 哈希盾牌 (防御)
            </h2>
            <p className="text-green-50 text-lg leading-relaxed">
                Shor算法必须知道**公钥**才能工作。但比特币地址是公钥的**哈希值**。哈希函数（SHA-256）是单向的，没有数学周期性，能有效抵御Shor算法。
            </p>
        </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden shadow-sm">
        {/* Flow Diagram */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Private Key */}
          <div className="group relative">
            <div className="w-32 h-32 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm">
              <Key className="w-10 h-10 text-red-500" />
              <span className="text-red-500 font-bold text-sm">私钥</span>
              <span className="text-[10px] text-red-400 font-mono">TOP SECRET</span>
            </div>
          </div>

          <ArrowRight className="text-slate-300 hidden md:block" />

          {/* Public Key */}
          <div className="group relative">
            <div className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-500 shadow-sm ${revealed ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
              <div className="relative">
                <Eye className={`w-10 h-10 transition-colors ${revealed ? 'text-orange-500' : 'text-slate-400'}`} />
                {!revealed && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center"><Lock className="w-5 h-5 text-slate-500" /></div>}
              </div>
              <span className={`font-bold text-sm ${revealed ? 'text-orange-500' : 'text-slate-400'}`}>公钥</span>
              <span className="text-[10px] text-slate-400 font-mono px-2 truncate w-full text-center">
                {revealed ? "04a34b..." : "Locked"}
              </span>
            </div>
             
             {/* Toggle Button */}
             <button 
                onClick={() => setRevealed(!revealed)}
                className="absolute -top-3 -right-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 p-1.5 rounded-full shadow transition-transform hover:scale-110"
                title={revealed ? "隐藏公钥" : "暴露公钥"}
             >
               {revealed ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
             </button>
          </div>

          <ArrowRight className="text-slate-300 hidden md:block" />

          {/* Hash Function */}
          <div className="relative group cursor-not-allowed" onClick={attemptReverse}>
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-xs font-mono shadow-sm transition-all duration-300 border ${reverseAttempt ? 'bg-red-50 border-red-500 animate-shake' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              {reverseAttempt ? <XCircle className="w-8 h-8 text-red-500 mb-1" /> : <div>SHA-256<br/>RIPEMD</div>}
            </div>
            {reverseAttempt && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">不可逆!</div>}
          </div>

          <ArrowRight className="text-slate-300 hidden md:block" />

          {/* Address */}
          <div className="group relative">
             <div className="w-32 h-32 bg-green-50 border border-green-200 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm">
              <Database className="w-10 h-10 text-green-600" />
              <span className="text-green-600 font-bold text-sm">比特币地址</span>
              <span className="text-[10px] text-green-600 font-mono px-2 bg-green-100 rounded">1BvBM...</span>
            </div>
          </div>
        </div>

        {/* Quantum Attack Simulation */}
        <div className="mt-16 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="flex-1 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" /> 量子攻击者视角
            </h4>
            <p className="text-sm text-slate-600">
              {revealed 
                ? <span className="text-orange-600 font-bold">警告：公钥已暴露！盾牌失效。Shor算法可以锁定目标。</span>
                : <span>安全状态：攻击者只能看到“地址”。Shor算法无法逆向哈希函数，找不到公钥入口。</span>
              }
            </p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-64">
             <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 font-mono text-xs text-slate-400">
               <div>$ target = {revealed ? <span className="text-orange-400">PUBLIC_KEY</span> : <span className="text-green-400">HASH(PK)</span>}</div>
               <div>$ run shor_algo(target)</div>
               <div className="mt-2">
                 {revealed 
                   ? <span className="text-red-400 animate-pulse">{'>'} CRACKING PRIVATE KEY...</span>
                   : <span className="text-red-500">{'>'} ERROR: Input Invalid</span>
                 }
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShieldSection;