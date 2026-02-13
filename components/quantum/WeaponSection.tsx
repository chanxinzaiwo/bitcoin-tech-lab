import React, { useState, useEffect } from 'react';
import { Waves, Clock, Zap } from 'lucide-react';

const WeaponSection = () => {
  const [step, setStep] = useState(0); 
  const [waves, setWaves] = useState(Array(24).fill(0.1));

  useEffect(() => {
    let interval: any;
    if (step === 2) {
      interval = setInterval(() => {
        setWaves(prev => prev.map((h, i) => {
          const isPeriod = (i + 1) % 6 === 0;
          const target = isPeriod ? 1.0 : 0.02; 
          return h + (target - h) * 0.1;
        }));
      }, 30);
    } else if (step === 1) {
      interval = setInterval(() => {
         setWaves(prev => prev.map((h) => h + (0.5 - h) * 0.1));
      }, 30);
    } else {
      setWaves(Array(24).fill(0.05));
    }
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                 量子武器 (Shor算法)
            </h2>
            <p className="text-cyan-50 text-lg leading-relaxed">
                经典计算机是在“大海捞针”（穷举），量子计算机是用巨大的磁铁把针吸出来（干涉）。
            </p>
        </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Classical */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col shadow-sm ${step === 0 ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg"><Clock className="w-6 h-6 text-slate-500" /></div>
            <div>
              <h3 className="font-bold text-slate-800">经典方法：时钟穷举</h3>
              <p className="text-xs text-slate-500">在 2^256 个刻度上逐格尝试</p>
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center min-h-[160px]">
            {step === 0 ? (
              <div className="text-center space-y-4">
                <div className="inline-block relative">
                   <Clock className="w-16 h-16 text-slate-400 animate-spin duration-[5000ms]" />
                   <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-slate-600 font-bold">?</div>
                </div>
                <div className="text-sm text-slate-500 animate-pulse">正在尝试旋转... <span className="text-red-500 font-bold">错误</span></div>
              </div>
            ) : (<div className="text-slate-400 text-sm">已暂停</div>)}
          </div>
          <button onClick={() => setStep(0)} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors">重置为经典模式</button>
        </div>

        {/* Quantum */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden flex flex-col shadow-sm ${step > 0 ? 'bg-cyan-50 border-cyan-200 shadow-md' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className={`p-2 rounded-lg transition-colors ${step > 0 ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}><Zap className="w-6 h-6" /></div>
            <div>
              <h3 className={`font-bold transition-colors ${step > 0 ? 'text-cyan-700' : 'text-slate-500'}`}>量子方法：波干涉</h3>
              <p className="text-xs text-slate-500">同时“震动”所有刻度</p>
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-end min-h-[160px] relative z-10">
            <div className="h-32 flex items-end gap-1 px-2 mb-2">
              {waves.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-colors duration-300 ${step === 2 && h > 0.8 ? 'bg-cyan-500' : 'bg-cyan-200'}`} style={{ height: `${h * 100}%` }} />
              ))}
            </div>
            <div className="text-center text-xs h-6 font-mono text-cyan-700">
              {step === 0 && "等待启动..."}
              {step === 1 && "叠加态 (Superposition): 概率均等"}
              {step === 2 && "干涉 (Interference): 锁定周期 T=6"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
            <button onClick={() => setStep(1)} className={`py-3 rounded-xl text-sm font-bold transition-all ${step === 1 ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>1. 叠加</button>
            <button onClick={() => setStep(2)} disabled={step === 0} className={`py-3 rounded-xl text-sm font-bold transition-all ${step === 2 ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30'}`}>2. 干涉</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponSection;